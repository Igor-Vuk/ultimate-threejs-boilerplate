import { useRef } from "react"
import { useGLTF, useTexture, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import { AssetProps } from "./canvasComponents.types"
import WaterPark from "./WaterPark/WaterPark"
import Flag from "./Flag/Flag"
import WavePool from "./WavePool/WavePool"
import assetsPath from "../../data/assetsPath.json"

const Models = () => {
  // we need to flip textures in order to align them
  const adjustTexture = (...texturesArray: Record<string, THREE.Texture>[]) => {
    if (texturesArray.length > 0) {
      texturesArray.forEach((textures) => {
        Object.values(textures).forEach((texture) => {
          texture.flipY = false
          /* Remember that no color Textures(normal maps, roughness...) should use NoColorSpace and most .hdr/.exr LinearSRGBColorSpace*/
          texture.colorSpace = THREE.SRGBColorSpace
        })
      })
    }
  }

  /* -----------------------------Files------------------------------- */
  const modelFiles = useGLTF(assetsPath.modelPath)
  const bakedTexture = useTexture(assetsPath.bakedTexturePath, (texture) => {
    adjustTexture(texture)
  })
  const flagTexture = useTexture(assetsPath.flagTexturePath, (texture) => {
    adjustTexture(texture)
  })
  /* to load multiple maps add them to json */

  /* ------------------------Animations------------------------------ */

  const group = useRef<THREE.Group>(null!)
  const { actions } = useAnimations(modelFiles.animations, group)

  /* ----------------------Data--------------------- */
  const waterParkAssets: AssetProps = {
    model: modelFiles,
    textures: bakedTexture,
    actions: actions,
  }

  const flagAssets = {
    model: modelFiles,
    textures: flagTexture,
  }

  const wavePoolAssets = {
    model: modelFiles,
    textures: bakedTexture,
  }

  return (
    <group ref={group} dispose={null}>
      <WaterPark {...waterParkAssets} />
      <Flag {...flagAssets} />
      <WavePool {...wavePoolAssets} />
    </group>
  )
}

export default Models
