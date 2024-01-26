import { useEffect } from "react"
import PropTypes from "prop-types"

const WaterPark = ({ model, textures, actions, environmentMapIntensity }) => {
  /* ----------------------ref--------------------- */

  useEffect(() => {
    /* Adjust animation */
    if (actions) {
      actions.ChildrenPoolWater?.setDuration(4).play()
      actions.Flamingo?.setDuration(20).play()
    }
  })

  /* --------------------------------------------------- */

  const renderModel = () => {
    return model.scene.children.map((mesh) => {
      /* Render every collection separately if we want*/
      /*  if (mesh.userData.collection === "children_pool") { */
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
                envMapIntensity={environmentMapIntensity}

                /*  color={"#1D8D90"} */
              />
            </mesh>
          )
        }

        default: {
          return (
            <mesh {...defaultMeshProperties}>
              <meshStandardMaterial
                {...textures}
                envMapIntensity={environmentMapIntensity}
                // wireframe
              />
            </mesh>
          )
        }
      }
      /*  } */
    })
  }

  return <>{renderModel()}</>
}

export default WaterPark

WaterPark.propTypes = {
  model: PropTypes.object.isRequired,
  textures: PropTypes.object,
  actions: PropTypes.object,
  environmentMapIntensity: PropTypes.number,
}
