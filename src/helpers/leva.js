import { useControls, button } from "leva"
import { Color } from "three"

/* ---------------------------------SceneRender-------------------------------------- */

const SceneRenderControl = () => {
  const defaultValues = {
    orbit_controls: true,
    directional_lights: true,
    environment_map: true,
    soft_shadows: false,
    axes_helper: false,
    performance_monitor: false,
    grid_helper: false,
  }

  const [
    {
      orbit_controls,
      directional_lights,
      environment_map,
      soft_shadows,
      axes_helper,
      performance_monitor,
      grid_helper,
    },
    set,
  ] = useControls("scene_render", () => ({
    ...defaultValues,
    reset: button(() => {
      set({
        ...defaultValues,
      })
    }),
  }))
  return {
    values: {
      orbit_controls,
      directional_lights,
      environment_map,
      soft_shadows,
      axes_helper,
      performance_monitor,
      grid_helper,
    },
    set,
  }
}

/* ---------------------------------CanvasControl-------------------------------------- */

const CanvasControl = () => {
  const defaultValues = {
    toneMapping: "ACESFilmicToneMapping",
    colorSpace: "SRGBColorSpace",
  }

  const [{ toneMapping, colorSpace }, set] = useControls("canvas", () => ({
    toneMapping: {
      value: "ACESFilmicToneMapping",
      options: [
        "NoToneMapping",
        "LinearToneMapping",
        "ReinhardToneMapping",
        "CineonToneMapping",
        "ACESFilmicToneMapping",
        "AgXToneMapping",
        "CustomToneMapping",
      ],
    },
    colorSpace: {
      value: "SRGBColorSpace",
      options: ["SRGBColorSpace", "LinearSRGBColorSpace"],
    },
    reset: button(() => {
      set({
        ...defaultValues,
      })
    }),
  }))
  return { values: { toneMapping, colorSpace }, set }
}

/* ---------------------------------CameraControl--------------------------------- */

const CameraControl = (cameraRef) => {
  const defaultValues = {
    helper: false,
    fov: 45,
    position: {
      x: 0,
      y: 6,
      z: 20,
    },
    near: 0.1,
    far: 200,
  }
  const [{ helper }, set] = useControls("camera", () => ({
    helper: defaultValues.helper,
    fov: {
      value: defaultValues.fov,
      min: 1,
      step: 1,
      onChange: (value) => {
        cameraRef.current.fov = value
        cameraRef.current.updateProjectionMatrix()
      },
    },
    position: {
      x: defaultValues.position.x,
      y: defaultValues.position.y,
      z: defaultValues.position.z,
      onChange: (value) => {
        cameraRef.current.position.copy(value)
      },
    },
    near: {
      value: defaultValues.near,
      min: 0.1,
      step: 1,
      onChange: (value) => {
        cameraRef.current.near = value
        cameraRef.current.updateProjectionMatrix()
      },
    },
    far: {
      value: defaultValues.far,
      min: 1,
      step: 1,
      onChange: (value) => {
        cameraRef.current.far = value
        cameraRef.current.updateProjectionMatrix()
      },
    },
    reset: button(() => {
      set({
        ...defaultValues,
      })
    }),
  }))
  return { values: { helper }, set }
}

/* ----------------------------DirectionalLightControl----------------------------- */

const DirectionalLightControl = (directionalLightRef) => {
  const defaultValues = {
    helper: false,
    castShadow: true,
    intensity: 2.8,
    position: {
      x: -9,
      y: 15,
      z: -8,
    },
    color: "#ffffff",
  }

  const [{ helper, castShadow }, set] = useControls(
    "directional_lights",
    () => ({
      helper: defaultValues.helper,
      castShadow: defaultValues.castShadow,
      intensity: {
        value: defaultValues.intensity,
        min: 0,
        max: 10,
        step: 0.001,
        onChange: (value) => {
          directionalLightRef.current.intensity = value
        },
      },
      position: {
        x: defaultValues.position.x,
        y: defaultValues.position.y,
        z: defaultValues.position.z,
        onChange: (value) => {
          directionalLightRef.current.position.copy(value)
        },
      },
      color: {
        value: defaultValues.color,
        onChange: (value) => {
          directionalLightRef.current.color = new Color(value)
        },
      },
      reset: button(() => {
        set({
          ...defaultValues,
        })
      }),
    }),
  )
  return { values: { helper, castShadow }, set }
}

/* -------------------------------ShadowCameraControl-------------------------------- */

const ShadowCameraControl = (directionalLightRef) => {
  const defaultValues = {
    helper: false,
    near: 10,
    far: 30,
    top: 12.5,
    bottom: -5,
    left: -7,
    right: 11,
    quality: 1024,
    bias: 0,
    normalBias: 0,
  }

  const [{ helper }, set] = useControls(
    "directional_lights_shadow_camera",
    () => ({
      helper: defaultValues.helper,
      near: {
        value: defaultValues.near,
        min: 1,
        max: 50,
        step: 0.1,
        onChange: (value) => {
          directionalLightRef.current.shadow.camera.near = value
          directionalLightRef.current.shadow.camera.updateProjectionMatrix()
        },
      },
      far: {
        value: defaultValues.far,
        min: 1,
        max: 50,
        step: 0.1,
        onChange: (value) => {
          directionalLightRef.current.shadow.camera.far = value
          directionalLightRef.current.shadow.camera.updateProjectionMatrix()
        },
      },
      top: {
        value: defaultValues.top,
        min: 0,
        step: 0.1,
        onChange: (value) => {
          directionalLightRef.current.shadow.camera.top = value
          directionalLightRef.current.shadow.camera.updateProjectionMatrix()
        },
      },
      bottom: {
        value: defaultValues.bottom,
        max: 0,
        step: 0.1,
        onChange: (value) => {
          directionalLightRef.current.shadow.camera.bottom = value
          directionalLightRef.current.shadow.camera.updateProjectionMatrix()
        },
      },
      left: {
        value: defaultValues.left,
        max: 0,
        step: 0.1,
        onChange: (value) => {
          directionalLightRef.current.shadow.camera.left = value
          directionalLightRef.current.shadow.camera.updateProjectionMatrix()
        },
      },
      right: {
        value: defaultValues.right,
        min: 0,
        step: 0.1,
        onChange: (value) => {
          directionalLightRef.current.shadow.camera.right = value
          directionalLightRef.current.shadow.camera.updateProjectionMatrix()
        },
      },
      quality: {
        value: defaultValues.quality,
        options: [128, 256, 512, 1024, 2048, 4096],
        onChange: (value) => {
          const mapSizeValue = { x: value, y: value }
          directionalLightRef.current.shadow.mapSize.copy(mapSizeValue)
          directionalLightRef.current.shadow.map?.setSize(value, value)
        },
      },
      bias: {
        value: defaultValues.bias,
        min: -0.05,
        max: 0.05,
        step: 0.001,
        onChange: (value) => {
          directionalLightRef.current.shadow.bias = value
        },
      },
      normalBias: {
        value: defaultValues.normalBias,
        min: -0.05,
        max: 0.05,
        step: 0.001,
        onChange: (value) => {
          directionalLightRef.current.shadow.normalBias = value
        },
      },
      reset: button(() => {
        set({
          ...defaultValues,
        })
      }),
    }),
  )
  return { values: { helper }, set }
}

/* ------------------------------SoftShadowsControl-------------------------------- */

const SoftShadowsControl = () => {
  const defaultValues = {
    size: 3,
    focus: 0.2,
    samples: 10,
  }
  const [{ size, focus, samples }, set] = useControls("soft_shadows", () => ({
    size: { value: defaultValues.size, min: 0, max: 100, step: 1 },
    focus: { value: defaultValues.focus, min: 0, max: 2, step: 0.1 },
    samples: { value: defaultValues.samples, min: 1, max: 20, step: 1 },
    reset: button(() => {
      set({
        ...defaultValues,
      })
    }),
  }))

  return { values: { size, focus, samples }, set }
}

/* --------------------------------EnvironmentMapControl------------------------------- */

const EnvironmentMapControl = () => {
  const defaultValues = {
    background: true,
    backgroundIntensity: 1.0,
    backgroundRotation: [0, Math.PI / 2, 0],
    blur: 0,
    environmentIntensity: 1.0,
    environmentRotation: [0, Math.PI / 2, 0],
  }

  const [
    {
      background,
      backgroundIntensity,
      backgroundRotation,
      blur,
      environmentIntensity,
      environmentRotation,
    },
    set,
  ] = useControls("environmentMap", () => ({
    background: defaultValues.background,
    backgroundIntensity: {
      value: defaultValues.backgroundIntensity,
      min: 0,
      step: 0.01,
    },
    backgroundRotation: defaultValues.backgroundRotation,
    blur: {
      value: defaultValues.blur,
      min: 0,
      max: 1,
      step: 0.01,
    },
    environmentIntensity: {
      value: defaultValues.environmentIntensity,
      min: 0,
      max: 2,
      step: 0.01,
    },
    environmentRotation: defaultValues.environmentRotation,

    reset: button(() => {
      set({
        ...defaultValues,
      })
    }),
  }))
  return {
    values: {
      background,
      backgroundIntensity,
      backgroundRotation,
      blur,
      environmentIntensity,
      environmentRotation,
    },
    set,
  }
}

/* --------------------------------AxesControl------------------------------------ */

const AxesControl = (axesHelperRef) => {
  const defaultValues = {
    extend: 1,
  }

  const [, set] = useControls("axes_helper", () => ({
    extend: {
      value: defaultValues.extend,
      min: 1,
      max: 30,
      step: 1,
      onChange: (value) => {
        // we put the same value for x,y,z axis so we don't need to adjust every separately
        const scaleValue = { x: value, y: value, z: value }
        axesHelperRef.current.scale.copy(scaleValue)
      },
    },
    reset: button(() => {
      set({
        ...defaultValues,
      })
    }),
  }))
  return { set }
}
/* --------------------------------GridControl------------------------------------ */

const GridControl = () => {
  const defaultValues = {
    position: [0, 0, 0],
    gridSize: [5, 5],
    cellSize: 1,
    cellThickness: 2,
    cellColor: "#6f6f6f",
    sectionSize: 5,
    sectionThickness: 1.5,
    sectionColor: "#9d4b4b",
    fadeDistance: 200,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  }

  const [
    {
      position,
      gridSize,
      cellSize,
      cellThickness,
      cellColor,
      sectionSize,
      sectionThickness,
      sectionColor,
      fadeDistance,
      fadeStrength,
      followCamera,
      infiniteGrid,
    },
    set,
  ] = useControls("grid", () => ({
    position: defaultValues.position,
    gridSize: defaultValues.gridSize,
    cellSize: { value: defaultValues.cellSize, min: 0, max: 10, step: 0.1 },
    cellThickness: {
      value: defaultValues.cellThickness,
      min: 0,
      max: 5,
      step: 0.1,
    },
    cellColor: defaultValues.cellColor,
    sectionSize: {
      value: defaultValues.sectionSize,
      min: 0,
      max: 10,
      step: 0.1,
    },
    sectionThickness: {
      value: defaultValues.sectionThickness,
      min: 0,
      max: 5,
      step: 0.1,
    },
    sectionColor: defaultValues.sectionColor,
    fadeDistance: {
      value: defaultValues.fadeDistance,
      min: 0,
      max: 500,
      step: 1,
    },
    fadeStrength: {
      value: defaultValues.fadeStrength,
      min: 0,
      max: 1,
      step: 0.1,
    },
    followCamera: defaultValues.followCamera,
    infiniteGrid: defaultValues.infiniteGrid,
    reset: button(() => {
      set({
        ...defaultValues,
      })
    }),
  }))
  return {
    values: {
      position,
      gridSize,
      cellSize,
      cellThickness,
      cellColor,
      sectionSize,
      sectionThickness,
      sectionColor,
      fadeDistance,
      fadeStrength,
      followCamera,
      infiniteGrid,
    },
    set,
  }
}

export {
  SceneRenderControl,
  CanvasControl,
  CameraControl,
  DirectionalLightControl,
  ShadowCameraControl,
  SoftShadowsControl,
  EnvironmentMapControl,
  AxesControl,
  GridControl,
}
