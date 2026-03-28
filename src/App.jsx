import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   ART GLOBE — World Masterpieces × AI Artist Dialogue
   Museum-inspired warm aesthetic  (v2 optimized)
   ═══════════════════════════════════════════════════════ */

const THEME = {
  accent: '#C8956C',
  accentLight: '#E2BD94',
  accentGold: '#D4A54A',
  accentDim: 'rgba(200, 149, 108, 0.25)',
  bg: '#1A1510',
  bgPanel: 'rgba(28, 24, 18, 0.95)',
  bgCard: 'rgba(40, 34, 26, 0.9)',
  border: 'rgba(200, 149, 108, 0.2)',
  borderLight: 'rgba(200, 149, 108, 0.35)',
  textMain: '#F5EDE4',
  textSec: 'rgba(245, 237, 228, 0.6)',
  textWarm: '#E8D5BF',
  glow: '0 0 30px rgba(200, 149, 108, 0.25)',
  shadow: '0 8px 32px rgba(0,0,0,0.5)',
};

const FONTS = `'Cormorant Garamond', 'Playfair Display', Georgia, serif`;
const FONTS_SANS = `'DM Sans', 'Helvetica Neue', sans-serif`;

// ─── Art Data with extra city info ───
const ART_DATA = [
  {
    id: 1, lat: 48.8566, lng: 2.3522, city: 'Paris', museum: 'Musée du Louvre',
    title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: '1503–1519',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg&w=600&output=webp',
    desc: 'The most famous painting in the world, housed in the Louvre. A masterpiece of Renaissance sfumato technique and psychological depth.',
    cityInfo: {
      otherWorks: ['Winged Victory of Samothrace', 'Venus de Milo', 'Liberty Leading the People'],
      museums: ['Louvre', "Musée d'Orsay", 'Centre Pompidou'],
      artFact: 'Paris houses over 130 museums — the densest concentration in any city worldwide.',
    },
  },
  {
    id: 2, lat: 40.7614, lng: -73.9776, city: 'New York', museum: 'MoMA',
    title: 'The Starry Night', artist: 'Vincent van Gogh', year: '1889',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg&w=600&output=webp',
    desc: "Painted during Van Gogh's stay at Saint-Rémy asylum. The swirling night sky pulses with emotion and cosmic energy.",
    cityInfo: {
      otherWorks: ["Les Demoiselles d'Avignon", "Campbell's Soup Cans", 'Washington Crossing the Delaware'],
      museums: ['MoMA', 'The Met', 'Guggenheim'],
      artFact: 'The Met is the largest art museum in the Americas, with over 2 million works spanning 5,000 years.',
    },
  },
  {
    id: 3, lat: 35.7150, lng: 139.7734, city: 'Tokyo', museum: 'Various Collections',
    title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: '1831',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg&w=600&output=webp',
    desc: 'The most iconic ukiyo-e woodblock print. Mount Fuji stands serene as towering waves crash with terrifying beauty.',
    cityInfo: {
      otherWorks: ['Fine Wind, Clear Morning (Red Fuji)', 'Thirty-six Views of Mt. Fuji series', 'Edo-period screen paintings'],
      museums: ['Tokyo National Museum', 'Mori Art Museum', 'teamLab Borderless'],
      artFact: 'Hokusai created over 30,000 works across 70 years — he didn\'t consider his work worthy until age 73.',
    },
  },
  {
    id: 4, lat: 52.0804, lng: 4.3143, city: 'The Hague', museum: 'Mauritshuis',
    title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: '1665',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg&w=600&output=webp',
    desc: 'Called the "Mona Lisa of the North." Vermeer\'s mastery of light culminates in the luminous pearl and the girl\'s enigmatic gaze.',
    cityInfo: {
      otherWorks: ['The Anatomy Lesson of Dr. Nicolaes Tulp', 'The Goldfinch', 'View of Delft'],
      museums: ['Mauritshuis', 'Escher in Het Paleis', 'Gemeentemuseum'],
      artFact: 'Vermeer produced only about 34 paintings in his lifetime — each one a jewel of light.',
    },
  },
  {
    id: 5, lat: 40.4083, lng: -3.6946, city: 'Madrid', museum: 'Museo Reina Sofía',
    title: 'Guernica', artist: 'Pablo Picasso', year: '1937',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg&w=600&output=webp',
    desc: "A monumental anti-war statement. Picasso's Cubist language transforms the bombing of Guernica into a universal cry against violence.",
    cityInfo: {
      otherWorks: ['Las Meninas', 'The Garden of Earthly Delights', 'The Third of May 1808'],
      museums: ['Reina Sofía', 'Museo del Prado', 'Thyssen-Bornemisza'],
      artFact: 'Madrid\'s "Golden Triangle of Art" — Prado, Reina Sofía, Thyssen — holds over 20,000 masterpieces within 1km.',
    },
  },
  {
    id: 6, lat: 55.7520, lng: 37.6175, city: 'Moscow', museum: 'Tretyakov Gallery',
    title: 'The Ninth Wave', artist: 'Ivan Aivazovsky', year: '1850',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hovhannes_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg/1280px-Hovhannes_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg&w=600&output=webp',
    desc: 'A Romantic masterpiece depicting survivors clinging to wreckage as dawn breaks over monstrous waves. Hope persists amid catastrophe.',
    cityInfo: {
      otherWorks: ['Morning in a Pine Forest', 'The Rooks Have Come Back', 'Black Square'],
      museums: ['Tretyakov Gallery', 'Pushkin Museum', 'Garage Museum'],
      artFact: 'Aivazovsky painted over 6,000 works — nearly all seascapes — making him one of the most prolific artists in history.',
    },
  },
];

// ─── Typing animation hook ───
function useTypingEffect(text, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(false); return; }
    setDisplayed(''); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { displayed, done };
}

function LoadingDots() {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(iv);
  }, []);
  return <span>{dots}</span>;
}

// ═══════════════════════════════════════
// THREE.JS GLOBE — stops on selection, city popup
// ═══════════════════════════════════════
function GlobeCanvas({ artData, onPointClick, selectedArt, showCityPopup }) {
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
        // When selected, gently dampen velocity
        rotVelY *= 0.92;
        if (Math.abs(rotVelY) > 0.0001) {
          globeMesh.rotation.y += rotVelY;
        }
      }

      // Highlight selected marker
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

// ═══════════════════════════════════════
// CITY INFO POPUP — shows on globe selection
// ═══════════════════════════════════════
function CityPopup({ art, onClose }) {
  if (!art?.cityInfo) return null;
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-80%, -60%)',
      zIndex: 18, width: 280,
      background: THEME.bgPanel,
      backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      border: `1px solid ${THEME.borderLight}`,
      borderRadius: 16, padding: '18px 20px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
      animation: 'popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          fontFamily: FONTS, fontSize: 18, fontWeight: 600, color: THEME.accentLight,
        }}>📍 {art.city}</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: FONTS_SANS, fontSize: 10, color: THEME.accent,
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontWeight: 600,
        }}>Museums</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {art.cityInfo.museums.map((m, i) => (
            <span key={i} style={{
              fontFamily: FONTS_SANS, fontSize: 11, color: THEME.textWarm,
              background: 'rgba(200,149,108,0.1)', border: `1px solid ${THEME.border}`,
              borderRadius: 6, padding: '3px 8px',
            }}>{m}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: FONTS_SANS, fontSize: 10, color: THEME.accent,
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontWeight: 600,
        }}>Other Masterpieces Here</div>
        {art.cityInfo.otherWorks.map((w, i) => (
          <div key={i} style={{
            fontFamily: FONTS, fontSize: 13, color: THEME.textMain,
            padding: '3px 0', fontStyle: 'italic', opacity: 0.85,
          }}>• {w}</div>
        ))}
      </div>

      <div style={{
        fontFamily: FONTS_SANS, fontSize: 11.5, color: THEME.textSec,
        lineHeight: 1.6, fontStyle: 'italic',
        borderTop: `1px solid ${THEME.border}`, paddingTop: 10,
      }}>{art.cityInfo.artFact}</div>
    </div>
  );
}

// ═══════════════════════════════════════
// SIDE PANEL — Optimized
// ═══════════════════════════════════════
function ArtPanel({ art, onClose, aiWhisper, isFetching, onAsk, userQ, setUserQ }) {
  const { displayed, done } = useTypingEffect(aiWhisper, 18);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { setImgLoaded(false); }, [art?.id]);

  if (!art) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: '440px', maxWidth: '100vw', height: '100%',
      background: THEME.bgPanel,
      backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      borderLeft: `1px solid ${THEME.border}`,
      zIndex: 20, display: 'flex', flexDirection: 'column',
      boxShadow: '-20px 0 80px rgba(0,0,0,0.7)',
      animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      overflowY: 'auto', overflowX: 'hidden',
    }}>
      <button onClick={onClose} style={{
        position: 'sticky', top: 12, marginLeft: 'auto', marginRight: 12,
        background: 'rgba(28,24,18,0.8)', border: `1px solid ${THEME.borderLight}`,
        borderRadius: '50%', width: 36, height: 36,
        color: THEME.accentLight, fontSize: 16, cursor: 'pointer', zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.25s', flexShrink: 0,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = THEME.accentDim; e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(28,24,18,0.8)'; e.currentTarget.style.transform = 'scale(1)'; }}
      >✕</button>

      {/* Art Image — slightly tighter */}
      <div style={{
        position: 'relative', marginTop: -36, flexShrink: 0,
        background: '#0F0D08',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '38vh', maxHeight: '44vh', overflow: 'hidden',
        borderBottom: `1px solid ${THEME.border}`,
      }}>
        <img
          src={art.img} alt={art.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            maxWidth: '94%', maxHeight: '42vh', objectFit: 'contain',
            padding: 12, opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
            filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)' }} />
      </div>

      {/* Info — tighter padding */}
      <div style={{ padding: '18px 24px 24px', flexShrink: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: THEME.accentDim, border: `1px solid ${THEME.border}`,
          borderRadius: 16, padding: '4px 12px', fontSize: 10.5,
          color: THEME.accentLight, letterSpacing: '0.5px', marginBottom: 12,
          fontFamily: FONTS_SANS, textTransform: 'uppercase', fontWeight: 500,
        }}>
          <span style={{ fontSize: 12 }}>📍</span> {art.city} · {art.museum}
        </div>

        <h2 style={{
          fontFamily: FONTS, fontSize: 28, margin: '0 0 4px',
          fontWeight: 600, lineHeight: 1.15, color: THEME.textMain,
        }}>{art.title}</h2>
        <p style={{
          fontFamily: FONTS_SANS, color: THEME.accent, fontSize: 13,
          margin: '0 0 14px', fontWeight: 500,
        }}>
          {art.artist}<span style={{ opacity: 0.5, fontWeight: 400 }}> · {art.year}</span>
        </p>

        <div style={{
          width: 48, height: 2, marginBottom: 12,
          background: `linear-gradient(90deg, ${THEME.accentGold}, transparent)`,
        }} />

        <p style={{
          fontFamily: FONTS_SANS, color: THEME.textSec, fontSize: 12.5,
          lineHeight: 1.7, margin: '0 0 18px',
        }}>{art.desc}</p>

        {/* AI Whisper */}
        <div style={{
          background: 'rgba(200, 149, 108, 0.06)',
          border: `1px solid ${THEME.border}`,
          borderRadius: 12, padding: 18, marginBottom: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 50, height: 50,
            background: 'linear-gradient(135deg, rgba(200,149,108,0.08), transparent)',
            borderRadius: '0 12px 0 0',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isFetching ? `radial-gradient(${THEME.accentGold}, ${THEME.accent})` : (aiWhisper ? '#7BAF5E' : THEME.accent),
              animation: isFetching ? 'pulse 1s infinite' : 'none',
              boxShadow: isFetching ? `0 0 10px ${THEME.accent}` : 'none',
            }} />
            <span style={{
              fontFamily: FONTS_SANS, fontSize: 10, color: THEME.accentLight,
              textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600,
            }}>
              {isFetching ? 'Channeling the artist...' : "Artist's Whisper"}
            </span>
          </div>
          <div style={{
            fontFamily: FONTS, fontSize: 15, lineHeight: 1.7,
            fontStyle: 'italic', color: THEME.textWarm, minHeight: 40,
          }}>
            {isFetching ? (
              <span style={{ color: THEME.textSec }}>Reaching across centuries<LoadingDots /></span>
            ) : (
              displayed
                ? <span>&ldquo;{displayed}{done ? '\u201D' : ''}</span>
                : <span style={{ color: THEME.textSec, fontStyle: 'normal', fontSize: 12.5 }}>Ask the artist a question below...</span>
            )}
          </div>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={userQ} onChange={e => setUserQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isFetching && userQ.trim() && onAsk()}
            placeholder={`Ask ${art.artist.split(' ').pop()} something...`}
            style={{
              flex: 1, padding: '10px 14px',
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}`,
              borderRadius: 10, color: THEME.textMain,
              fontFamily: FONTS_SANS, fontSize: 13, outline: 'none', transition: 'border 0.25s',
            }}
            onFocus={e => e.target.style.borderColor = THEME.accent}
            onBlur={e => e.target.style.borderColor = THEME.border}
          />
          <button onClick={onAsk} disabled={isFetching || !userQ.trim()} style={{
            padding: '10px 18px',
            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentGold})`,
            border: 'none', borderRadius: 10, color: '#1A1510',
            fontFamily: FONTS_SANS, fontSize: 12.5, fontWeight: 700,
            cursor: isFetching ? 'wait' : 'pointer', transition: 'all 0.25s',
            opacity: (!userQ.trim() || isFetching) ? 0.4 : 1, whiteSpace: 'nowrap',
            boxShadow: (!userQ.trim() || isFetching) ? 'none' : '0 4px 16px rgba(200,149,108,0.3)',
          }}>Ask</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// BOTTOM GALLERY — Tighter margins
// ═══════════════════════════════════════
function ArtGallery({ artData, onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15,
      background: 'linear-gradient(transparent, rgba(20,17,12,0.85) 30%, rgba(20,17,12,0.96))',
      padding: '28px 0 12px',
    }}>
      <div style={{
        display: 'flex', gap: 10, padding: '0 16px',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        justifyContent: 'center',
      }}>
        {artData.map(art => {
          const isSelected = selectedId === art.id;
          const isHover = hovered === art.id;
          return (
            <button key={art.id} onClick={() => onSelect(art)}
              onMouseEnter={() => setHovered(art.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flexShrink: 0, width: 144, padding: 0,
                background: isSelected ? THEME.bgCard : 'rgba(30, 26, 20, 0.7)',
                border: isSelected ? `2px solid ${THEME.accent}` : `1px solid ${isHover ? THEME.borderLight : THEME.border}`,
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                transform: isSelected ? 'translateY(-6px) scale(1.03)' : (isHover ? 'translateY(-3px)' : 'translateY(0)'),
                boxShadow: isSelected
                  ? `0 6px 24px rgba(200,149,108,0.3), inset 0 0 0 1px ${THEME.accentDim}`
                  : (isHover ? '0 4px 16px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)'),
                opacity: selectedId && !isSelected ? 0.55 : 1, textAlign: 'left',
              }}
            >
              <div style={{
                width: '100%', height: 84, overflow: 'hidden',
                borderBottom: `1px solid ${THEME.border}`, position: 'relative',
              }}>
                <img src={art.img} alt={art.title} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.4s', transform: isHover ? 'scale(1.08)' : 'scale(1)',
                }} />
                {isSelected && <div style={{
                  position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%',
                  background: THEME.accentGold, boxShadow: `0 0 8px ${THEME.accentGold}`,
                }} />}
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{
                  fontFamily: FONTS, fontSize: 12.5, fontWeight: 600,
                  color: isSelected ? THEME.textMain : THEME.textWarm,
                  lineHeight: 1.25, marginBottom: 3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{art.title}</div>
                <div style={{
                  fontFamily: FONTS_SANS, fontSize: 10, color: THEME.textSec,
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{art.artist} · {art.city}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [aiWhisper, setAiWhisper] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [userQ, setUserQ] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showCityPopup, setShowCityPopup] = useState(false);

  // ─── Detect user's language from their input ───
  const detectLang = useCallback((text) => {
    // Simple heuristic: if mostly CJK chars → Chinese, else match input language
    const cjk = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
    if (cjk && cjk.length > text.length * 0.15) return 'zh';
    // Check for common patterns
    if (/^[a-zA-Z\s.,!?'"()-]+$/.test(text.trim())) return 'en';
    return 'auto'; // let the AI figure it out
  }, []);

  // ─── API call with language-aware prompting ───
  const askArtist = useCallback(async (art, question, isGreeting = false) => {
    if (!question.trim()) return;
    setIsFetching(true);
    setAiWhisper('');

    const newHistory = [...conversationHistory, { role: 'user', content: question }];

    try {
      const response = await fetch('/api/whisper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paintingTitle: art.title,
          artistName: art.artist,
          userQuestion: question,
          isGreeting: isGreeting,
          // Tell backend to keep response short for greetings
          maxLength: isGreeting ? 'short' : 'normal',
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const reply = data.whisper || '...';
      setAiWhisper(reply);
      setConversationHistory([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('API Error:', err);
      // Fallback: use Anthropic API directly
      try {
        const lang = detectLang(question);
        const langInstruction = lang === 'en'
          ? 'Respond entirely in English.'
          : lang === 'zh'
          ? '请完全用中文回答。'
          : 'Respond in the same language the user used.';

        const sysPrompt = isGreeting
          ? `You are ${art.artist}, speaking from across time about your work "${art.title}". Give a SHORT bilingual greeting (2-3 sentences total, one line Chinese, one line English). Be poetic but concise. Do NOT write a long monologue.`
          : `You are ${art.artist}, speaking from across time about your work "${art.title}". ${langInstruction} Keep responses concise (2-4 sentences). Be poetic, personal, and insightful.`;

        const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: isGreeting ? 150 : 300,
            system: sysPrompt,
            messages: [{ role: 'user', content: question }],
          }),
        });
        const apiData = await apiRes.json();
        const reply = apiData.content?.map(c => c.text || '').join('') || '...';
        setAiWhisper(reply);
        setConversationHistory([...newHistory, { role: 'assistant', content: reply }]);
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setAiWhisper('The signal across time is faint… please try again.\n时空信号微弱…请再试一次。');
      }
    } finally {
      setIsFetching(false);
    }
  }, [conversationHistory, detectLang]);

  const handleSelect = useCallback((art) => {
    setSelectedArt(art);
    setAiWhisper('');
    setUserQ('');
    setConversationHistory([]);
    setShowCityPopup(true);

    // Shorter bilingual greeting prompt
    const greeting = `Greet me briefly as ${art.artist}. One sentence in Chinese, one in English. Mention "${art.title}" and your feeling when creating it. Keep it under 40 words total.`;
    setTimeout(() => askArtist(art, greeting, true), 400);

    // Hide city popup after a while
    setTimeout(() => setShowCityPopup(false), 8000);
  }, [askArtist]);

  const handleAsk = useCallback(() => {
    if (!selectedArt || !userQ.trim()) return;
    askArtist(selectedArt, userQ, false);
    setUserQ('');
  }, [selectedArt, userQ, askArtist]);

  const handleClose = useCallback(() => {
    setSelectedArt(null);
    setAiWhisper('');
    setConversationHistory([]);
    setShowCityPopup(false);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      background: THEME.bg, overflow: 'hidden',
      color: THEME.textMain, fontFamily: FONTS_SANS,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes popIn { from { opacity: 0; transform: translate(-80%, -60%) scale(0.85); } to { opacity: 1; transform: translate(-80%, -60%) scale(1); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,149,108,0.25); border-radius: 4px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        div::-webkit-scrollbar { height: 0; width: 0; }
      `}</style>

      {/* Museum ambient bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(200,149,108,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, rgba(160,120,80,0.07) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 100%, rgba(80,60,40,0.12) 0%, transparent 50%),
          linear-gradient(170deg, #1A1510 0%, #0F0D08 40%, #161210 100%)
        `,
      }} />

      {/* Texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8956C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Globe */}
      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        <GlobeCanvas artData={ART_DATA} onPointClick={handleSelect} selectedArt={selectedArt} showCityPopup={showCityPopup} />
      </div>

      {/* City Info Popup on Globe */}
      {selectedArt && showCityPopup && (
        <CityPopup art={selectedArt} onClose={() => setShowCityPopup(false)} />
      )}

      {/* Header */}
      <div style={{
        position: 'absolute', top: 20, left: 24, pointerEvents: 'none', zIndex: 10,
        animation: 'fadeUp 1s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentGold})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 16px rgba(200,149,108,0.3)',
          }}>🎨</div>
          <div>
            <h1 style={{
              fontFamily: FONTS, fontSize: 30, margin: 0, fontWeight: 600,
              letterSpacing: '0.5px', color: THEME.textMain,
            }}>Art Globe</h1>
            <p style={{
              fontFamily: FONTS_SANS, fontSize: 10, margin: '1px 0 0',
              color: THEME.textSec, letterSpacing: '2px', textTransform: 'uppercase',
            }}>Converse with masters across time</p>
          </div>
        </div>
      </div>

      {/* Hint */}
      {!selectedArt && (
        <div style={{
          position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 10, pointerEvents: 'none', textAlign: 'center',
          animation: 'fadeUp 1.5s ease 0.5s both',
        }}>
          <div style={{
            fontFamily: FONTS, fontSize: 18, color: THEME.accentLight,
            opacity: 0.5, animation: 'float 3s ease-in-out infinite',
          }}>Click a golden point on the globe</div>
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 10, color: THEME.textSec,
            marginTop: 5, letterSpacing: '1px', textTransform: 'uppercase',
          }}>or select a masterpiece below</div>
        </div>
      )}

      <ArtPanel art={selectedArt} onClose={handleClose} aiWhisper={aiWhisper}
        isFetching={isFetching} onAsk={handleAsk} userQ={userQ} setUserQ={setUserQ} />

      <ArtGallery artData={ART_DATA} onSelect={handleSelect} selectedId={selectedArt?.id} />
    </div>
  );
}
