import { useEffect } from "react"
import { Environment } from "@react-three/drei"
import { EnvironmentMapControl } from "../debug/leva"
import PropTypes from "prop-types"

const EnvironmentMap = ({
  setEnvironmentMapIntensity,
  environmentMapFiles,
}) => {
  const environmentMap = EnvironmentMapControl()

  useEffect(() => {
    setEnvironmentMapIntensity(environmentMap.values.intensity)
  }, [environmentMap.values.intensity, setEnvironmentMapIntensity])
  return (
    <Environment
      background={environmentMap.values.background}
      blur={environmentMap.values.blur}
      files={environmentMapFiles}
    />
  )
}

export default EnvironmentMap

EnvironmentMap.propTypes = {
  setEnvironmentMapIntensity: PropTypes.func,
  environmentMapFiles: PropTypes.string,
}
