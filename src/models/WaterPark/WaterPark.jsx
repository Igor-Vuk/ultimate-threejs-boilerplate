import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import PropTypes from "prop-types"

import parrotPath from "../../data/parrotPath.json"
import loadCurveFromJSON from "../../helpers/curveMethods.js"

const WaterPark = ({ model, textures, actions }) => {
  const [parrotPathCurve, setParrotPathCurve] = useState(null)

  /* ----------------------ref--------------------- */
  const parrotRef = useRef(null)

  useEffect(() => {
    const loadCurve = async () => {
      try {
        /* wait for the curve to be generated before animating in useFrame */
        const curve = await loadCurveFromJSON(parrotPath)
        setParrotPathCurve(curve)
      } catch (error) {
        console.error("Error loading curve:", error)
      }
    }
    loadCurve()
  }, [])

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
    if (parrotPathCurve) {
      const elapsedTime = state.clock.elapsedTime

      /* Adjust the speed  */
      const time = (elapsedTime * 0.1) % 1

      /* Position of the model */
      const position = parrotPathCurve.curve.getPointAt(time)

      /* Look at the right direction  */
      const position2 = parrotPathCurve.curve.getPointAt(
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
          key: mesh.uuid,
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
              <mesh {...customMeshProperties}>
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
              <group {...customMeshProperties}>
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
              <mesh {...defaultMeshProperties}>
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
  //   return parrotPathCurve ? <mesh {...parrotPathCurve.mesh}></mesh> : null
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
