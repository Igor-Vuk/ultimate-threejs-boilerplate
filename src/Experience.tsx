import { Suspense, useEffect, useState, lazy } from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { RGBELoader } from "three-stdlib"
import { Center, useGLTF, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { Leva } from "leva"
import assetsPath from "./data/assetsPath.json"

// import Fallback from "./models/Fallback"  /* use Fallback component on Suspense if needed */
import { CanvasControl, SceneRenderControl } from "./helpers/leva"
import Camera from "./scene/Camera"
import Controls from "./scene/Controls"
import DirectionalLight from "./scene/DirectionalLight"
import SoftShadowsModifier from "./scene/SoftShadowsModifier"
import AxesHelper from "./scene/AxesHelper"
import PerformanceMonitor from "./scene/PerformanceMonitor"
import GridHelper from "./scene/GridHelper"

/* By lazy loading we are separating bundles that load to the browser */
const EnvironmentMap = lazy(() => import("./scene/EnvironmentMap"))
const Models = lazy(() => import("./models/Models"))

/* If we have for example map and aoMap for the same object we need to preload them separately */
useLoader.preload(RGBELoader, assetsPath.environmentMapFiles)
useGLTF.preload(assetsPath.modelPath)
useTexture.preload(assetsPath.bakedTexturePath.map)
useTexture.preload(assetsPath.flagTexturePath.map)

export default function Experience() {
  const sceneRender = SceneRenderControl()
  const canvas = CanvasControl()

  const [showLeva, setShowLeva] = useState<boolean>(true) //  show or hide leva on first load

  useEffect(() => {
    /*  add event listener to show or hide leva when "h" button is pressed */
    const handleLeva = (event: KeyboardEvent) => {
      if (event.key === "h") {
        setShowLeva((showLeva) => !showLeva)
      }
    }
    window.addEventListener("keydown", handleLeva)
    return () => {
      window.removeEventListener("keydown", handleLeva)
    }
  }, [])

  const {
    orbit_controls,
    performance_monitor,
    directional_lights,
    soft_shadows,
    axes_helper,
    grid_helper,
    environment_map,
  } = sceneRender.values

  const { toneMapping, colorSpace } = canvas.values
  return (
    <>
      <Leva collapsed hidden={showLeva} />
      <Canvas
        shadows
        gl={{
          toneMapping: THREE[toneMapping],
          outputColorSpace: THREE[colorSpace],
        }}
      >
        <Camera />
        {orbit_controls && <Controls />}
        {performance_monitor && <PerformanceMonitor />}
        {directional_lights && <DirectionalLight />}
        {soft_shadows && <SoftShadowsModifier />}
        {axes_helper && <AxesHelper />}
        {grid_helper && <GridHelper />}
        {environment_map && (
          <Suspense fallback={null}>
            <EnvironmentMap />
          </Suspense>
        )}

        <Center>
          <Suspense fallback={null}>
            <Models />
          </Suspense>
        </Center>
      </Canvas>
    </>
  )
}
