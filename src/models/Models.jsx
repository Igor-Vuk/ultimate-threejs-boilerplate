import { useRef } from "react"
import { useGLTF, useTexture, useAnimations } from "@react-three/drei"
import WaterPark from "./WaterPark/WaterPark"
import Flag from "./Flag/Flag"

const Models = () => {
  /* -----------------------------Files------------------------------- */
  const modelFiles = useGLTF("/models/water_park-working_version.glb")
  const bakedTexture = useTexture({
    map: "/textures/baked-flat_batch_DIFFUSE-min.jpg",
    // aoMap: "./textures/baked-flat-no-specular_AO.jpg", /* example how to use multiple textures */
  })
  const flagTexture = useTexture({
    map: "/textures/water-park-logo.jpg",
  })
  /* ---------------------------------------------------------------- */

  bakedTexture.map.flipY = false
  flagTexture.map.flipY = false
  // bakedTexture.aoMap.flipY = false
  /* ------------------------Animations------------------------------ */

  const group = useRef(null)
  const { actions } = useAnimations(modelFiles.animations, group)

  /* ----------------------Data--------------------- */
  const waterParkAssets = {
    model: modelFiles,
    textures: bakedTexture,
    actions: Object.keys(actions).length ? actions : null, // check if there is any animation
  }

  const flagAssets = {
    model: modelFiles,
    textures: flagTexture,
  }

  return (
    <>
      <group ref={group} dispose={null}>
        <WaterPark {...waterParkAssets} />
        <Flag {...flagAssets} />
      </group>
    </>
  )
}

export default Models
