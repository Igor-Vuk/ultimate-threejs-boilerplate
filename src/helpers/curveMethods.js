import * as THREE from "three"

const createCurveFromJSON = (parrotPath) => {
  return new Promise((resolve) => {
    // Extract the vertices array from the JSON object
    const vertices = parrotPath.points

    // Create an empty array to store THREE.Vector3 instances
    const points = []

    // Iterate over the vertices and push THREE.Vector3 instances to the points array
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i].x
      const y = vertices[i].y
      const z = vertices[i].z
      points.push(new THREE.Vector3(x, y, z))
    }

    // Create a CatmullRomCurve3 using the points array
    const curve = new THREE.CatmullRomCurve3(points)

    // choose if it's closed or open curve
    curve.closed = parrotPath.closed

    resolve(curve)
  })
}

const getTubeFromCurve = (curve) => {
  return new Promise((resolve) => {
    const geometry = new THREE.TubeGeometry(curve, 100, 0.05, 8, curve.closed)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geometry, material)

    resolve(mesh)
  })
}

const loadCurveFromJSON = async (parrotPath) => {
  let curve = await createCurveFromJSON(parrotPath)
  let curveTubeMesh = await getTubeFromCurve(curve)

  let curveAndMesh = {
    curve: curve,
    mesh: curveTubeMesh,
  }

  return curveAndMesh
}

export default loadCurveFromJSON
