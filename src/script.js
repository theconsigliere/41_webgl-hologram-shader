import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "lil-gui"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import vertex from "./shaders/vertex.glsl"
import fragment from "./shaders/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new GUI()

const config = {
  uAmountOfStripes: 20.0,
  uSpeedOfStripes: 5.0,
  uColour: new THREE.Color("#8fd2ff"),
  clearColor: "#324ad2",
}

// add unifrom
gui
  .add(config, "uAmountOfStripes")
  .min(1)
  .max(50)
  .step(1)
  .name("Amount of stripes")
  .onChange(() => {
    material.uniforms.uAmountOfStripes.value = config.uAmountOfStripes
  })

gui
  .add(config, "uSpeedOfStripes")
  .min(0.1)
  .max(25)
  .step(0.1)
  .name("Speed of stripes")
  .onChange(() => {
    material.uniforms.uSpeedOfStripes.value = config.uSpeedOfStripes
  })

gui.addColor(config, "uColour").onChange(() => {
  material.uniforms.uColor.value = config.uColour
})

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
)
// COURSE CODE
//camera.position.set(7, 7, 7)

camera.position.set(7, 3, 15)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setClearColor(config.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

gui.addColor(config, "clearColor").onChange(() => {
  renderer.setClearColor(config.clearColor)
})

/**
 * Material
 */
const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uAmountOfStripes: { value: config.uAmountOfStripes },
    uSpeedOfStripes: { value: config.uSpeedOfStripes },
    uColor: { value: config.uColour },
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})
/**
 * Objects
 */
// Torus knot
let torusKnot = null
// torusKnot = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
//   material
// )
// torusKnot.position.x = 3
// scene.add(torusKnot)

// Sphere
let sphere = null
// sphere = new THREE.Mesh(new THREE.SphereGeometry(), material)
// sphere.position.x = -3
// scene.add(sphere)

// Suzanne
let suzanne = null
// gltfLoader.load("./suzanne.glb", (gltf) => {
//   suzanne = gltf.scene
//   suzanne.traverse((child) => {
//     if (child.isMesh) child.material = material
//   })
//   scene.add(suzanne)
// })

let mxkLogo = null
gltfLoader.load("./mxk-logo.glb", (gltf) => {
  mxkLogo = gltf.scene
  mxkLogo.traverse((child) => {
    if (child.isMesh) child.material = material
  })

  mxkLogo.scale.set(0.35, 0.35, 0.35)
  mxkLogo.rotation.x = Math.PI / 2
  scene.add(mxkLogo)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  material.uniforms.uTime.value = elapsedTime

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1
    suzanne.rotation.y = elapsedTime * 0.2
  }

  if (mxkLogo) {
    mxkLogo.rotation.z = -elapsedTime * 0.25
  }

  if (sphere) {
    sphere.rotation.x = -elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2
  }

  if (torusKnot) {
    torusKnot.rotation.x = -elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
