import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

function init() {
  /* =================================================
     scene
    =================================================== */
  const scene = new THREE.Scene();

  /* =================================================
     camera
    =================================================== */
  const sizes = {
    height: window.innerHeight,
    width: window.innerWidth,
  };

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );

  /* =================================================
     renderer
    =================================================== */
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  /* =================================================
     texture
  =================================================== */
  const textureLoader = new THREE.TextureLoader();
  const particlesTexture = textureLoader.load("/public/textures/particles/8.png");

  /* =================================================
     object
    =================================================== */
  //particles
  const particlesGeometry = new THREE.BufferGeometry(1, 16, 32);

  const count = 10000;
  const positionArray = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 30;
    colorArray[i] = Math.random();
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );

  particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorArray, 3)
  );

  const pointMaterial = new THREE.PointsMaterial({
    size: 0.15,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particlesTexture,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particlesGeometry, pointMaterial);
  scene.add(particles);

  //text
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const loader = new FontLoader();

  loader.load("fonts/Noto Sans JP Medium_Regular.json", function (font) {
    const textGeometry = new TextGeometry("Three.jsすげぇ!", {
      font: font,
      size: 1,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    textGeometry.computeBoundingBox();

    const textWidth =
      textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.x = -textWidth / 2;

    scene.add(textMesh);
  });
  camera.position.z = 10;

  /* =================================================
     ブラウザのリサイズ操作
    =================================================== */
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (window.innerWidth <= 790) {
      camera.position.z = 15;
    }
  });
  /* =================================================
     light
  =================================================== */
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 0, 20);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);


  scene.add(directionalLight, ambientLight);

  /* =================================================
     control
  =================================================== */
  const controls = new OrbitControls(camera, renderer.domElement);

  /* =================================================
     camera animation
  =================================================== */
  var radius = 10;
  var angle = 0;

  const animate = () => {
    window.requestAnimationFrame(animate);

    camera.position.x = radius * Math.sin(angle);
    camera.position.y = radius * Math.cos(angle);
    camera.position.z = radius * Math.cos(angle);

    camera.lookAt(scene.position);

    angle += 0.005;

    renderer.render(scene, camera);
    controls.update(); // カメラ制御を更新
  };

  animate();
}

init();
