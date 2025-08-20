let scene, camera, renderer, loader;
let car, accessories = {};

init();
loadBaseCar();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("viewer").appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  loader = new THREE.GLTFLoader();

  animate();

  document.getElementById("accessory").addEventListener("change", handleSelection);
}

function loadBaseCar() {
  loader.load("models/car.glb", (gltf) => {
    car = gltf.scene;
    scene.add(car);
  });
}

function handleSelection(e) {
  const value = e.target.value;

  // remove all accessories
  for (let key in accessories) {
    scene.remove(accessories[key]);
  }
  accessories = {};

  if (value === "sidesills") {
    loadAccessory("sidesills.glb", "sidesills");
  } 
  else if (value === "crossbars") {
    loadAccessory("crossbars.glb", "crossbars");
  } 
  else if (value === "roofbox") {
    // must include crossbars
    loadAccessory("crossbars.glb", "crossbars");
    loadAccessory("roofbox.glb", "roofbox");
  } 
  else if (value === "bikeholder") {
    // must include crossbars, cannot show with roofbox
    loadAccessory("crossbars.glb", "crossbars");
    loadAccessory("bikeholder.glb", "bikeholder");
  }
}

function loadAccessory(file, name) {
  loader.load("models/" + file, (gltf) => {
    accessories[name] = gltf.scene;
    scene.add(accessories[name]);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
