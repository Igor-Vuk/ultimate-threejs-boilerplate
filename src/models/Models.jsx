import { useState, useRef } from "react"
import { useGLTF, useTexture, useAnimations } from "@react-three/drei"
import { SceneRenderControl } from "../debug/leva"

import EnvironmentMap from "../scene/EnvironmentMap"
import WaterPark from "./WaterPark"

const Models = () => {
  const [environmentMapIntensity, setEnvironmentMapIntensity] = useState(1)

  /* -----------------------------Files------------------------------- */
  const modelFiles = useGLTF("/models/water_park-working_version.glb")
  const textureFiles = useTexture({
    map: "/textures/baked-flat-flamingo_batch_DIFFUSE.jpg",
    // aoMap: "./textures/baked-flat-no-specular_AO.jpg",
  })
  const environmentMapFiles =
    "/environmentMaps/kloofendal_48d_partly_cloudy_puresky_1k.hdr"
  /* ---------------------------------------------------------------- */

  textureFiles.map.flipY = false
  // textureFiles.aoMap.flipY = false
  /* ------------------------Animations------------------------------ */

  const group = useRef()
  const { actions } = useAnimations(modelFiles.animations, group)

  /* ----------------------leva--------------------- */
  const sceneRender = SceneRenderControl()

  const assets = {
    model: modelFiles,
    textures: textureFiles,
    environmentMapIntensity: environmentMapIntensity,
    actions: Object.keys(actions).length ? actions : null, // check if there is any animation
  }

  return (
    <>
      {/* we use state for intensity only because we wanna call "EnvironmentMapControl" 
    just in Environment component in order to be able to remove Leva options from 
    debug menu if EnvironmentMap component is not rendered. */}
      {sceneRender.values.environment_map && (
        <EnvironmentMap
          setEnvironmentMapIntensity={setEnvironmentMapIntensity}
          environmentMapFiles={environmentMapFiles}
        />
      )}

      <group ref={group} dispose={null}>
        <WaterPark {...assets} />
      </group>
    </>
  )
}

export default Models
