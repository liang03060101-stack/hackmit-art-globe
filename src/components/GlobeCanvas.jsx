import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';

export default function GlobeCanvas({ artData, onPointClick, selectedArt }) {
  const mountRef = useRef(null);
  const selectedRef = useRef(null);
  const autoRotateRef = useRef(true);
  const targetRotRef = useRef(null);
  const targetZoomRef = useRef(3.2);
  const onClickRef = useRef(onPointClick);

  // Keep callback ref fresh
  useEffect(() => { onClickRef.current = onPointClick; }, [onPointClick]);

  useEffect(() => {
    selectedRef.current = selectedArt;
    autoRotateRef.current = !selectedArt;

    if (selectedArt) {
      const targetY = -Math.PI / 2 - (selectedArt.lng * Math.PI / 180);
      const targetX = selectedArt.lat * Math.PI / 180;
      targetRotRef.current = { x: targetX, y: targetY };
      targetZoomRef.current = 2.4;
    } else {
      targetRotRef.current = null;
      targetZoomRef.current = 3.2;
    }
  }, [selectedArt]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Three.js setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
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

    // Globe mesh
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

    // Atmosphere
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.62 - dot(vNormal, vec3(0,0,1)), 2.2); gl_FragColor = vec4(0.78, 0.58, 0.42, 1.0) * intensity * 0.9; }`,
      blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 64), atmosMat));

    // ── 3D markers (subtle surface dots) + HTML labels ──
    const labelOverlay = document.createElement('div');
    labelOverlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:5;';
    container.appendChild(labelOverlay);

    // Inject label styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .globe-label {
        position: absolute;
        pointer-events: auto;
        cursor: pointer;
        transform: translate(-50%, -50%);
        transition: opacity 0.25s;
        -webkit-user-select: none;
        user-select: none;
      }
      .label-pill {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 5px 12px 5px 8px;
        background: rgba(26, 21, 16, 0.65);
        border: 1px solid rgba(200, 149, 108, 0.25);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        white-space: nowrap;
      }
      .globe-label:hover .label-pill,
      .globe-label.active .label-pill {
        background: rgba(26, 21, 16, 0.88);
        border-color: rgba(212, 165, 74, 0.6);
        box-shadow: 0 4px 24px rgba(200, 149, 108, 0.2), 0 0 0 1px rgba(200, 149, 108, 0.1);
        transform: scale(1.06);
      }
      .globe-label.active .label-pill {
        border-color: ${THEME.accentGold};
        box-shadow: 0 4px 24px rgba(212, 165, 74, 0.35);
      }
      .label-dot {
        width: 7px; height: 7px;
        border-radius: 50%;
        background: ${THEME.accentGold};
        box-shadow: 0 0 6px rgba(212, 165, 74, 0.5);
        flex-shrink: 0;
        transition: all 0.3s;
      }
      .globe-label:hover .label-dot {
        width: 9px; height: 9px;
        box-shadow: 0 0 12px rgba(212, 165, 74, 0.7);
      }
      .label-city {
        font-family: ${FONTS_SANS};
        font-size: 11px;
        font-weight: 600;
        color: ${THEME.accentLight};
        letter-spacing: 0.3px;
      }
      .label-title {
        font-family: ${FONTS};
        font-size: 11px;
        font-style: italic;
        color: ${THEME.textSec};
        max-width: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-width 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease 0.05s;
      }
      .globe-label:hover .label-title {
        max-width: 200px;
        opacity: 1;
      }
      .label-sep {
        color: rgba(200,149,108,0.3);
        font-size: 10px;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .globe-label:hover .label-sep {
        opacity: 1;
      }
    `;
    labelOverlay.appendChild(styleEl);

    // Build markers and labels
    const entries = artData.map(art => {
      const phi = (90 - art.lat) * (Math.PI / 180);
      const theta = (art.lng + 180) * (Math.PI / 180);
      const R = 1.015;
      const x = -R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.cos(phi);
      const z = R * Math.sin(phi) * Math.sin(theta);

      // Small 3D surface marker (visual anchor)
      const dotGeo = new THREE.CircleGeometry(0.018, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xD4A54A, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, y, z);
      dot.lookAt(0, 0, 0);
      globeMesh.add(dot);

      const ringGeo = new THREE.RingGeometry(0.025, 0.034, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xC8956C, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);
      globeMesh.add(ring);

      // HTML label
      const label = document.createElement('div');
      label.className = 'globe-label';
      label.innerHTML = `
        <div class="label-pill">
          <div class="label-dot"></div>
          <span class="label-city">${art.city}</span>
          <span class="label-sep">&middot;</span>
          <span class="label-title">${art.title}</span>
        </div>
      `;

      // Click handling with drag protection
      let pointerStart = { x: 0, y: 0 };
      label.addEventListener('pointerdown', (e) => {
        pointerStart = { x: e.clientX, y: e.clientY };
        e.stopPropagation(); // prevent globe drag
      });
      label.addEventListener('pointerup', (e) => {
        const dist = Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y);
        if (dist < 6) {
          onClickRef.current(art);
        }
      });

      labelOverlay.appendChild(label);

      return { dot, ring, label, art };
    });

    // ── Globe interaction (drag + zoom) ──
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let clickStart = { x: 0, y: 0 };
    let rotVelY = 0;

    const onPointerDown = (e) => {
      if (e.target !== renderer.domElement) return;
      const p = e.touches ? e.touches[0] : e;
      isDragging = true;
      prevMouse = { x: p.clientX, y: p.clientY };
      clickStart = { x: p.clientX, y: p.clientY };
      rotVelY = 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches.length > 1) return;
      if (e.touches) e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - prevMouse.x;
      const dy = p.clientY - prevMouse.y;

      if (targetRotRef.current) targetRotRef.current = null;

      globeMesh.rotation.y += dx * 0.005;
      globeMesh.rotation.x = Math.max(-1.2, Math.min(1.2, globeMesh.rotation.x + dy * 0.003));
      rotVelY = dx * 0.004;
      prevMouse = { x: p.clientX, y: p.clientY };
    };

    const onPointerUp = () => { isDragging = false; };

    const onWheel = (e) => {
      e.preventDefault();
      targetZoomRef.current = Math.max(1.8, Math.min(5.0, targetZoomRef.current + e.deltaY * 0.002));
    };

    let lastPinchDist = 0;
    const onTouchStart2 = (e) => {
      if (e.touches.length === 2) {
        lastPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const onTouchMove2 = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        targetZoomRef.current = Math.max(1.8, Math.min(5.0, targetZoomRef.current + (lastPinchDist - dist) * 0.008));
        lastPinchDist = dist;
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: false });
    container.addEventListener('touchstart', onTouchStart2, { passive: false });
    container.addEventListener('touchmove', onPointerMove, { passive: false });
    container.addEventListener('touchmove', onTouchMove2, { passive: false });
    container.addEventListener('touchend', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // ── Animation loop ──
    let frameId;
    const clock = new THREE.Clock();
    const worldPos = new THREE.Vector3();
    const projected = new THREE.Vector3();

    function normalizeAngle(a) {
      while (a > Math.PI) a -= 2 * Math.PI;
      while (a < -Math.PI) a += 2 * Math.PI;
      return a;
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Auto-navigate to target
      if (targetRotRef.current && !isDragging) {
        const target = targetRotRef.current;
        globeMesh.rotation.y += normalizeAngle(target.y - globeMesh.rotation.y) * 0.045;
        globeMesh.rotation.x += (target.x - globeMesh.rotation.x) * 0.045;
        rotVelY = 0;
      } else if (!isDragging && autoRotateRef.current) {
        globeMesh.rotation.y += 0.0012 + rotVelY;
        rotVelY *= 0.96;
      } else if (!isDragging) {
        rotVelY *= 0.92;
        if (Math.abs(rotVelY) > 0.0001) globeMesh.rotation.y += rotVelY;
      }

      // Smooth zoom
      camera.position.z += (targetZoomRef.current - camera.position.z) * 0.06;

      // Update label positions + visibility
      const W = container.clientWidth;
      const H = container.clientHeight;
      const camDir = camera.position.clone().normalize();

      entries.forEach(({ dot, ring, label, art }) => {
        dot.getWorldPosition(worldPos);
        const dotDir = worldPos.clone().normalize();
        const facing = dotDir.dot(camDir);
        const isSelected = selectedRef.current?.id === art.id;

        // Visibility: show when facing camera, fade near edges
        if (facing > 0.1) {
          projected.copy(worldPos).project(camera);
          const sx = (projected.x * 0.5 + 0.5) * W;
          const sy = (-projected.y * 0.5 + 0.5) * H;
          label.style.left = sx + 'px';
          label.style.top = sy + 'px';
          // Fade based on angle (smoother than hard cutoff)
          const alpha = Math.min(1, (facing - 0.1) / 0.25);
          label.style.opacity = alpha;
          label.style.pointerEvents = 'auto';
        } else {
          label.style.opacity = '0';
          label.style.pointerEvents = 'none';
        }

        // Active state
        if (isSelected) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }

        // 3D marker pulse for selected
        const ringScale = isSelected ? 1.4 + 0.3 * Math.sin(t * 3) : 1;
        ring.scale.set(ringScale, ringScale, ringScale);
        ring.material.opacity = isSelected ? 0.7 : 0.4;
        dot.material.opacity = isSelected ? 0.9 : 0.55;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchstart', onTouchStart2);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchmove', onTouchMove2);
      container.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (container.contains(labelOverlay)) container.removeChild(labelOverlay);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab' }} />;
}
