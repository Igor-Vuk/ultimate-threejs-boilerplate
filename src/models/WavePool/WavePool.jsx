import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { RigidBody, Physics } from "@react-three/rapier"
import * as THREE from "three"
import { useRef } from "react"
import PropTypes from "prop-types"

import wavePoolVertexShader from "../../shaders/wavePool/vertex.vs.glsl"
import wavePoolFragmentShader from "../../shaders/wavePool/fragment.fs.glsl"

import { WavePoolControl } from "../../helpers/leva-models.js"

const WavePool = ({ model, textures }) => {
  const wavePoolMaterialRef = useRef(null)
  const wavePool = WavePoolControl()

  /* --------------------- shader material ------------------------ */

  const WavePoolMaterial = shaderMaterial(
    {
      uTime: 0,

      uBigWavesElevation: wavePool.values.bigWavesElevation,
      uBigWavesSpeed: wavePool.values.bigWavesSpeed, // we multiple uTime with this so we can control speed of animation
      uBigWavesFrequency: new THREE.Vector2(
        wavePool.values.bigWavesFrequencyX,
        wavePool.values.bigWavesFrequencyY,
      ),

      uSmallWavesElevation: wavePool.values.smallWavesElevation,
      uSmallWavesSpeed: wavePool.values.smallWavesSpeed,
      uSmallWavesFrequency: wavePool.values.smallWavesFrequency,
      uSmallWavesIterations: wavePool.values.smallWavesIterations,

      uDepthColor: new THREE.Color(wavePool.values.depthColor),
      uSurfaceColor: new THREE.Color(wavePool.values.surfaceColor),
      uColorOffset: wavePool.values.uColorOffset,
      uColorMultiplier: wavePool.values.uColorMultiplier,
    },
    wavePoolVertexShader,
    wavePoolFragmentShader,
  )

  extend({ WavePoolMaterial })

  /* -------------------------------------------------------------- */

  useFrame((state /* delta */) => {
    /* we can update attributes directly like this */
    wavePoolMaterialRef.current.uTime = state.clock.elapsedTime
  })

  const renderModel = () => {
    return model.scene.children.map((mesh) => {
      const collection = mesh.userData.collection
      if (collection === "wave_pool") {
        const defaultMeshProperties = {
          name: mesh.name,
          castShadow: true,
          receiveShadow: true,
          geometry: mesh.geometry,
          position: mesh.position,
          rotation: mesh.rotation,
          scale: mesh.scale,
        }

        return (
          <mesh {...defaultMeshProperties} key={mesh.uuid}>
            {/* We attach a unique key property to the prototype class to enable hot-reload. */}
            <meshStandardMaterial {...textures} />
          </mesh>
        )
      }
    })
  }

  const renderWavePoolSurface = () => {
    return (
      <mesh
        position={[-24.5, 0.1, -4.5]}
        rotation={[
          wavePool.values.planeRotationX,
          wavePool.values.planeRotationY,
          wavePool.values.planeRotationZ,
        ]}
      >
        <boxGeometry args={[13, 22, 1, 512, 512, 1]} />
        <wavePoolMaterial
          key={WavePoolMaterial.key}
          ref={wavePoolMaterialRef}
          wireframe={false}
        />
      </mesh>
    )
  }

  const renderTorus = () => {
    return (
      <mesh position={[-24.5, 10.15, -4.5]} rotation={[2, 1, 1]}>
        <torusGeometry args={[1, 0.4, 12, 43]} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
    )
  }

  return (
    <Physics debug={false}>
      {renderModel()}
      <RigidBody type="fixed" colliders="hull">
        {renderWavePoolSurface()}
      </RigidBody>
      <RigidBody type="dynamic" colliders="trimesh">
        {renderTorus()}
      </RigidBody>
    </Physics>
  )
}

export default WavePool

WavePool.propTypes = {
  model: PropTypes.object.isRequired,
  textures: PropTypes.object,
}
