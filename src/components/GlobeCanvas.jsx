import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlobeCanvas({ artData, onPointClick, selectedArt, showCityPopup }) {
  const mountRef = useRef(null);
  const globeRef = useRef(null);
  const selectedRef = useRef(null);
  const autoRotateRef = useRef(true);

  // Keep refs in sync
  useEffect(() => {
    selectedRef.current = selectedArt;
    autoRotateRef.current = !selectedArt;
  }, [selectedArt]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const W = container.clientWidth, H = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xF5E6D3, 0.7));
    const dirLight = new THREE.DirectionalLight(0xFFE4C4, 1.0);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0xC8956C, 0.35);
    rimLight.position.set(-3, -1, -3);
    scene.add(rimLight);

    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const globeTex = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const bumpTex = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    const globeMat = new THREE.MeshPhongMaterial({
      map: globeTex, bumpMap: bumpTex, bumpScale: 0.02,
      specular: new THREE.Color(0xC8956C), shininess: 14,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);
    globeRef.current = globeMesh;

    const atmosGeo = new THREE.SphereGeometry(1.06, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.62 - dot(vNormal, vec3(0,0,1)), 2.2); gl_FragColor = vec4(0.78, 0.58, 0.42, 1.0) * intensity * 0.9; }`,
      blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true,
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    const markers = [];
    artData.forEach(art => {
      const phi = (90 - art.lat) * (Math.PI / 180);
      const theta = (art.lng + 180) * (Math.PI / 180);
      const R = 1.015;
      const x = -R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.cos(phi);
      const z = R * Math.sin(phi) * Math.sin(theta);

      const dotGeo = new THREE.CircleGeometry(0.022, 20);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xD4A54A, side: THREE.DoubleSide });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, y, z);
      dot.lookAt(0, 0, 0);
      dot.userData = art;
      globeMesh.add(dot);

      const ringGeo = new THREE.RingGeometry(0.03, 0.042, 28);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xC8956C, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);
      globeMesh.add(ring);

      const pulseGeo = new THREE.RingGeometry(0.042, 0.05, 28);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xD4A54A, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.set(x, y, z);
      pulse.lookAt(0, 0, 0);
      globeMesh.add(pulse);

      markers.push({ dot, ring, pulse, art });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let clickStart = { x: 0, y: 0 };
    let rotVelY = 0;

    const onPointerDown = (e) => {
      const p = e.touches ? e.touches[0] : e;
      isDragging = true;
      prevMouse = { x: p.clientX, y: p.clientY };
      clickStart = { x: p.clientX, y: p.clientY };
      rotVelY = 0;
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      if (e.touches) e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - prevMouse.x;
      const dy = p.clientY - prevMouse.y;
      globeMesh.rotation.y += dx * 0.005;
      globeMesh.rotation.x = Math.max(-1.2, Math.min(1.2, globeMesh.rotation.x + dy * 0.003));
      rotVelY = dx * 0.004;
      prevMouse = { x: p.clientX, y: p.clientY };
    };
    const onPointerUp = (e) => {
      isDragging = false;
      const p = e.changedTouches ? e.changedTouches[0] : e;
      if (Math.hypot(p.clientX - clickStart.x, p.clientY - clickStart.y) < 6) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((p.clientX - rect.left) / W) * 2 - 1;
        mouse.y = -((p.clientY - rect.top) / H) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const dots = markers.map(m => m.dot);
        const hits = raycaster.intersectObjects(dots, true);
        if (hits.length > 0 && hits[0].object.userData?.id) {
          onPointClick(hits[0].object.userData);
        }
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: false });
    container.addEventListener('touchmove', onPointerMove, { passive: false });
    container.addEventListener('touchend', onPointerUp);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!isDragging && autoRotateRef.current) {
        globeMesh.rotation.y += 0.0012 + rotVelY;
        rotVelY *= 0.96;
      } else if (!isDragging) {
        rotVelY *= 0.92;
        if (Math.abs(rotVelY) > 0.0001) {
          globeMesh.rotation.y += rotVelY;
        }
      }

      markers.forEach((m, i) => {
        const isSelected = selectedRef.current?.id === m.art.id;
        const baseScale = isSelected ? 1.8 : 1;
        const pulseAmp = isSelected ? 0.6 : 0.35;
        const s = baseScale + pulseAmp * Math.sin(t * (isSelected ? 3.5 : 2.2) + i * 1.1);
        m.pulse.scale.set(s, s, s);
        m.pulse.material.opacity = isSelected ? 0.7 * (1 - (s - baseScale) / pulseAmp) : 0.4 * (1 - (s - 1) / 0.35);
        m.dot.material.color.setHex(isSelected ? 0xFFD700 : 0xD4A54A);
        m.ring.material.opacity = isSelected ? 1 : 0.7;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: selectedArt ? 'default' : 'grab' }} />;
}