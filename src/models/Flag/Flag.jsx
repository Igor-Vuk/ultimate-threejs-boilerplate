import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRef } from "react"
import PropTypes from "prop-types"

import flagVertexShader from "../../shaders/flag/vertex.vs.glsl"
import flagFragmentShader from "../../shaders/flag/fragment.fs.glsl"

import { FrequencyControl } from "../../helpers/leva-models.js"

const Flag = ({ model, textures }) => {
  console.log("RERENDER FRQUENCY")

  // const planeRef = useRef(null)
  const flagMaterialRef = useRef(null)
  const frequency = FrequencyControl()

  /* --------------------- shader material ------------------------ */

  const FlagMaterial = shaderMaterial(
    {
      uFrequency: new THREE.Vector2(frequency.values.x, frequency.values.y),
      uAmplitude: new THREE.Vector2(
        frequency.values.amplitudeX,
        frequency.values.amplitudeY,
      ),
      uTime: 0,
      uTexture: textures.map,
    },
    flagVertexShader,
    flagFragmentShader,
  )

  extend({ FlagMaterial })

  /* -------------------------------------------------------------- */

  /* Example hot so send attribute to vertex shader */
  // useEffect(() => {
  //   const count = planeRef.current.geometry.attributes.position.count
  //   const randoms = new Float32Array(count)

  //   for (let i = 0; i < count; i++) {
  //     randoms[i] = Math.random()
  //   }

  //   planeRef.current.geometry.setAttribute(
  //     "aRandom",
  //     new THREE.BufferAttribute(randoms, 1),
  //   )
  // }, [])

  useFrame((state, delta) => {
    /* we can update attributes directly like this */
    flagMaterialRef.current.uTime += delta
  })

  const renderModel = () => {
    return model.scene.children.map((mesh) => {
      const collection = mesh.userData.collection
      if (collection === "flag") {
        const defaultMeshProperties = {
          // ref: planeRef,
          name: mesh.name,
          castShadow: true,
          receiveShadow: true,
          geometry: mesh.geometry,
          position: mesh.position,
          rotation: mesh.rotation,
          scale: mesh.scale,
        }

        return (
          <mesh {...defaultMeshProperties} key={mesh.uuid}>
            {/* We attach a unique key property to the prototype class to enable hot-reload. */}
            <flagMaterial
              key={FlagMaterial.key}
              ref={flagMaterialRef}
              side={THREE.DoubleSide}
              wireframe={false}
            />
          </mesh>
        )
      }
    })
  }

  return <>{renderModel()}</>
}

export default Flag

Flag.propTypes = {
  model: PropTypes.object.isRequired,
  textures: PropTypes.object,
}
