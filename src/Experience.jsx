import { Center } from "@react-three/drei"
import { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { Leva } from "leva"

import { CanvasControl, SceneRenderControl } from "./debug/leva"

import Camera from "./scene/Camera"
import Controls from "./scene/Controls"
import DirectionalLight from "./scene/DirectionalLight"
import SoftShadowsModifier from "./scene/SoftShadowsModifier"
import AxesHelper from "./scene/AxesHelper"
import PerformanceMonitor from "./scene/PerformanceMonitor"
import GridHelper from "./scene/GridHelper"

// import Fallback from "./models/Fallback"
import Models from "./models/Models"

export default function Experience() {
  const sceneRender = SceneRenderControl()
  const canvas = CanvasControl()

  const [showLeva, setShowLeva] = useState(true) //  show or hide leva on first load

  useEffect(() => {
    /*  add event listener to show or hide leva when "h" button is pressed */
    const handleLeva = (event) => {
      if (event.key == "h") {
        setShowLeva((showLeva) => !showLeva)
      }
    }
    window.addEventListener("keydown", handleLeva)
    return () => {
      window.removeEventListener("keydown", handleLeva)
    }
  }, [showLeva])

  return (
    <>
      <Leva collapsed hidden={showLeva} />
      <Canvas
        shadows
        gl={{
          outputColorSpace: THREE[canvas.values.colorSpace],
          toneMapping: THREE[canvas.values.toneMapping],
        }}
      >
        <Camera />
        {sceneRender.values.orbit_controls && <Controls />}
        {sceneRender.values.directional_lights && <DirectionalLight />}
        {sceneRender.values.soft_shadows && <SoftShadowsModifier />}
        {sceneRender.values.axes_helper && <AxesHelper />}
        {sceneRender.values.performance_monitor && <PerformanceMonitor />}
        {sceneRender.values.grid_helper && <GridHelper />}

        <Center>
          <Suspense fallback={null}>
            <Models />
          </Suspense>
        </Center>
      </Canvas>
    </>
  )
}
