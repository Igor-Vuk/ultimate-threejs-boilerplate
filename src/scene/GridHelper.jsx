import { Grid } from "@react-three/drei"
import { GridControl } from "../helpers/leva"

const GridHelper = () => {
  const { ...gridConfig } = GridControl()
  const { gridSize, ...config } = gridConfig.values

  return <Grid args={gridSize} {...config} />
}

export default GridHelper
