import { useRef } from "react"
import { AxesControl } from "../helpers/leva"

const AxesHelper = () => {
  const axesHelperRef = useRef(null)

  AxesControl(axesHelperRef)

  return <axesHelper ref={axesHelperRef} />
}

export default AxesHelper
