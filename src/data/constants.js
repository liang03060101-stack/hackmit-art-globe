export const THEME = {
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

export const FONTS = `'Cormorant Garamond', 'Playfair Display', Georgia, serif`;
export const FONTS_SANS = `'DM Sans', 'Helvetica Neue', sans-serif`;

// All images are served from /public/images/ (localhost, no network needed).
// Run `node scripts/download-images.js` once (with VPN on) to download them.
// src/data/constants.js

// src/data/constants.js

export const ART_DATA = [
  {
    id: 1, lat: 48.8566, lng: 2.3522, city: 'Paris', title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: '1503',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg&w=600&output=webp',
    desc: '现藏于卢浮宫，文艺复兴时期的绝世名作，以其“神秘的微笑”闻名于世。 / Housed in the Louvre, this Renaissance masterpiece is world-renowned for its "enigmatic smile."'
  },
  {
    id: 2, lat: 40.7614, lng: -73.9776, city: 'New York', title: 'The Starry Night', artist: 'Vincent van Gogh', year: '1889',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg&w=600&output=webp',
    desc: '现藏于纽约MoMA，这幅后印象派巨作展现了梵高眼中充满生命力与情感的旋转星空。 / Housed in MoMA, this Post-Impressionist masterpiece captures Van Gogh\'s expressive, swirling night sky.'
  },
  {
    id: 3, lat: 35.7150, lng: 139.7734, city: 'Tokyo', title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: '1831',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg&w=600&output=webp',
    desc: '日本浮世绘的巅峰之作，巨大的海浪与远处静谧的富士山形成强烈对比。 / The pinnacle of Japanese Ukiyo-e, contrasting a towering, dramatic wave with the serene Mount Fuji in the distance.'
  },
  {
    id: 4, lat: 52.0804, lng: 4.3143, city: 'The Hague', title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: '1665',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg&w=600&output=webp',
    desc: '被誉为“北方的蒙娜丽莎”，画中少女回眸的瞬间与珍珠的光泽成为艺术史上的神来之笔。 / Known as the "Mona Lisa of the North," Vermeer\'s mastery of light immortalizes the girl\'s gaze and the glowing pearl.'
  },
  {
    id: 5, lat: 40.4083, lng: -3.6946, city: 'Madrid', title: 'Guernica', artist: 'Pablo Picasso', year: '1937',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg&w=600&output=webp',
    desc: '毕加索的立体主义巨作，是对西班牙内战中大轰炸的愤怒控诉，极具视觉冲击力。 / Picasso\'s Cubist masterpiece, serving as a powerful and visceral anti-war statement against the bombing of Guernica.'
  },
  {
    id: 6, lat: -23.5615, lng: -46.6559, city: 'São Paulo', title: 'Abaporu', artist: 'Tarsila do Amaral', year: '1928',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/e/ec/Abaporu.jpg&w=600&output=webp',
    desc: '巴西现代主义运动的标志性作品，以夸张的比例展现了浓郁的南美本土色彩。 / An iconic work of the Brazilian Modernist movement, featuring exaggerated proportions and vibrant South American colors.'
  },
  {
    id: 7, lat: 19.4326, lng: -99.1332, city: 'Mexico City', title: 'The Two Fridas', artist: 'Frida Kahlo', year: '1939',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/1/1e/Frida_Kahlo_%281939%29_-_The_Two_Fridas.jpg&w=600&output=webp',
    desc: '弗里达的双重自画像，深刻地探索了她的多重血统与内心的情感挣扎。 / Kahlo\'s double self-portrait, profoundly exploring her dual heritage and inner emotional pain.'
  },
  {
    id: 8, lat: 41.8796, lng: -87.6237, city: 'Chicago', title: 'American Gothic', artist: 'Grant Wood', year: '1930',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/800px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg&w=600&output=webp',
    desc: '20世纪美国艺术的标志性图像，生动展现了中西部农民的坚韧与冷峻。 / One of the most iconic images in 20th-century American art, depicting the resilience and stoicism of Midwestern farmers.'
  },
  {
    id: 9, lat: 59.9075, lng: 10.7531, city: 'Oslo', title: 'The Scream', artist: 'Edvard Munch', year: '1893',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg&w=600&output=webp',
    desc: '表现主义代表作，画中扭曲的脸庞已成为现代人类存在性焦虑的终极象征。 / An Expressionist masterpiece, where the distorted face has become the ultimate symbol of modern existential anxiety.'
  },
  {
    id: 7, lat: 39.9042, lng: 116.4074, city:  'Beijing', 
    museum: 'Beijing Fine Art Academy',title: 'Shrimp', artist: 'Qi Baishi', year: '1920s-1950s',
    img: 'https://uploads5.wikiart.org/images/qi-baishi/shrimp.jpg!Large.jpg',
    desc: 'Qi Baishi\'s iconic shrimp paintings capture life and movement with minimal brushstrokes. His mastery of ink wash technique transforms simple subjects into profound meditations on nature.',
    },
];