#!/usr/bin/env python3
"""
AgentOS Mission Control — Dashboard Backend
Python stdlib http.server on port 8765.

Routes:
  GET  /                  → index.html
  GET  /api/agents        → list all agents + status
  GET  /api/board         → kanban board tasks
  POST /api/board         → create/update task
  GET  /api/logs          → agent activity logs
  POST /api/prompt        → send prompt to agent, returns result
  GET  /api/health        → system health check
  POST /api/agent/start   → start background agent task
  GET  /api/agent/status  → check running agent status
  GET  /api/graphify/status → check if graph exists
  POST /api/graphify/build  → build knowledge graph
  POST /api/graphify/query  → query the graph
"""

import http.server
import json
import os
import sqlite3
import subprocess
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# --- Config ---
PORT = 8765
HERMES_HOME = Path(os.environ.get("HERMES_HOME", Path.home() / ".hermes"))
# Force correct path if env var points elsewhere
if not (HERMES_HOME / "board.db").exists():
    HERMES_HOME = Path.home() / ".hermes"
OBSIDIAN_ROOT = Path.home() / "Documents" / "ObsidianVault" / "AgentOS"
DB_BOARD = HERMES_HOME / "board.db"
DB_LOGS = HERMES_HOME / "agent-logs.db"
LOG_SCRIPT = HERMES_HOME / "agents" / "_shared" / "log-task-local.ps1"
INDEX_HTML = HERMES_HOME / "index.html"

# Agent definitions
AGENTS = {
    "orchestrator": {
        "name": "Orchestrator",
        "role": "Routes work, manages board, coordinates all agents",
        "workspace": str(HERMES_HOME / "agents" / "orchestrator"),
        "content": str(HERMES_HOME / "content" / "orchestrator"),
        "obsidian": str(OBSIDIAN_ROOT / "orchestrator"),
        "discord_channel": "#orchestrator",
        "discord_id": "",
        "tools": ["hermes", "dashboard"],
    },
    "scout": {
        "name": "Scout",
        "role": "Research, trends, raw material gathering",
        "workspace": str(HERMES_HOME / "agents" / "scout"),
        "content": str(HERMES_HOME / "content" / "scout"),
        "obsidian": str(OBSIDIAN_ROOT / "scout"),
        "discord_channel": "#scout-feed",
        "discord_id": "",
        "tools": ["hermes", "web_search"],
    },
    "scribe": {
        "name": "Scribe",
        "role": "Writing: blogs, threads, articles, copy",
        "workspace": str(HERMES_HOME / "agents" / "scribe"),
        "content": str(HERMES_HOME / "content" / "scribe"),
        "obsidian": str(OBSIDIAN_ROOT / "scribe"),
        "discord_channel": "#scribe-drafts",
        "discord_id": "",
        "tools": ["hermes", "claude_code", "opencode"],
    },
    "reach": {
        "name": "Reach",
        "role": "Distribution, outreach, growth",
        "workspace": str(HERMES_HOME / "agents" / "reach"),
        "content": str(HERMES_HOME / "content" / "reach"),
        "obsidian": str(OBSIDIAN_ROOT / "reach"),
        "discord_channel": "#reach-outreach",
        "discord_id": "",
        "tools": ["hermes"],
    },
    "dev": {
        "name": "Dev",
        "role": "Tools, automation, code, integrations",
        "workspace": str(HERMES_HOME / "agents" / "dev"),
        "content": str(HERMES_HOME / "content" / "dev"),
        "obsidian": str(OBSIDIAN_ROOT / "dev"),
        "discord_channel": "#dev-builds",
        "discord_id": "",
        "tools": ["hermes", "claude_code", "opencode", "openclaw"],
    },
    "cashflow": {
        "name": "Cashflow",
        "role": "Monetization, deals, income tracking",
        "workspace": str(HERMES_HOME / "agents" / "cashflow"),
        "content": str(HERMES_HOME / "content" / "cashflow"),
        "obsidian": str(OBSIDIAN_ROOT / "cashflow"),
        "discord_channel": "#cashflow-deals",
        "discord_id": "",
        "tools": ["hermes"],
    },
}

# Backend tools (CLI agents)
BACKEND_TOOLS = {
    "hermes": {
        "name": "Hermes Agent",
        "backend": "ollama",
        "model": "minimax-m3:cloud",
        "endpoint": "http://127.0.0.1:11434/v1",
        "status": "available",
    },
    "claude_code": {
        "name": "Claude Code",
        "backend": "claude_code_cli",
        "command": "claude",
        "status": "available",
    },
    "opencode": {
        "name": "OpenCode",
        "backend": "opencode_cli",
        "command": "opencode",
        "status": "available",
    },
    "openclaw": {
        "name": "OpenClaw",
        "backend": "openclaw_cli",
        "command": "openclaw",
        "status": "available",
    },
}

# Track running background tasks
RUNNING_TASKS = {}


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def db_connect(db_path):
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def get_board_tasks():
    conn = db_connect(DB_BOARD)
    rows = conn.execute("SELECT * FROM tasks ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_agent_logs(limit=50):
    conn = db_connect(DB_LOGS)
    rows = conn.execute(
        "SELECT * FROM agent_logs ORDER BY created_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def log_agent_task(agent_name, task_description, status="completed", model="minimax-m3:cloud"):
    """Log a task via the PowerShell helper."""
    try:
        cmd = [
            "powershell", "-ExecutionPolicy", "Bypass", "-File",
            str(LOG_SCRIPT),
            "-AgentName", agent_name,
            "-TaskDescription", task_description,
            "-Status", status,
            "-ModelUsed", model,
        ]
        subprocess.run(cmd, capture_output=True, timeout=15)
    except Exception as e:
        print(f"[WARN] Log failed: {e}")


def run_agent_prompt(agent_name, prompt, tool="hermes"):
    """Send a prompt to the selected backend tool and return the result."""
    tool_info = BACKEND_TOOLS.get(tool, BACKEND_TOOLS["hermes"])
    task_id = str(uuid.uuid4())[:8]

    # Log start
    log_agent_task(agent_name, f"prompt: {prompt[:80]}", status="started")

    result = {"task_id": task_id, "agent": agent_name, "tool": tool, "status": "running", "started_at": utc_now()}

    if tool_info["backend"] == "ollama":
        try:
            import urllib.request
            payload = json.dumps({
                "model": tool_info["model"],
                "messages": [{"role": "user", "content": prompt}],
                "stream": False,
            }).encode()
            req = urllib.request.Request(
                f"{tool_info['endpoint']}/chat/completions",
                data=payload,
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read())
                result["output"] = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                result["status"] = "completed"
        except Exception as e:
            result["output"] = f"ERROR: {e}"
            result["status"] = "failed"

    elif tool_info["backend"] in ("claude_code_cli", "opencode_cli", "openclaw_cli"):
        cmd = tool_info.get("command", tool)
        try:
            proc = subprocess.run(
                [cmd, "-p", prompt],
                capture_output=True, text=True, timeout=120,
                cwd=str(HERMES_HOME / "agents" / agent_name),
            )
            result["output"] = proc.stdout or proc.stderr
            result["status"] = "completed" if proc.returncode == 0 else "failed"
        except FileNotFoundError:
            result["output"] = f"ERROR: {cmd} not found on PATH"
            result["status"] = "failed"
        except Exception as e:
            result["output"] = f"ERROR: {e}"
            result["status"] = "failed"

    result["completed_at"] = utc_now()
    log_agent_task(agent_name, f"prompt: {prompt[:80]}", status=result["status"])
    return result


def update_board_task(task_id, title=None, status=None, priority=None, notes=None):
    conn = db_connect(DB_BOARD)
    updates = []
    params = []
    if title:
        updates.append("title = ?")
        params.append(title)
    if status:
        updates.append("status = ?")
        params.append(status)
    if priority:
        updates.append("priority = ?")
        params.append(priority)
    if notes:
        updates.append("notes = ?")
        params.append(notes)
    updates.append("updated_at = ?")
    params.append(utc_now())
    params.append(task_id)
    conn.execute(f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?", params)
    conn.commit()
    conn.close()


def create_board_task(title, priority="medium", notes=""):
    task_id = str(uuid.uuid4())
    conn = db_connect(DB_BOARD)
    conn.execute(
        "INSERT INTO tasks (id, title, status, priority, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (task_id, title, "pending", priority, notes, utc_now(), utc_now()),
    )
    conn.commit()
    conn.close()
    return task_id


# --- Graphify ---
GRAPHIFY_EXE = Path.home() / "AppData/Roaming/Python/Python314/Scripts/graphify.exe"
GRAPHIFY_OUT = HERMES_HOME / "graphify-out"


def graphify_status():
    """Check if a graph exists and its metadata."""
    graph_json = GRAPHIFY_OUT / "graph.json"
    graph_html = GRAPHIFY_OUT / "graph.html"
    graph_report = GRAPHIFY_OUT / "GRAPH_REPORT.md"
    cache_dir = GRAPHIFY_OUT / "cache"

    result = {
        "installed": GRAPHIFY_EXE.exists(),
        "graph_exists": graph_json.exists(),
        "html_exists": graph_html.exists(),
        "report_exists": graph_report.exists(),
        "cache_exists": cache_dir.exists(),
        "graph_path": str(GRAPHIFY_OUT),
    }

    if graph_json.exists():
        result["graph_size_kb"] = round(graph_json.stat().st_size / 1024, 1)
    if cache_dir.exists():
        result["cache_files"] = len(list(cache_dir.iterdir()))

    return result


def graphify_build(target_path, backend="ollama", model="minimax-m3:cloud"):
    """Build a knowledge graph from a target path."""
    if not GRAPHIFY_EXE.exists():
        return {"status": "failed", "error": "graphify not found on PATH"}

    result = {"status": "running", "started_at": utc_now(), "target": target_path}

    try:
        env = os.environ.copy()
        env["OLLAMA_API_KEY"] = "ollama"
        env["OPENAI_BASE_URL"] = "http://127.0.0.1:11434/v1"
        env["OPENAI_API_KEY"] = "ollama"

        proc = subprocess.run(
            [str(GRAPHIFY_EXE), target_path, "--backend", backend, "--model", model, "--max-concurrency", "1"],
            capture_output=True, text=True, timeout=600,
            env=env,
        )
        result["output"] = proc.stdout or proc.stderr
        result["status"] = "completed" if proc.returncode == 0 else "failed"
        result["returncode"] = proc.returncode
    except subprocess.TimeoutExpired:
        result["status"] = "timeout"
        result["output"] = "Build timed out after 600s"
    except Exception as e:
        result["status"] = "failed"
        result["output"] = str(e)

    result["completed_at"] = utc_now()
    return result


def graphify_query(query_text):
    """Query an existing knowledge graph."""
    graph_json = GRAPHIFY_OUT / "graph.json"
    if not graph_json.exists():
        return {"status": "failed", "error": "No graph found. Run graphify build first."}

    try:
        import subprocess
        env = os.environ.copy()
        env["OLLAMA_API_KEY"] = "ollama"
        env["OPENAI_BASE_URL"] = "http://127.0.0.1:11434/v1"
        env["OPENAI_API_KEY"] = "ollama"

        result = subprocess.run(
            [r"C:\Users\poove\AppData\Roaming\Python\Python314\Scripts\graphify.exe", "query", query_text, "--graph", str(graph_json)],
            capture_output=True, text=True, timeout=60, env=env
        )
        if result.returncode == 0:
            return {"status": "completed", "result": result.stdout}
        else:
            return {"status": "failed", "error": result.stderr or result.stdout}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


# --- HTTP Handler ---
class DashboardHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{utc_now()}] {args[0]}")

    def send_json(self, data, status=200):
        body = json.dumps(data, default=str).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, html, status=200):
        body = html.encode()
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "" or path == "/index.html":
            if INDEX_HTML.exists():
                self.send_html(INDEX_HTML.read_text(encoding="utf-8"))
            else:
                self.send_html("<h1>Mission Control</h1><p>index.html not found</p>", 404)
            return

        if path == "/api/agents":
            self.send_json({"agents": AGENTS, "tools": BACKEND_TOOLS})
            return

        if path == "/api/board":
            self.send_json({"tasks": get_board_tasks()})
            return

        if path == "/api/logs":
            qs = parse_qs(parsed.query)
            limit = int(qs.get("limit", ["50"])[0])
            self.send_json({"logs": get_agent_logs(limit)})
            return

        if path == "/api/health":
            # Check Ollama
            ollama_ok = False
            try:
                import urllib.request
                req = urllib.request.Request("http://127.0.0.1:11434/api/tags")
                with urllib.request.urlopen(req, timeout=5) as resp:
                    ollama_ok = resp.status == 200
            except Exception:
                pass

            # Check DBs
            board_ok = DB_BOARD.exists()
            logs_ok = DB_LOGS.exists()

            self.send_json({
                "status": "ok" if all([ollama_ok, board_ok, logs_ok]) else "degraded",
                "ollama": ollama_ok,
                "board_db": board_ok,
                "logs_db": logs_ok,
                "agents": len(AGENTS),
                "tools": len(BACKEND_TOOLS),
                "timestamp": utc_now(),
            })
            return

        if path == "/api/agent/status":
            self.send_json({"running": RUNNING_TASKS})
            return

        if path == "/api/graphify/status":
            self.send_json(graphify_status())
            return

        self.send_json({"error": "Not found"}, 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            data = {}

        if path == "/api/prompt":
            agent = data.get("agent", "orchestrator")
            prompt = data.get("prompt", "")
            tool = data.get("tool", "hermes")
            if not prompt:
                self.send_json({"error": "prompt required"}, 400)
                return
            result = run_agent_prompt(agent, prompt, tool)
            self.send_json(result)
            return

        if path == "/api/board":
            action = data.get("action", "create")
            if action == "create":
                task_id = create_board_task(
                    data.get("title", "Untitled"),
                    data.get("priority", "medium"),
                    data.get("notes", ""),
                )
                self.send_json({"task_id": task_id, "status": "created"})
            elif action == "update":
                task_id = data.get("task_id")
                if not task_id:
                    self.send_json({"error": "task_id required for update"}, 400)
                    return
                update_board_task(
                    task_id,
                    title=data.get("title"),
                    status=data.get("status"),
                    priority=data.get("priority"),
                    notes=data.get("notes"),
                )
                self.send_json({"status": "updated", "task_id": task_id})
            else:
                self.send_json({"error": f"Unknown action: {action}"}, 400)
            return

        if path == "/api/agent/start":
            agent = data.get("agent", "orchestrator")
            prompt = data.get("prompt", "")
            tool = data.get("tool", "hermes")
            if not prompt:
                self.send_json({"error": "prompt required"}, 400)
                return

            task_id = str(uuid.uuid4())[:8]
            RUNNING_TASKS[task_id] = {
                "agent": agent, "tool": tool, "prompt": prompt[:100],
                "status": "running", "started_at": utc_now(),
            }

            def bg_run(tid, ag, pr, tl):
                result = run_agent_prompt(ag, pr, tl)
                RUNNING_TASKS[tid]["status"] = result["status"]
                RUNNING_TASKS[tid]["output"] = result.get("output", "")
                RUNNING_TASKS[tid]["completed_at"] = utc_now()

            t = threading.Thread(target=bg_run, args=(task_id, agent, prompt, tool), daemon=True)
            t.start()
            self.send_json({"task_id": task_id, "status": "running"})
            return

        if path == "/api/graphify/build":
            target = data.get("target", str(HERMES_HOME))
            backend = data.get("backend", "ollama")
            model = data.get("model", "qwen2.5:3b")

            task_id = str(uuid.uuid4())[:8]
            RUNNING_TASKS[f"graphify-{task_id}"] = {
                "type": "graphify_build", "target": target,
                "status": "running", "started_at": utc_now(),
            }

            def bg_graphify(tid, tgt, be, md):
                result = graphify_build(tgt, be, md)
                RUNNING_TASKS[f"graphify-{tid}"]["status"] = result["status"]
                RUNNING_TASKS[f"graphify-{tid}"]["output"] = result.get("output", "")
                RUNNING_TASKS[f"graphify-{tid}"]["completed_at"] = utc_now()

            t = threading.Thread(target=bg_graphify, args=(task_id, target, backend, model), daemon=True)
            t.start()
            self.send_json({"task_id": task_id, "status": "running", "target": target})
            return

        if path == "/api/graphify/query":
            query = data.get("query", "")
            if not query:
                self.send_json({"error": "query required"}, 400)
                return
            result = graphify_query(query)
            self.send_json(result)
            return

        self.send_json({"error": "Not found"}, 404)


def main():
    print(f"[{utc_now()}] AgentOS Mission Control starting on port {PORT}")
    print(f"  Dashboard: http://localhost:{PORT}")
    print(f"  API:       http://localhost:{PORT}/api/health")
    print(f"  Ollama:    http://127.0.0.1:11434")

    server = http.server.HTTPServer(("0.0.0.0", PORT), DashboardHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print(f"\n[{utc_now()}] Shutting down.")
        server.server_close()


if __name__ == "__main__":
    main()
