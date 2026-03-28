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

export const ART_DATA = [
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
  {
    id: 7, 
    lat: 39.9042, 
    lng: 116.4074, 
    city:  'Beijing', 
    museum: 'Beijing Fine Art Academy',
    title: 'Shrimp', 
    artist: 'Qi Baishi', 
    year: '1920s-1950s',
    img: 'https://uploads5.wikiart.org/images/qi-baishi/shrimp.jpg!Large.jpg',
    desc: 'Qi Baishi\'s iconic shrimp paintings capture life and movement with minimal brushstrokes. His mastery of ink wash technique transforms simple subjects into profound meditations on nature.',
    color: '#8B7D6B',
    cityInfo: {
      otherWorks: ['Twelve Landscape Screens', 'Peaches', 'Crabs', 'Album Leaves'],
      museums: ['Beijing Fine Art Academy', 'Hunan Provincial Museum', 'National Art Museum of China'],
      artFact: 'Qi Baishi painted shrimp for over 40 years, perfecting his technique. The Beijing Fine Art Academy holds over 2,000 of his works, including many signature flower-and-bird paintings.',
    },
    },
];