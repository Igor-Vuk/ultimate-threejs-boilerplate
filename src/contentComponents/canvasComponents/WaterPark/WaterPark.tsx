import { useRef, useEffect, FC, useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { AssetProps } from "../canvasComponents.types"

import useJsonCurve from "../../../customHooks/useJsonCurve"
import parrotPath from "../../../data/parrotPath.json"

const WaterPark: FC<AssetProps> = ({ model, textures, actions }) => {
  /* ----------------------ref--------------------- */
  const parrotRef = useRef<THREE.Group>(null!)

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

  const curveProps = useMemo(
    () => ({
      curvePoints: parrotPath,
      curveClosed: true,
      tubeTubularSegments: 100,
      tubeRadius: 0.05,
      tubeRadialSegments: 4,
      tubeClosed: true,
      tubeColor: 0x000000,
    }),
    [],
  )
  const { curvePath } = useJsonCurve(curveProps)

  useEffect(() => {
    /* Adjust and play animations */
    if (actions) {
      actions.ChildrenPoolWater?.setDuration(4).play()
      actions.Flamingo?.setDuration(20).play()
      actions.Parrot?.play()
    }
  }, [actions])

  /* ----------------------------------------
  Example of manually calculates and applies the rotation using a 
  matrix and quaternion, ensuring consistent orientation, in case lookAt is not working as it should
  ------------------- */

  // Memoize the lookAtMatrix and rotation objects
  //  const lookAtMatrix = useMemo(() => new THREE.Matrix4(), [])
  //  const rotation = useMemo(() => new THREE.Euler(), [])

  // useFrame((state) => {
  //   if (curvePath && parrotRef.current) {
  //     const elapsedTime = state.clock.elapsedTime
  //     const time = (elapsedTime * 0.1) % 1

  //     // Get current and next positions on the curve
  //     const position = curvePath.curve.getPointAt(time)
  //     const delta = 0.0001
  //     const nextTime = (time + delta) % 1
  //     const nextPosition = curvePath.curve.getPointAt(nextTime)

  //     // Apply position to the parrot
  //     parrotRef.current.position.copy(position)

  //     // Calculate and apply the quaternion to rotate the parrot so it faces the direction
  //     lookAtMatrix.lookAt(nextPosition, position, parrotRef.current.up)

  //     rotation.setFromRotationMatrix(lookAtMatrix)
  //     parrotRef.current.rotation.copy(rotation)
  //   }
  // })
  /* ------------------------------------------------------------------------------- */

  useFrame((state) => {
    /* after curve is generated start following the path */
    if (curvePath && parrotRef.current) {
      const elapsedTime = state.clock.elapsedTime

      /* Adjust the speed  */
      const time = (elapsedTime * 0.1) % 1

      /* Position of the model */
      const position = curvePath.curve.getPointAt(time)

      const delta = 0.0001
      const nextTime = (time + delta) % 1
      /* Look at the right direction  */
      const position2 = curvePath.curve.getPointAt(nextTime)

      parrotRef.current.position.copy(position)
      parrotRef.current.lookAt(position2)
    }
  })

  /* --------------------------------------------------- */

  const isMeshType = (mesh: THREE.Object3D): mesh is THREE.Mesh => {
    return mesh instanceof THREE.Mesh
  }

  const isSkinnedMeshType = (
    mesh: THREE.Object3D,
  ): mesh is THREE.SkinnedMesh => {
    return mesh instanceof THREE.SkinnedMesh
  }

  const renderModel = () => {
    return model.scene.children.map((mesh) => {
      /* Choose which collections to render */
      const collection = mesh.userData.collection
      if (
        collection === "ground_base" ||
        collection === "children_pool" ||
        collection === "animals" ||
        collection === "vegetation"
      ) {
        /* Default props */
        const defaultProperties = {
          name: mesh.name,
          position: mesh.position,
          rotation: mesh.rotation,
          scale: mesh.scale,
        }

        if (isMeshType(mesh)) {
          /* Default props */
          const defaultMeshProperties = {
            castShadow: true,
            receiveShadow: true,
            geometry: mesh.geometry,
            ...defaultProperties,
          }

          /* Add or remove properties from specific objects and render the rest as default */

          switch (mesh.name) {
            case "children_pool_water": {
              const { castShadow, ...customMeshProperties } = {
                // remove and add properties
                ...defaultMeshProperties,
                morphTargetDictionary: mesh.morphTargetDictionary,
                morphTargetInfluences: mesh.morphTargetInfluences,
              }

              return (
                <mesh
                  {...customMeshProperties}
                  key={mesh.uuid}
                  material={material}
                />
              )
            }

            default: {
              return (
                <mesh
                  {...defaultMeshProperties}
                  key={mesh.uuid}
                  material={material}
                />
              )
            }
          }
        }

        if (isSkinnedMeshType(mesh.children[0])) {
          switch (mesh.name) {
            case "parrot-armature": {
              const customMeshProperties = {
                ...defaultProperties,
                ref: parrotRef,
              }

              const skinnedMeshChild = mesh.children[0] as THREE.SkinnedMesh
              const buttBone = skinnedMeshChild.skeleton.bones.find(
                (obj: THREE.Bone) => obj.name === "butt_bone",
              )

              return (
                <group {...customMeshProperties} key={mesh.uuid}>
                  <skinnedMesh
                    castShadow
                    name={skinnedMeshChild.name}
                    geometry={skinnedMeshChild.geometry}
                    material={material}
                    skeleton={skinnedMeshChild.skeleton}
                  ></skinnedMesh>

                  {buttBone && <primitive object={buttBone} />}
                </group>
              )
            }
          }
        }
      }
      return null
    })
  }

  /* we can render curve if needed */

  /* const renderCurve = () => {
    return curvePath ? <primitive object={curvePath.mesh} /> : null
  }  */

  return (
    <>
      {renderModel()}
      {/* {renderCurve()} */}
    </>
  )
}

export default WaterPark
