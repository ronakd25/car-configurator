import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Loader
const loader = new GLTFLoader();

// Store models
const accessories = {
  car: null,
  roofbox: null,
  sidesill: null,
  crossbars: null,
  bikeholder: null
};

// Load models (all in same folder as index.html)
loader.load("car.glb", gltf => {
  accessories.car = gltf.scene;
  scene.add(accessories.car);
});

loader.load("roofbox.glb", gltf => accessories.roofbox = gltf.scene);
loader.load("sidesill.glb", gltf => accessories.sidesill = gltf.scene);
loader.load("crossbars.glb", gltf => accessories.crossbars = gltf.scene);
loader.load("bikeholder.glb", gltf => accessories.bikeholder = gltf.scene);

// Dropdown event
document.getElementById("accessory").addEventListener("change", e => {
  const selected = e.target.value;

  // remove old accessories (keep car always)
  Object.keys(accessories).forEach(key => {
    if (key !== "car" && accessories[key] && scene.children.includes(accessories[key])) {
      scene.remove(accessories[key]);
    }
  });

  // Apply rules
  if (selected === "sidesill" && accessories.sidesill) {
    scene.add(accessories.sidesill);
  }

  if (selected === "crossbars" && accessories.crossbars) {
    scene.add(accessories.crossbars);
  }

  if (selected === "roofbox" && accessories.roofbox && accessories.crossbars) {
    scene.add(accessories.crossbars);
    scene.add(accessories.roofbox);
  }

  if (selected === "bikeholder" && accessories.bikeholder && accessories.crossbars) {
    scene.add(accessories.crossbars);
    scene.add(accessories.bikeholder);
  }
});

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
