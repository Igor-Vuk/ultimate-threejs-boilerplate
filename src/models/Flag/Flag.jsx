import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRef } from "react"
import PropTypes from "prop-types"

import flagVertexShader from "../../shaders/flag/vertex.vs.glsl"
import flagFragmentShader from "../../shaders/flag/fragment.fs.glsl"

import { FlagControl } from "../../helpers/leva-models.js"

const Flag = ({ model, textures }) => {
  // const planeRef = useRef(null)
  const flagMaterialRef = useRef(null)
  const flag = FlagControl()

  /* --------------------- shader material ------------------------ */

  const FlagMaterial = shaderMaterial(
    {
      uFrequency: new THREE.Vector2(
        flag.values.frequencyX,
        flag.values.frequencyY,
      ),
      uAmplitude: new THREE.Vector2(
        flag.values.amplitudeX,
        flag.values.amplitudeY,
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
