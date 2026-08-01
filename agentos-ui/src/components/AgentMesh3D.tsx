import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

type AgentMeshId = 'hermes' | 'claude' | 'opencode' | 'openclaw'

const COLORS: Record<AgentMeshId, { primary: string; accent: string; emissive: string }> = {
  hermes:   { primary: '#7c6cf5', accent: '#a89aff', emissive: '#7c6cf5' },
  claude:   { primary: '#ff4d6d', accent: '#ff8095', emissive: '#ff4d6d' },
  opencode: { primary: '#ffb347', accent: '#ffd07a', emissive: '#ffb347' },
  openclaw: { primary: '#00e5ff', accent: '#7df3ff', emissive: '#00e5ff' },
}

interface AgentMeshProps {
  agentId: AgentMeshId
  size?: number
  autoRotate?: boolean
  showControls?: boolean
  onClick?: () => void
}

export function AgentMesh3D({ agentId, size = 240, autoRotate = true, showControls = false, onClick }: AgentMeshProps) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }} aria-label={`3D mesh for ${agentId}`}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 35 }} dpr={[1, 2]}>
        <color attach="background" args={['#0a0d1a']} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} />
        <pointLight position={[-3, -2, 3]} intensity={0.6} color={COLORS[agentId].accent} />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
            <AgentFigure agentId={agentId} autoRotate={autoRotate} onClick={onClick} />
          </Float>
          <Environment preset="city" />
        </Suspense>
        {showControls && <OrbitControls enableZoom={false} enablePan={false} />}
      </Canvas>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 60%, #0a0d1a 100%)' }} />
    </div>
  )
}

function AgentFigure({ agentId, autoRotate, onClick }: { agentId: AgentMeshId; autoRotate?: boolean; onClick?: () => void }) {
  const group = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const c = COLORS[agentId]
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: c.primary, metalness: 0.55, roughness: 0.35, emissive: c.emissive, emissiveIntensity: 0.18 }), [c])
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: c.accent, metalness: 0.8, roughness: 0.2, emissive: c.accent, emissiveIntensity: 0.4 }), [c])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    if (autoRotate) group.current.rotation.y = t * 0.4
    group.current.position.y = Math.sin(t * 1.3) * 0.06
    if (haloRef.current) {
      const m = haloRef.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.15 + Math.sin(t * 1.8) * 0.05
    }
  })

  return (
    <group ref={group} onClick={onClick}>
      {/* glow halo behind */}
      <mesh ref={haloRef} position={[0, 0, -0.6]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color={c.primary} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {agentId === 'hermes' && <HermesFigure mat={mat} accentMat={accentMat} />}
      {agentId === 'claude' && <ClaudeFigure mat={mat} accentMat={accentMat} />}
      {agentId === 'opencode' && <OpenCodeFigure mat={mat} accentMat={accentMat} />}
      {agentId === 'openclaw' && <OpenClawFigure mat={mat} accentMat={accentMat} />}
    </group>
  )
}

function HermesFigure({ mat, accentMat }: { mat: THREE.Material; accentMat: THREE.Material; }) {
  return (
    <group>
      {/* body — orb core */}
      <mesh material={mat}><sphereGeometry args={[0.85, 32, 32]} /></mesh>
      {/* orbits */}
      <mesh material={accentMat}><torusGeometry args={[1.25, 0.04, 16, 96]} /></mesh>
      <mesh material={accentMat} rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[1.4, 0.03, 16, 96]} /></mesh>
      <mesh material={accentMat} rotation={[0, Math.PI / 3, Math.PI / 3]}><torusGeometry args={[1.55, 0.025, 16, 96]} /></mesh>
      {/* crown */}
      <mesh position={[0, 1.0, 0]} material={accentMat}><coneGeometry args={[0.18, 0.35, 6]} /></mesh>
      <mesh position={[0.35, 0.95, 0]} material={accentMat}><coneGeometry args={[0.12, 0.25, 6]} /></mesh>
      <mesh position={[-0.35, 0.95, 0]} material={accentMat}><coneGeometry args={[0.12, 0.25, 6]} /></mesh>
      {/* eyes */}
      <mesh position={[0.28, 0.15, 0.78]} material={accentMat}><sphereGeometry args={[0.07, 16, 16]} /></mesh>
      <mesh position={[-0.28, 0.15, 0.78]} material={accentMat}><sphereGeometry args={[0.07, 16, 16]} /></mesh>
    </group>
  )
}

function ClaudeFigure({ mat, accentMat }: { mat: THREE.Material; accentMat: THREE.Material; }) {
  return (
    <group>
      {/* head */}
      <mesh material={mat} position={[0, 0.4, 0]}><sphereGeometry args={[0.65, 32, 32]} /></mesh>
      {/* torso */}
      <mesh material={mat} position={[0, -0.4, 0]}><cylinderGeometry args={[0.55, 0.7, 0.9, 32]} /></mesh>
      {/* shoulder plates */}
      <mesh material={accentMat} position={[0.7, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}><boxGeometry args={[0.4, 0.2, 0.4]} /></mesh>
      <mesh material={accentMat} position={[-0.7, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}><boxGeometry args={[0.4, 0.2, 0.4]} /></mesh>
      {/* visor */}
      <mesh material={accentMat} position={[0, 0.45, 0.55]} rotation={[Math.PI / 2, 0, 0]}><boxGeometry args={[0.7, 0.18, 0.05]} /></mesh>
      {/* chest core */}
      <mesh material={accentMat} position={[0, -0.35, 0.55]}><sphereGeometry args={[0.12, 16, 16]} /></mesh>
      {/* antenna */}
      <mesh material={accentMat} position={[0, 1.15, 0]}><cylinderGeometry args={[0.03, 0.03, 0.3, 8]} /></mesh>
      <mesh material={accentMat} position={[0, 1.35, 0]}><sphereGeometry args={[0.06, 16, 16]} /></mesh>
    </group>
  )
}

function OpenCodeFigure({ mat, accentMat }: { mat: THREE.Material; accentMat: THREE.Material; }) {
  return (
    <group>
      {/* cube body */}
      <mesh material={mat} rotation={[0.3, 0.4, 0]}><boxGeometry args={[1.2, 1.2, 1.2]} /></mesh>
      {/* inner cube */}
      <mesh material={accentMat} rotation={[0.3, 0.4, 0]} scale={0.55}><boxGeometry args={[1.2, 1.2, 1.2]} /></mesh>
      {/* corner studs */}
      {[[0.65, 0.65, 0.65], [-0.65, 0.65, 0.65], [0.65, -0.65, 0.65], [-0.65, -0.65, 0.65], [0.65, 0.65, -0.65], [-0.65, 0.65, -0.65], [0.65, -0.65, -0.65], [-0.65, -0.65, -0.65]].map(([x, y, z], i) => (
        <mesh key={i} material={accentMat} position={[x, y, z]}><sphereGeometry args={[0.1, 12, 12]} /></mesh>
      ))}
      {/* screen face */}
      <mesh material={accentMat} position={[0, 0, 0.62]}><planeGeometry args={[0.6, 0.4]} /></mesh>
    </group>
  )
}

function OpenClawFigure({ mat, accentMat }: { mat: THREE.Material; accentMat: THREE.Material; }) {
  return (
    <group>
      {/* central core */}
      <mesh material={mat}><sphereGeometry args={[0.5, 32, 32]} /></mesh>
      {/* arms — 6 tentacle-like claws */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 1.1
        const y = Math.sin(angle) * 1.1
        return (
          <group key={i} position={[x, y, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
            <mesh material={mat}><cylinderGeometry args={[0.08, 0.05, 0.7, 8]} /></mesh>
            <mesh material={accentMat} position={[0, 0.45, 0]}><coneGeometry args={[0.12, 0.25, 8]} /></mesh>
          </group>
        )
      })}
      {/* lightning bolt overlay */}
      <mesh material={accentMat} position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 12]}>
        <boxGeometry args={[0.1, 0.5, 0.05]} />
      </mesh>
    </group>
  )
}

