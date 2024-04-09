import { useControls, button } from "leva"

/* ------------------------------Flag Shader-------------------------------- */

const FrequencyControl = () => {
  const defaultValues = {
    x: 4.0,
    y: 1.5,
    amplitudeX: 0.01,
    amplitudeY: 0.01,
  }
  const [{ x, y, amplitudeX, amplitudeY }, set] = useControls(
    "flag_wave_frequency",
    () => ({
      x: { value: defaultValues.x, min: 0, max: 20, step: 0.01 },
      y: { value: defaultValues.y, min: 0, max: 20, step: 0.01 },
      amplitudeX: {
        value: defaultValues.amplitudeX,
        min: 0,
        max: 1,
        step: 0.01,
      },
      amplitudeY: {
        value: defaultValues.amplitudeY,
        min: 0,
        max: 1,
        step: 0.01,
      },
      reset: button(() => {
        set({
          ...defaultValues,
        })
      }),
    }),
  )

  return { values: { x, y, amplitudeX, amplitudeY }, set }
}

export { FrequencyControl }
