import { useEffect, useState } from "react"
import loadCurveFromJSON from "../helpers/curveMethods.js"

const useJsonCurve = (curvePoints) => {
  const [curvePath, setCurvePath] = useState(null)

  useEffect(() => {
    const loadCurve = async () => {
      try {
        /* wait for the curve to be generated before animating in useFrame */
        const curve = await loadCurveFromJSON(curvePoints)
        setCurvePath(curve)
      } catch (error) {
        console.error("Error loading curve:", error)
      }
    }
    loadCurve()
  }, [curvePoints])

  return { curvePath }
}

export default useJsonCurve
