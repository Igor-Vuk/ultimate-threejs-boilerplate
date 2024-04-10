import { useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import { ControlsControl } from "../helpers/leva.js"

const Controls = () => {
  const controlsRef = useRef(null)

  ControlsControl(controlsRef)

  return <OrbitControls ref={controlsRef} makeDefault />
}

export default Controls
