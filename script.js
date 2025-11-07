// Import module dari jsDelivr agar stabil di browser
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/ShaderPass.js";

// Inisialisasi scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Cahaya
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Bola “spirit”
const geometry = new THREE.SphereGeometry(1.2, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffcc,
  emissive: 0x00ffaa,
  emissiveIntensity: 0.5,
  roughness: 0.4,
  metalness: 0.1,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Post-processing composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2, // strength
  0.4, // radius
  0.2 // threshold
);
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Animasi
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  sphere.rotation.x += 0.005;
  composer.render();
}
animate();

// Preloader logic
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const mainContent = document.getElementById("main-content");
  const progressBar = document.querySelector(".progress-bar");

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = progress + "%";
    progressBar.style.opacity = "1";
    if (progress >= 100) {
      clearInterval(interval);
      preloader.classList.add("fade-out");
      mainContent.classList.add("fade-in");
      renderer.domElement.classList.add("fade-in");
    }
  }, 150);
});
