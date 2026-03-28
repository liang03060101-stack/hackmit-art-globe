

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'globe.gl';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
  accent: '#a6a0c7ff', 
  bg: 'rgba(15, 15, 20, 0.85)', 
  border: 'rgba(255, 255, 255, 0.1)',
  textMain: '#ffffff',
  textSec: 'rgba(255, 255, 255, 0.7)',
};

export default function App() {
  const containerRef = useRef(null);
  const globeInstanceRef = useRef(null);
  const [selectedArt, setSelectedArt] = useState(null);

  const artData = useMemo(() => [
    { 
      id: 1, lat: 48.8566, lng: 2.3522, city: 'Paris', title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: '1503', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg&w=600&output=webp', 
      desc: '现藏于卢浮宫，被认为是意大利文艺复兴时期的杰作，被视为世上最有名、访问量最大且最常被模仿的艺术作品。该画中描绘了一位表情内敛的、微带笑容的女士，她的笑容有时被称作是“神秘的微笑”。' 
    },
    { 
      id: 2, lat: 40.7614, lng: -73.9776, city: 'New York', title: 'The Starry Night', artist: 'Vincent van Gogh', year: '1889', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg&w=600&output=webp', 
      desc: '现藏于纽约MoMA，是荷兰后印象派画家文森特·梵高一幅著名油画，展现了梵高在精神病院期间看到的充满表现力的旋转星空。' 
    },
    { 
      id: 3, lat: 35.7150, lng: 139.7734, city: 'Tokyo', title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: '1831', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg&w=600&output=webp', 
      desc: '浮世绘最著名的代表作,也是举世闻名的日本艺术作品。作品描绘了在神奈川海面上，三艘押送船的快速运输船在惊涛骇浪中艰难前行的情景。像爪子一样即将拍下，而远处的富士山则在波涛中静谧耸立，形成强烈对比。' 
    },
    { 
      id: 4, lat: 52.0804, lng: 4.3143, city: 'The Hague', title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: '1665', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg&w=600&output=webp', 
      desc: '被称为“北方的蒙娜丽莎”，十七世纪荷兰画家扬·维米尔的作品。画作以少女戴着的珍珠耳环作为视角的焦点，现时画作存放在海牙的毛里茨住宅中。高光是艺术史上的神来之笔。' 
    },
    { 
      id: 5, lat: 40.4083, lng: -3.6946, city: 'Madrid', title: 'Guernica', artist: 'Pablo Picasso', year: '1937', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg&w=600&output=webp', 
      desc: '立体主义巨作，当时正值西班牙内战。德国空军及意大利皇家空军在内战时期的1937年对格尔尼卡城进行了人类历史上第一次地毯式轰炸。毕加索受委托为巴黎世界博览会的西班牙区绘制一幅装饰性的画。作品描绘了经受炸弹蹂躏之后的格尔尼卡城。' 
    },
    { 
      id: 6, lat: -23.5615, lng: -46.6559, city: 'São Paulo', title: 'Abaporu', artist: 'Tarsila do Amaral', year: '1928', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/e/ec/Abaporu.jpg&w=600&output=webp', 
      desc: '巴西现代主义运动的标志性作品，展现了浓郁的南美本土色彩。' 
    },
    { 
      id: 7, lat: 19.4326, lng: -99.1332, city: 'Mexico City', title: 'The Two Fridas', artist: 'Frida Kahlo', year: '1939', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/1/1e/Frida_Kahlo_%281939%29_-_The_Two_Fridas.jpg&w=600&output=webp', 
      desc: '弗里达的双重自画像，探索了她的双重血统和内心的痛苦。' 
    },
    { 
      id: 8, lat: 41.8796, lng: -87.6237, city: 'Chicago', title: 'American Gothic', artist: 'Grant Wood', year: '1930', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/800px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg&w=600&output=webp', 
      desc: '20世纪美国艺术中最具标志性的图像之一，展现了中西部农民的坚韧。' 
    },
    { 
      id: 9, lat: 59.9075, lng: 10.7531, city: 'Oslo', title: 'The Scream', artist: 'Edvard Munch', year: '1893', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg&w=600&output=webp', 
      desc: '表现主义代表作，那张扭曲的脸庞成为了现代人存在性焦虑的象征。' 
    },
    { 
      id: 10, lat: -33.8688, lng: 151.2093, city: 'Sydney', title: 'Aboriginal Rock Art', artist: 'Unknown', year: 'c. 20000 BC', 
      img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Wandjina_rock_art.jpg/800px-Wandjina_rock_art.jpg&w=600&output=webp', 
      desc: '代表大洋洲的远古人类遗迹，记录了原住民与土地长达数万年的精神联系。' 
    }
  ], []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const world = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg') 
      .backgroundColor('rgba(0, 0, 0, 0)')
      .showAtmosphere(true)
      .atmosphereColor('#e4e0d4') 
      .atmosphereAltitude(0.15)
      
      // 💡 核心修改：全部换成最基础的 Points API，绝不报错
      .pointsData(artData)
      .pointColor(() => THEME.accent)
      .pointAltitude(0.05)
      .pointRadius(0.6)
      
      // Points 的点击事件是全版本兼容的
      .onPointClick((point) => {
        world.pointOfView({ lat: point.lat, lng: point.lng - 15, altitude: 1.2 }, 1200);
        setSelectedArt(point);
      });

    world.pointOfView({ altitude: 2.5 }, 0);
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.5;

    globeInstanceRef.current = world;

    return () => {
      world._destructor();
    };
  }, [artData]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background:"url('hackmit-art-globe/src/assets/bgimg.jpg')", overflow: 'hidden', color: THEME.textMain, fontFamily: 'sans-serif' }}>
      
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <div style={{ position: 'absolute', top: '20px', left: '30px', pointerEvents: 'none', zIndex: 10 }}>
        <h1 style={{ fontSize: '26px', margin: 0, fontWeight: '800', letterSpacing: '2px', textShadow: '0 0 15px #00ffcc' }}>
          ART GLOBE 48H
        </h1>
        <p style={{ opacity: 0.6, fontSize: '12px', margin: '4px 0 0 0' }}>Click glowing points to explore</p>
      </div>

      <AnimatePresence>
        {selectedArt && (
          <motion.div
            key="details-panel"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            style={{
              position: 'absolute', top: 0, left: 0, 
              width: '400px', height: '100%', 
              background: THEME.bg, backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
              borderRight: `1px solid ${THEME.border}`, zIndex: 20,
              display: 'flex', flexDirection: 'column', overflowY: 'auto'
            }}
          >
            <button 
              onClick={() => {
                setSelectedArt(null);
                if (globeInstanceRef.current) {
                   globeInstanceRef.current.pointOfView({ altitude: 2.5 }, 1000);
                }
              }} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '20px', cursor: 'pointer', zIndex: 21, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>

            <img src={selectedArt.img} alt={selectedArt.title} style={{ width: '100%', height: '35vh', objectFit: 'cover' }} />

            <div style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>{selectedArt.title}</h2>
              <div style={{ color: THEME.accent, fontSize: '15px', marginBottom: '24px' }}>
                <strong>{selectedArt.artist}</strong> • {selectedArt.year}
              </div>
              
              <div style={{ width: '50px', height: '2px', background: THEME.accent, marginBottom: '24px' }} />

              <p style={{ color: THEME.textSec, lineHeight: 1.7, fontSize: '16px', margin: 0 }}>
                {selectedArt.desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
