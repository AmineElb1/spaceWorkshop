import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// GSAP
import { gsap } from 'gsap';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Verlichting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// GLTF Loader 
const loader = new GLTFLoader();
let astronaut; // Variabele om het geladen model op te slaan

// GLB Bestand laden
loader.load(
  '/models/scene.gltf', // Pas dit pad aan naar jouw GLB-bestand
  function (gltf) {
    astronaut = gltf.scene;
    astronaut.scale.set(0.021, 0.021, 0.021); // Start met een standaard schaal
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material= new THREE.MeshStandardMaterial({color: "white"});
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(astronaut);

    console.log('Astronaut geladen:', astronaut);
  },
  undefined,
  function (error) {
    console.error('GLB laadfout:', error);
  }
);

// Kleurwijziging op basis van HTML-buttons
document.querySelectorAll('.color__item').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault(); // Voorkom standaard gedrag van <a> tag
    const color = event.target.dataset.color; // Haal de kleurwaarde op uit data-attribute

    //gsap
    

    if (astronaut) {
      astronaut.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color.set(color); // Stel de kleur van het materiaal in
        }
      });
      console.log(`Astronaut gekleurd: ${color}`);
    }
  });
});

// Camera positie
camera.position.set(0, 4, 6);

// Animatie
function animate() {
  requestAnimationFrame(animate);

 
  controls.update();
  renderer.render(scene, camera);
}

animate();
