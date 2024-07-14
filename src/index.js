console.log("javascript has loaded");
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const gui = new GUI();

const canvas = document.querySelector("canvas.webgl");

const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = size.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.setPixelRatio, 2));
});

const scene = new THREE.Scene();

// axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// const cube = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: "red" });
// const mesh = new THREE.Mesh(cube, material);
// scene.add(mesh);

// gui.add(mesh.position, "y");

const textureLoader = new THREE.TextureLoader();
const matcapTexure = textureLoader.load("textures/matcaps/2.png");
// matcapTexure.colorSpace = THREE.SRGBColorSpace;

const textInformation = "hello bitches";

const fontLoader = new FontLoader();
fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  let textGeometry = new TextGeometry(textInformation, {
    font: font,
    size: 0.3,
    depth: 0.1,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.2) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.2) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.3) * 0.5
  //   );
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({});
  textMaterial.matcap = matcapTexure;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  gui
    .add(textGeometry.parameters.options, "size")
    .min(0)
    .max(1)
    .step(0.1)
    .onFinishChange((v) => {
      textGeometry.dispose();
      textGeometry = new TextGeometry(textInformation, {
        size: v,
      });
    });
  // gui.add(textGeometry.parameters.options, "depth").min(0).max(1).step(0.01);
  // gui
  //   .add(textGeometry.parameters.options, "curveSegments")
  //   .min(0)
  //   .max(20)
  //   .step(1);
  // gui.add(textGeometry.parameters.options, "bevelEnabled");

  console.time("donuts");
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexure,
  });

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.z = Math.random() * Math.PI;

    const rnd = Math.random();
    donutGeometry.scale.x = rnd;
    donutGeometry.scale.y = rnd;
    donutGeometry.scale.z = rnd;

    scene.add(donut);
  }
});

console.timeEnd("donuts");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
