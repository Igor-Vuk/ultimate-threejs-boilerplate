import { SoftShadows } from "@react-three/drei"
import { SoftShadowsControl } from "../debug/leva"

const SoftShadowsModifier = () => {
  const { ...shadowConfig } = SoftShadowsControl()

  return <SoftShadows {...shadowConfig.values} />
}

export default SoftShadowsModifier
