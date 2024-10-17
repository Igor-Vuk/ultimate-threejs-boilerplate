import { useRef, useMemo } from "react"
import { useGLTF, useTexture, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import { AssetProps } from "./canvasComponents.types"
import WaterPark from "./WaterPark/WaterPark"
import Flag from "./Flag/Flag"
import WavePool from "./WavePool/WavePool"
import assetsPath from "../../data/assetsPath.json"

const Models = () => {
  /* -----------------------------Files------------------------------- */
  const modelFiles = useGLTF(assetsPath.modelPath)
  const bakedTexture = useTexture(assetsPath.bakedTexturePath)
  const flagTexture = useTexture(assetsPath.flagTexturePath)
  /* to load multiple maps add them to json */

  /* ----------------------Adjust texture--------------------- */
  const adjustTexture = (textures: THREE.Texture[], setName: string) => {
    textures.forEach((texture, index) => {
      /* we need to flip textures in order to align them */
      texture.flipY = false

      /* Set the appropriate colorSpace based on the texture type. Textures come in the same order
          as we send them to useTexture. Remember that no color Textures(normal maps, roughness, ao...) 
          should use NoColorSpace and most .hdr/.exr LinearSRGBColorSpace */
      if (setName === "bakedTexturePath" || setName === "flagTexturePath") {
        switch (index) {
          case 0:
            texture.colorSpace = THREE.SRGBColorSpace // assign color space
            texture.name = "diffuseTexture" // give name
            break
          case 1:
            texture.colorSpace = THREE.NoColorSpace
            texture.name = "roughnessTexture"
            break
          case 2:
            texture.colorSpace = THREE.NoColorSpace
            texture.name = "normalTexture"
            break
          case 3:
            texture.colorSpace = THREE.NoColorSpace
            texture.name = "aoTexture"
            break
          default:
            break
        }
      }
    })
  }
  /* --------------------------------------------------------------------------------- */
  /* call adjustTexture, pass second property so we can use different switch statement if needed latter */
  const adjustedBakedTexturePath = useMemo(() => {
    if (bakedTexture) {
      adjustTexture(bakedTexture, "bakedTexturePath")
    }
    return bakedTexture
  }, [bakedTexture])

  const adjustedFlagTexturePath = useMemo(() => {
    if (flagTexture) {
      adjustTexture(flagTexture, "flagTexturePath")
    }
    return flagTexture
  }, [flagTexture])

  /* ------------------------Animations------------------------------ */

  const group = useRef<THREE.Group>(null!)
  const { actions } = useAnimations(modelFiles.animations, group)

  /* ----------------------Data--------------------- */
  const waterParkAssets: AssetProps = {
    model: modelFiles,
    textures: adjustedBakedTexturePath,
    actions: actions,
  }

  const flagAssets = {
    model: modelFiles,
    textures: adjustedFlagTexturePath,
  }

  const wavePoolAssets = {
    model: modelFiles,
    textures: adjustedBakedTexturePath,
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
