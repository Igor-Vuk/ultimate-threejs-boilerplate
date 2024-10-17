import { Suspense, useEffect, useState, lazy } from "react"
import { Canvas } from "@react-three/fiber"
import { Center, useGLTF, useTexture, useEnvironment } from "@react-three/drei"
import * as THREE from "three"
import { Leva } from "leva"
import assetsPath from "./data/assetsPath.json"

// import Fallback from "./contentComponents/canvasComponents/fallback/Fallback" /* use Fallback component on Suspense if needed */
import { CanvasControl, SceneRenderControl } from "./helpers/leva"
import Camera from "./sceneComponents/Camera"
import Controls from "./sceneComponents/Controls"
import DirectionalLight from "./sceneComponents/DirectionalLight"
import SoftShadowsModifier from "./sceneComponents/SoftShadowsModifier"
import AxesHelper from "./sceneComponents/AxesHelper"
import PerformanceMonitor from "./sceneComponents/PerformanceMonitor"
import GridHelper from "./sceneComponents/GridHelper"

/* By lazy loading we are separating bundles that load to the browser */
const EnvironmentMap = lazy(() => import("./sceneComponents/EnvironmentMap"))
const Models = lazy(() => import("./contentComponents/canvasComponents/Models"))

/* If we have for example map and aoMap for the same object we need to preload them separately */
useEnvironment.preload({ files: assetsPath.environmentMapFiles })
useGLTF.preload(assetsPath.modelPath)
useTexture.preload(assetsPath.bakedTexturePath)
useTexture.preload(assetsPath.flagTexturePath)

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

  const { toneMapping, colorSpace, toneMappingExposure } = canvas.values
  return (
    <>
      <Leva collapsed hidden={showLeva} />
      <Canvas
        shadows
        gl={{
          toneMapping: THREE[toneMapping],
          outputColorSpace: THREE[colorSpace],
          toneMappingExposure: toneMappingExposure, // default is 1.0. It doesn't work with "NoToneMapping"
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
