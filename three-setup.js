(function initThreeStage() {
  const container = document.getElementById('webgl-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const mainGroup = new THREE.Group();
  const secondaryGroup = new THREE.Group();
  const tertiaryGroup = new THREE.Group();
  scene.add(mainGroup);
  scene.add(secondaryGroup);
  scene.add(tertiaryGroup);

  function createPlexus(count, radius, maxDist, dotHex, lineHex, lineOpac, dotSize) {
    const group = new THREE.Group();
    const positions = new Float32Array(count * 3);
    const points = [];

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      points.push(new THREE.Vector3(x, y, z));
    }

    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dotsMat = new THREE.PointsMaterial({ color: dotHex, size: dotSize, transparent: true, opacity: 1.0 });
    group.add(new THREE.Points(dotsGeo, dotsMat));

    const linePos = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (points[i].distanceTo(points[j]) < maxDist) {
          linePos.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
        }
      }
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const linesMat = new THREE.LineBasicMaterial({ color: lineHex, transparent: true, opacity: lineOpac });
    group.add(new THREE.LineSegments(linesGeo, linesMat));

    return group;
  }

  // 1. Main Background Sphere (250 Normal Pitch Black dots)
  const mainSphere = createPlexus(250, 4.2, 1.4, 0x000000, 0x000000, 0.05, 0.06);
  mainGroup.add(mainSphere);

  // 2. Secondary Sphere (Top Left, 150 Blue dots)
  const blueSphere = createPlexus(150, 1.4, 0.7, 0x0066FF, 0x000000, 0.08, 0.05);
  secondaryGroup.add(blueSphere);

  // 3. Tertiary Sphere (Bottom Right, 150 Orange dots)
  const orangeSphere = createPlexus(150, 1.4, 0.7, 0xFF6600, 0x000000, 0.08, 0.05);
  tertiaryGroup.add(orangeSphere);

  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function updateLayout() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    if (window.innerWidth < 768) {
      secondaryGroup.position.set(-2, 3.2, 1); // Lowered from 4.0
      tertiaryGroup.position.set(2, -3.5, 1);
    } else {
      secondaryGroup.position.set(-5.5, 3.2, 1); // Lowered from 4.2
      tertiaryGroup.position.set(5.5, -3.5, 1);
    }
  }
  
  window.addEventListener('resize', updateLayout);
  updateLayout(); 

  function animate() {
    requestAnimationFrame(animate);
    
    mainGroup.rotation.y += 0.001;
    mainGroup.rotation.x += 0.0005;

    secondaryGroup.rotation.y -= 0.003;
    secondaryGroup.rotation.x += 0.002;

    tertiaryGroup.rotation.y += 0.002;
    tertiaryGroup.rotation.x -= 0.003;
    
    mainGroup.rotation.y += (targetX * 0.15 - mainGroup.rotation.y) * 0.05;
    mainGroup.rotation.x += (-targetY * 0.15 - mainGroup.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }
  animate();
})();