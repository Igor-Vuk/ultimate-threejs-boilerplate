import { useRef } from "react"
import { useHelper } from "@react-three/drei"
import { DirectionalLightHelper, CameraHelper } from "three"
import { DirectionalLightControl, ShadowCameraControl } from "../helpers/leva"

const DirectionalLight = () => {
  /* ----------------------ref--------------------- */
  const directionalLightRef = useRef(null)
  const cameraRef = useRef(null)

  /* ---------------------leva--------------------- */
  const directionalLight = DirectionalLightControl(directionalLightRef)
  const shadowCamera = ShadowCameraControl(directionalLightRef)

  /* --------------------helper-------------------- */
  useHelper(
    directionalLight.values.helper && directionalLightRef,
    DirectionalLightHelper,
  )
  useHelper(shadowCamera.values.helper && cameraRef, CameraHelper)

  return (
    <directionalLight ref={directionalLightRef}>
      <orthographicCamera ref={cameraRef} attach="shadow-camera" />
    </directionalLight>
  )
}

export default DirectionalLight
