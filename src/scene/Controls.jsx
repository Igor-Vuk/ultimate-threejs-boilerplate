import { useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import { ControlsControl } from "../helpers/leva.js"

const Controls = () => {
  console.log("RERENDER CONTROLS")
  const controlsRef = useRef(null)

  ControlsControl(controlsRef)

  return <OrbitControls ref={controlsRef} makeDefault />
}

export default Controls
