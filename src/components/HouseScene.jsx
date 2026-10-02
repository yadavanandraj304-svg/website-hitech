import React, { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// ---------------------------------------------------------------------------
// Background: a modern 2½-floor house that CONSTRUCTS ITSELF as you scroll.
//
// The page's scroll position (0 → 1) drives seven build stages:
//   plot & plinth → ground floor → first floor → half floor (the .5)
//   → roof & parapet → finishing (glass, canopy, boundary wall) → landscaping
// Each Piece eases into place inside useFrame, so the build feels smooth and
// never re-renders React. Fully decorative: pointer-events are off in CSS.
// ---------------------------------------------------------------------------

const clamp = (v) => Math.max(0, Math.min(1, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// Build stages: [start, end] in scroll progress
const STAGE = {
  ground: [0.0, 0.05],
  floor1: [0.05, 0.25],
  floor2: [0.25, 0.45],
  half: [0.45, 0.6],
  roof: [0.6, 0.72],
  finish: [0.72, 0.86],
  garden: [0.86, 1.0],
}

/** A building part that scales/rises into place between two scroll positions. */
function Piece({ scroll, stage, base = [0, 0, 0], drop = 0.9, children }) {
  const ref = useRef()
  const [from, to] = STAGE[stage]

  useFrame(() => {
    const obj = ref.current
    if (!obj) return
    const t = clamp((scroll.current - from) / (to - from))
    const e = easeOut(t)
    obj.visible = t > 0.002
    const s = 0.55 + 0.45 * e
    obj.scale.set(s, Math.max(0.0001, e), s)
    obj.position.set(base[0], base[1] - (1 - e) * drop, base[2])
  })

  return (
    <group ref={ref} position={base}>
      {children}
    </group>
  )
}

const WALL = '#F6F4EF'
const WALL_SHADE = '#EDEAE1'
const ACCENT = '#0F2C59' // brand navy feature wall
const WOOD = '#C9A276'
const GLASS = '#8FB0DE'
const ROOF = '#DFDCD2'
const CONCRETE = '#E6E3DA'
const GREEN = '#93B489'

/** Four slabs forming a hollow floor shell (local origin = centre of its base). */
function Shell({ w, d, h, t = 0.16, color = WALL, accentFront = false }) {
  const x = w / 2 - t / 2
  const z = d / 2 - t / 2
  return (
    <group>
      {/* back + sides */}
      <mesh position={[0, h / 2, -z]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[-x, h / 2, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color={WALL_SHADE} roughness={0.9} />
      </mesh>
      <mesh position={[x, h / 2, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color={WALL_SHADE} roughness={0.9} />
      </mesh>
      {/* front split around the opening band */}
      <mesh position={[0, h / 2, z]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial color={accentFront ? ACCENT : color} roughness={0.85} />
      </mesh>
      {/* floor slab */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[w + 0.12, 0.06, d + 0.12]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
    </group>
  )
}

/** Window / glass band sitting just proud of a wall. */
function Glass({ position, w, h, rotY = 0 }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.03]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.7, 8]} />
        <meshStandardMaterial color="#A9835C" roughness={1} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color={GREEN} roughness={1} flatShading />
      </mesh>
      <mesh position={[0.18, 1.25, 0.05]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#A6C499" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

function House({ scroll }) {
  const root = useRef()

  // Slow presentation turn as the house completes
  useFrame((state) => {
    const obj = root.current
    if (!obj) return
    const p = scroll.current
    obj.rotation.y = -0.55 + p * 0.75 + Math.sin(state.clock.elapsedTime * 0.12) * 0.03
    obj.position.y = -0.2 + p * 0.15
  })

  return (
    <group ref={root}>
      {/* ---- plot, plinth, entrance ---- */}
      <Piece scroll={scroll} stage="ground" base={[0, 0, 0]} drop={0.4}>
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <boxGeometry args={[11, 0.12, 9]} />
          <meshStandardMaterial color="#F1EFE8" roughness={1} />
        </mesh>
        {/* lawn pads */}
        <mesh position={[-3.9, 0.01, 2.6]}>
          <boxGeometry args={[2.6, 0.06, 3.2]} />
          <meshStandardMaterial color="#DCE7D3" roughness={1} />
        </mesh>
        <mesh position={[3.9, 0.01, 2.6]}>
          <boxGeometry args={[2.6, 0.06, 3.2]} />
          <meshStandardMaterial color="#DCE7D3" roughness={1} />
        </mesh>
        {/* plinth */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[7.1, 0.32, 5.6]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.95} />
        </mesh>
        {/* entry steps */}
        <mesh position={[0, 0.08, 3.05]}>
          <boxGeometry args={[2.4, 0.16, 0.7]} />
          <meshStandardMaterial color={ROOF} roughness={1} />
        </mesh>
        <mesh position={[0, 0.2, 2.85]}>
          <boxGeometry args={[2.4, 0.14, 0.5]} />
          <meshStandardMaterial color={ROOF} roughness={1} />
        </mesh>
        {/* driveway */}
        <mesh position={[0, -0.005, 4.2]}>
          <boxGeometry args={[2.6, 0.05, 2.4]} />
          <meshStandardMaterial color="#E4E1D8" roughness={1} />
        </mesh>
      </Piece>

      {/* ---- ground floor ---- */}
      <Piece scroll={scroll} stage="floor1" base={[0, 0.32, 0]}>
        <Shell w={7} d={5.5} h={1.25} accentFront />
        {/* door */}
        <mesh position={[0, 0.55, 2.79]}>
          <boxGeometry args={[1.1, 1.1, 0.08]} />
          <meshStandardMaterial color={WOOD} roughness={0.6} />
        </mesh>
        <Glass position={[-2.1, 0.75, 2.79]} w={1.7} h={0.85} />
        <Glass position={[2.1, 0.75, 2.79]} w={1.7} h={0.85} />
        <Glass position={[-3.54, 0.75, 0]} w={2.4} h={0.8} rotY={Math.PI / 2} />
        <Glass position={[3.54, 0.75, -0.6]} w={2.0} h={0.8} rotY={-Math.PI / 2} />
        {/* ceiling slab */}
        <mesh position={[0, 1.29, 0]}>
          <boxGeometry args={[7.3, 0.14, 5.8]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.95} />
        </mesh>
      </Piece>

      {/* ---- first floor ---- */}
      <Piece scroll={scroll} stage="floor2" base={[0, 1.43, 0]}>
        <Shell w={7} d={5.5} h={1.2} />
        <Glass position={[-2.2, 0.7, 2.79]} w={1.9} h={0.9} />
        <Glass position={[2.2, 0.7, 2.79]} w={1.9} h={0.9} />
        <Glass position={[-3.54, 0.7, 0.4]} w={2.6} h={0.85} rotY={Math.PI / 2} />
        <Glass position={[3.54, 0.7, -0.4]} w={2.2} h={0.85} rotY={-Math.PI / 2} />
        {/* balcony slab */}
        <mesh position={[0, 0.02, 3.2]}>
          <boxGeometry args={[4.6, 0.14, 1.3]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.95} />
        </mesh>
        {/* balcony glass railing */}
        <mesh position={[0, 0.35, 3.8]}>
          <boxGeometry args={[4.6, 0.6, 0.05]} />
          <meshStandardMaterial color={GLASS} transparent opacity={0.45} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.24, 0]}>
          <boxGeometry args={[7.3, 0.14, 5.8]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.95} />
        </mesh>
      </Piece>

      {/* ---- the half floor (2.5 storey) ---- */}
      <Piece scroll={scroll} stage="half" base={[0, 2.62, 0]}>
        <Shell w={5.4} d={4.4} h={0.85} color={WALL} />
        <Glass position={[-1.5, 0.45, 2.24]} w={1.4} h={0.6} />
        <Glass position={[1.5, 0.45, 2.24]} w={1.4} h={0.6} />
        <Glass position={[-2.74, 0.45, 0]} w={1.8} h={0.6} rotY={Math.PI / 2} />
        {/* set-back terrace deck */}
        <mesh position={[0, 0.02, 2.5]}>
          <boxGeometry args={[5.6, 0.1, 0.9]} />
          <meshStandardMaterial color={WOOD} roughness={0.8} />
        </mesh>
        {/* stair headroom */}
        <mesh position={[1.7, 0.95, -1.2]}>
          <boxGeometry args={[1.5, 1.1, 1.4]} />
          <meshStandardMaterial color={WALL_SHADE} roughness={0.9} />
        </mesh>
      </Piece>

      {/* ---- roof + parapet ---- */}
      <Piece scroll={scroll} stage="roof" base={[0, 3.47, 0]} drop={1.1}>
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[5.9, 0.14, 4.9]} />
          <meshStandardMaterial color={ROOF} roughness={0.95} />
        </mesh>
        {/* parapet */}
        {[
          [0, 0.26, -2.37, 5.9, 0.34, 0.14],
          [-2.87, 0.26, 0, 0.14, 0.34, 4.9],
          [2.87, 0.26, 0, 0.14, 0.34, 4.9],
          [0, 0.26, 2.37, 5.9, 0.34, 0.14],
        ].map(([x, y, z, w, h, d], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={ACCENT} roughness={0.7} />
          </mesh>
        ))}
        {/* headroom roof */}
        <mesh position={[1.7, 1.55, -1.2]}>
          <boxGeometry args={[1.8, 0.14, 1.7]} />
          <meshStandardMaterial color={ACCENT} roughness={0.7} />
        </mesh>
        {/* water tank */}
        <mesh position={[-1.6, 1.5, -1.3]}>
          <cylinderGeometry args={[0.45, 0.45, 0.7, 16]} />
          <meshStandardMaterial color="#2A4F92" roughness={0.6} />
        </mesh>
      </Piece>

      {/* ---- finishing: canopy, boundary wall, gate ---- */}
      <Piece scroll={scroll} stage="finish" base={[0, 0.32, 0]} drop={0.5}>
        {/* entrance canopy */}
        <mesh position={[0, 1.15, 3.05]}>
          <boxGeometry args={[2.9, 0.12, 1.2]} />
          <meshStandardMaterial color={ACCENT} roughness={0.7} />
        </mesh>
        <mesh position={[1.3, 0.7, 3.5]}>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
          <meshStandardMaterial color={ACCENT} roughness={0.7} />
        </mesh>
        {/* compound wall */}
        {[
          [0, 0.45, -4.4, 11, 0.9, 0.2],
          [-5.4, 0.45, 0, 0.2, 0.9, 9],
          [5.4, 0.45, 0, 0.2, 0.9, 9],
          [-3.9, 0.45, 4.4, 3.2, 0.9, 0.2],
          [3.9, 0.45, 4.4, 3.2, 0.9, 0.2],
        ].map(([x, y, z, w, h, d], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color="#EFECE3" roughness={1} />
          </mesh>
        ))}
        {/* gate pillars */}
        {[-1.7, 1.7].map((x, i) => (
          <mesh key={i} position={[x, 0.7, 4.4]}>
            <boxGeometry args={[0.4, 1.4, 0.4]} />
            <meshStandardMaterial color={ACCENT} roughness={0.7} />
          </mesh>
        ))}
        {/* gate bars */}
        <mesh position={[0, 0.55, 4.4]}>
          <boxGeometry args={[3.1, 1.0, 0.08]} />
          <meshStandardMaterial color="#9FB4D2" roughness={0.4} metalness={0.3} />
        </mesh>
      </Piece>

      {/* ---- landscaping ---- */}
      <Piece scroll={scroll} stage="garden" base={[0, 0, 0]} drop={0.3}>
        <Tree position={[-4.3, 0, 3.4]} scale={1.1} />
        <Tree position={[4.4, 0, 3.1]} scale={0.9} />
        <Tree position={[-4.6, 0, -2.2]} scale={1.25} />
        <Tree position={[4.7, 0, -2.6]} scale={1} />
        {/* hedge row */}
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <mesh key={i} position={[x, 0.18, 4.8]}>
            <boxGeometry args={[1.2, 0.36, 0.5]} />
            <meshStandardMaterial color="#8FAE85" roughness={1} />
          </mesh>
        ))}
        {/* path lamps */}
        {[-1.3, 1.3].map((x, i) => (
          <group key={i} position={[x, 0, 4.9]}>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
              <meshStandardMaterial color={ACCENT} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color="#FFE7A8" emissive="#FFD873" emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
      </Piece>
    </group>
  )
}

function Rig({ scroll }) {
  const light = useRef()
  let acc = 0
  useFrame((state, delta) => {
    // ~30fps for the camera is visually identical here and halves GPU work
    acc += delta
    if (acc < 1 / 30) return
    acc = 0
    if (light.current) light.current.target.position.set(0, 1.6, 0)
    state.camera.position.x = 9.4 - scroll.current * 1.6
    state.camera.position.y = 4.6 + scroll.current * 1.9
    state.camera.position.z = 10.4 - scroll.current * 1.2
    state.camera.lookAt(0, 1.7 + scroll.current * 0.5, 0)
  })
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight ref={light} position={[8, 14, 9]} intensity={1.15} color="#FFF6E8" />
      <directionalLight position={[-9, 6, -6]} intensity={0.35} color="#C9D8F2" />
    </>
  )
}

export default function HouseScene({ paused = false }) {
  const raw = useRef(0)
  const eased = useRef(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      raw.current = max > 40 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [9.4, 4.6, 10.4], fov: 38 }}
      // Fully stop the render loop whenever the 3D scene is not on screen
      // (admin, interior pages) — zero GPU work, zero lag caused by the scene.
      frameloop={paused ? 'never' : 'always'}
    >
      {/* eases the raw scroll value so the build feels weighted, never jumpy */}
      <Sync source={raw} target={eased} />
      <Rig scroll={eased} />
      <House scroll={eased} />
      {/* soft ground contact shading */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 0]}>
        <circleGeometry args={[7.4, 48]} />
        <meshBasicMaterial color="#0F2C59" transparent opacity={0.1} />
      </mesh>
    </Canvas>
  )
}

function Sync({ source, target }) {
  useFrame(() => {
    target.current += (source.current - target.current) * 0.09
  })
  return null
}
