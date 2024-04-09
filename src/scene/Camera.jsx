import { useRef } from "react"
import { PerspectiveCamera, useHelper } from "@react-three/drei"
import { CameraHelper } from "three"
import { CameraControl } from "../helpers/leva"

const Camera = () => {
  console.log("RERENDER CAMERA")
  const cameraRef = useRef(null)

  const camera = CameraControl(cameraRef)

  useHelper(camera.values.helper && cameraRef, CameraHelper)

  return <PerspectiveCamera ref={cameraRef} makeDefault />
}

export default Camera
