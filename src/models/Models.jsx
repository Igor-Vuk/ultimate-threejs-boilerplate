import { useRef } from "react"
import { useGLTF, useTexture, useAnimations } from "@react-three/drei"
import WaterPark from "./WaterPark"

const Models = () => {
  /* -----------------------------Files------------------------------- */
  const modelFiles = useGLTF("/models/water_park-working_version.glb")
  const textureFiles = useTexture({
    map: "/textures/baked-flat_batch_DIFFUSE-min.jpg",
    // aoMap: "./textures/baked-flat-no-specular_AO.jpg",
  })
  /* ---------------------------------------------------------------- */

  textureFiles.map.flipY = false
  // textureFiles.aoMap.flipY = false
  /* ------------------------Animations------------------------------ */

  const group = useRef()
  const { actions } = useAnimations(modelFiles.animations, group)

  /* ----------------------leva--------------------- */
  const assets = {
    model: modelFiles,
    textures: textureFiles,
    actions: Object.keys(actions).length ? actions : null, // check if there is any animation
  }

  return (
    <>
      <group ref={group} dispose={null}>
        <WaterPark {...assets} />
      </group>
    </>
  )
}

export default Models
