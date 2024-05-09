import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import PropTypes from "prop-types"
import useJsonCurve from "../../customHooks/useJsonCurve"
import parrotPath from "../../data/parrotPath.json"

const WaterPark = ({ model, textures, actions }) => {
  /* ----------------------ref--------------------- */
  const parrotRef = useRef(null)

  const { curvePath } = useJsonCurve(parrotPath)

  useEffect(() => {
    /* Adjust and play animations */
    if (actions) {
      actions.ChildrenPoolWater?.setDuration(4).play()
      actions.Flamingo?.setDuration(20).play()
      actions.Parrot?.play()
    }
  }, [actions])

  useFrame((state) => {
    /* after curve is generated start following the path */
    if (curvePath) {
      const elapsedTime = state.clock.elapsedTime

      /* Adjust the speed  */
      const time = (elapsedTime * 0.1) % 1

      /* Position of the model */
      const position = curvePath.curve.getPointAt(time)

      /* Look at the right direction  */
      const position2 = curvePath.curve.getPointAt(
        Math.min(1, time + 0.00001) ?? position,
      )

      parrotRef.current.position.copy(position)
      parrotRef.current.lookAt(position2)
    }
  })

  /* --------------------------------------------------- */

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
        const defaultMeshProperties = {
          name: mesh.name,
          castShadow: true,
          receiveShadow: true,
          geometry: mesh.geometry,
          position: mesh.position,
          rotation: mesh.rotation,
          scale: mesh.scale,
        }

        /* Add or remove properties from specific objects and render the rest as default */

        switch (mesh.name) {
          case "children_pool_water": {
            /* eslint-disable no-unused-vars */
            const { castShadow, ...customMeshProperties } = {
              // remove and add properties
              ...defaultMeshProperties,
              morphTargetDictionary: mesh.morphTargetDictionary,
              morphTargetInfluences: mesh.morphTargetInfluences,
            }

            return (
              <mesh {...customMeshProperties} key={mesh.uuid}>
                <meshStandardMaterial
                  {...textures}

                  /*  color={"#1D8D90"} */
                />
              </mesh>
            )
          }

          case "parrot-armature": {
            /* eslint-disable no-unused-vars */
            const {
              castShadow,
              receiveShadow,
              geometry,
              ...customMeshProperties
            } = {
              ...defaultMeshProperties,
              ref: parrotRef,
            }

            return (
              <group {...customMeshProperties} key={mesh.uuid}>
                <skinnedMesh
                  castShadow
                  skinnedMesh
                  name={mesh.children[0].name}
                  geometry={mesh.children[0].geometry}
                  material={mesh.children[0].material}
                  skeleton={mesh.children[0].skeleton}
                >
                  <meshStandardMaterial {...textures} />
                </skinnedMesh>

                <primitive
                  object={mesh.children[0].skeleton.bones.find(
                    (obj) => obj.name === "butt_bone",
                  )}
                />
              </group>
            )
          }

          default: {
            return (
              <mesh {...defaultMeshProperties} key={mesh.uuid}>
                <meshStandardMaterial
                  {...textures}
                  // wireframe
                />
              </mesh>
            )
          }
        }
      }
    })
  }

  /* we can render curve if needed */
  // const renderCurve = () => {
  //   return curvePath ? <mesh {...curvePath.mesh}></mesh> : null
  // }

  return (
    <>
      {renderModel()}
      {/* {renderCurve()} */}
    </>
  )
}

export default WaterPark

WaterPark.propTypes = {
  model: PropTypes.object.isRequired,
  textures: PropTypes.object,
  actions: PropTypes.object,
}
