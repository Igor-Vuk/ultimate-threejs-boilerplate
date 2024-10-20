import { useRef, FC, Suspense, useMemo } from "react"
import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { RigidBody, Physics } from "@react-three/rapier"

import { AssetProps, WavePoolUniforms } from "../canvasComponents.types.ts"

// use the ?raw query parameter to import the contents of the GLSL files as strings in Vite
import wavePoolVertexShader from "../../../shaders/wavePool/vertex.vs.glsl"
import wavePoolFragmentShader from "../../../shaders/wavePool/fragment.fs.glsl"

import { WavePoolControl } from "../../../helpers/levaModels.ts"

const WavePool: FC<AssetProps> = ({ model, textures }) => {
  const wavePoolMaterialRef = useRef<THREE.ShaderMaterial & WavePoolUniforms>(
    null!,
  )

  const wavePool = WavePoolControl()

  // Memoize the material to avoid re-creating it on each render
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial()

    if (textures && textures.length > 0) {
      textures.forEach((texture) => {
        if (texture.name === "diffuseTexture") {
          mat.map = texture
        } else if (texture.name === "roughnessTexture") {
          mat.roughnessMap = texture
        } else if (texture.name === "normalTexture") {
          mat.normalMap = texture
          // mat.normalScale = new THREE.Vector2(1.0, 1.0) // Adjust as needed
        } else if (texture.name === "aoTexture") {
          mat.aoMap = texture
          // Handle any additional textures here
        }
      })
    }

    return mat
  }, [textures])

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
    if (wavePoolMaterialRef.current) {
      /* we can update attributes directly like this */
      wavePoolMaterialRef.current.uTime = state.clock.elapsedTime
    }
  })

  /* We only have geometry property on Mesh so we need to check if we are dealing with the Mesh type */
  const isMeshType = (mesh: THREE.Object3D): mesh is THREE.Mesh => {
    return mesh instanceof THREE.Mesh
  }

  const renderModel = () => {
    return model.scene.children.map((mesh) => {
      const collection = mesh.userData.collection

      if (isMeshType(mesh) && collection === "wave_pool") {
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
          /* We attach a unique key property to the prototype class to enable hot-reload. */
          <mesh
            {...defaultMeshProperties}
            key={mesh.uuid}
            material={material}
          />
        )
      }
      return null
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
    <Suspense>
      {/*   Physics component relies on lazily initiating Rapier and needs to be wrapped in <Suspense /> */}
      <Physics debug={false}>
        {renderModel()}
        <RigidBody type="fixed" colliders="hull">
          {renderWavePoolSurface()}
        </RigidBody>
        <RigidBody type="dynamic" colliders="trimesh">
          {renderTorus()}
        </RigidBody>
      </Physics>
    </Suspense>
  )
}

export default WavePool
