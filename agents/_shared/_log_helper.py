"""Helper for log-task-local.ps1: reads JSON config from argv[1], inserts row."""
import json
import sqlite3
import sys

config_path = sys.argv[1]
with open(config_path, "r", encoding="utf-8-sig") as f:
    cfg = json.load(f)

db       = cfg["db_path"]
id_      = cfg["id"]
agent    = cfg["agent_name"]
task     = cfg["task_description"]
model    = cfg["model_used"]
status   = cfg["status"]
ts       = cfg["created_at"]

con = sqlite3.connect(db)
cur = con.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS agent_logs (
    id TEXT PRIMARY KEY,
    agent_name TEXT NOT NULL,
    task_description TEXT NOT NULL,
    model_used TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
)""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_agent_name ON agent_logs(agent_name)")
cur.execute("CREATE INDEX IF NOT EXISTS idx_status     ON agent_logs(status)")
cur.execute("CREATE INDEX IF NOT EXISTS idx_created_at ON agent_logs(created_at DESC)")
cur.execute(
    "INSERT INTO agent_logs (id, agent_name, task_description, model_used, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    (id_, agent, task, model, status, ts),
)
con.commit()
con.close()
print("OK")
