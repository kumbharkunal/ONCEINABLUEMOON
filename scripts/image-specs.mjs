// Single source of truth for every generated image:
// - the ChatGPT prompts (docs/IMAGE_PROMPTS.md + image-prompts.html are generated from this file)
// - the crop targets and focal points used by `npm run images`
//
// Focal points are [x, y] in 0–1 of the source image; crops are centred on them and clamped to the edges.

const GRADE_PEOPLE =
  'Colour grade (keep exactly): warm, soft analog-film look in the style of Kodak Portra 400; creamy highlights that never clip to pure white; gently lifted, warm-brown shadows that never go pure black; low contrast and airy; natural, gentle saturation; true-to-life Indian skin tones (warm golden-brown, natural texture, never orange, grey or plastic); foliage muted toward olive green; silk magentas, emerald greens and marigold yellows rich but never neon; a faint cool moonlight-blue only in the deepest shadows; fine, even film grain across the whole frame.';

const STYLE_PEOPLE =
  'Style: photorealistic editorial wedding photography, candid and documentary, as if shot on location by a top Indian wedding photographer. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Natural, anatomically correct hands with five fingers each; natural faces with real skin texture; no distorted jewellery. Deliver as a PNG file.';

function sizeLine(w, h, rw, rh, orientation, keep = 'all important content') {
  return `Create a photograph. Format: PNG. Size: exactly ${w} × ${h} pixels (${rw}:${rh} ${orientation}). If that exact size isn't available, generate the closest available ${orientation} size and keep ${keep} inside the central ${rw}:${rh} area with generous safe margins on every side, because the image will be cropped.`;
}

/** @typedef {{ id: string, code: string, title: string, usedIn: string, ratio: [number, number], size: [number, number], focal: [number, number], prompt: string }} ImageSpec */

/** @type {ImageSpec[]} */
export const images = [
  {
    id: 'hero-desktop',
    code: 'IMG-01',
    title: 'Hero, desktop',
    usedIn: 'Hero moon aperture on desktop; expands to full screen on scroll; WhatsApp / social preview crop',
    ratio: [16, 9],
    size: [1920, 1080],
    focal: [0.5, 0.45],
    prompt: [
      "Create a photograph. Format: PNG. Size: exactly 1920 × 1080 pixels (16:9 landscape). If that exact size isn't available, generate the closest available landscape size and keep the couple inside the central 16:9 area with generous safe margins on every side, because the image will be cropped, sometimes to a centred circle.",
      'Subject: a Maharashtrian bride and groom sharing a quiet, candid moment just after their wedding ceremony. The bride (Indian, late twenties) wears a deep green Paithani silk nauvari saree with a magenta-and-gold zari border, a pearl mundavalya tied across her forehead, a small crescent-moon chandrakor bindi, a pearl nath, and stacks of green glass chuda bangles on mehendi-covered hands. The groom (Indian, early thirties) wears an ivory silk kurta, a saffron pheta turban and a matching pearl mundavalya. She laughs softly with her eyes half closed; he leans in until their foreheads almost touch.',
      'Setting: an open terrace above vineyard rows outside Nashik at dusk, the soft blue silhouette of the Sahyadri hills far behind, a few warm string lights glowing out of focus. No other people.',
      'Composition: the couple sits in the middle third of the frame, framed from the waist up at eye level, so the picture still works when cropped to a centred circle; quiet, softly blurred background on both sides.',
      'Camera: full-frame camera, 85mm lens at f/1.8, shallow depth of field, creamy bokeh.\nLight: the last warm light of dusk from the left, a gentle rim light on hair and silk, soft open shadows; the sky over the hills fading from peach to pale blue.',
      GRADE_PEOPLE,
      STYLE_PEOPLE,
    ].join('\n\n'),
  },
  {
    id: 'hero-mobile',
    code: 'IMG-02',
    title: 'Hero, mobile',
    usedIn: 'Hero on phones (portrait, full screen, text sits on the calm bottom third)',
    ratio: [9, 16],
    size: [1080, 1920],
    focal: [0.5, 0.38],
    prompt: [
      sizeLine(1080, 1920, 9, 16, 'portrait', 'the couple'),
      'Subject: a Maharashtrian bride and groom walking hand in hand between grapevine rows at dusk, seen from slightly behind and to the side. The bride (Indian, late twenties) wears a deep green Paithani silk nauvari saree with a magenta-and-gold zari border, a pearl mundavalya and green glass chuda bangles; she glances back over her shoulder with a soft smile and her silk pallu catches the light. The groom (Indian, early thirties) wears an ivory silk kurta and a saffron pheta turban.',
      'Setting: a vineyard outside Nashik, rows leading toward the soft Sahyadri hills, warm haze in the sky. No other people.',
      'Composition: vertical frame; the couple sits between 25% and 60% of the image height, small enough to show the rows around them; the bottom third is calm, softly out-of-focus vine leaves and earth with no important detail, because text will sit there; open warm sky at the top.',
      'Camera: full-frame camera, 50mm lens at f/2, natural perspective, shallow depth of field.\nLight: low dusk sun behind the couple, glowing rim light on hair and silk, soft lifted shadows.',
      GRADE_PEOPLE,
      STYLE_PEOPLE,
    ].join('\n\n'),
  },
  {
    id: 'story-haldi',
    code: 'IMG-03',
    title: 'Story: Haldi',
    usedIn: 'Stories chapter "Haldi"; Services "Candid photography"; Instagram tile',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.55, 0.42],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      "Subject: a Maharashtrian haldi ceremony on the wedding morning. The bride (Indian, late twenties) wears a simple yellow cotton saree and a white jasmine gajra in her hair; she laughs with her eyes closed as relatives' hands (only hands and forearms with glass bangles are visible) smear bright turmeric paste on her cheeks and arms. Marigold garlands, brass bowls of haldi paste, mango-leaf toran.",
      'Setting: the open courtyard of an old Nashik wada with carved wooden pillars and a whitewashed wall.',
      "Composition: the bride's upper body slightly right of centre, hands reaching in from the left and right edges; the top 15% of the frame calm (wall and leaves).",
      "Camera: full-frame camera, 35mm lens at f/2, a hint of motion blur on the moving hands, the bride's face sharp.\nLight: soft morning sunlight from the top left, warm bounce from the yellow saree, open shadows.",
      GRADE_PEOPLE,
      STYLE_PEOPLE,
    ].join('\n\n'),
  },
  {
    id: 'story-mehendi',
    code: 'IMG-04',
    title: 'Story: Mehendi',
    usedIn: 'Stories chapter "Mehendi"; Instagram tile',
    ratio: [3, 2],
    size: [1800, 1200],
    focal: [0.45, 0.5],
    prompt: [
      sizeLine(1800, 1200, 3, 2, 'landscape'),
      "Subject: close-up of a bride's hands during her mehendi afternoon. Her palms rest on a silk cushion while a mehendi artist's hands (only the hands are visible, holding a henna cone) draw fine patterns on her palm; her fingers already carry intricate fresh henna, she wears green glass chuda bangles and one slim gold ring; the edge of a magenta silk saree falls into the frame. No faces in the frame.",
      'Setting: a quiet room at home, a low wooden table, a brass bowl of jasmine flowers softly out of focus.',
      'Composition: the hands sit centre-left, filling about half of the frame, with calm, softly blurred space on the right.',
      'Camera: full-frame camera, 100mm macro lens at f/2.8, very shallow depth of field.\nLight: soft afternoon window light from the right, gentle shadows that show the texture of the henna.',
      GRADE_PEOPLE,
      'Style: photorealistic editorial wedding photography, candid and documentary, as if shot on location by a top Indian wedding photographer. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Natural, anatomically correct hands with five fingers each; real skin texture; no distorted jewellery. Deliver as a PNG file.',
    ].join('\n\n'),
  },
  {
    id: 'story-sangeet',
    code: 'IMG-05',
    title: 'Story: Sangeet',
    usedIn: 'Stories chapter "Sangeet"; Instagram tile',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.5, 0.42],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      'Subject: an Indian couple dancing together at their sangeet night, in the middle of a loose circle of family who clap and cheer (softly out of focus). The bride (Indian, late twenties) wears a deep teal lehenga with gold mirror work, mid-twirl so the skirt flares; the groom (Indian, early thirties) wears a cream bandhgala and laughs as he spins her. Pure joy, unposed.',
      'Setting: a courtyard at night strung with warm fairy lights and marigold strands.',
      'Composition: the couple centred in the upper two thirds of the frame, full upper bodies visible, glowing bokeh around them.',
      'Camera: full-frame camera, 35mm lens at f/1.4, natural high-ISO grain, slight motion blur on the skirt and hands while faces stay sharp.\nLight: warm tungsten fairy lights, soft glow on faces, deep but open shadows.',
      GRADE_PEOPLE,
      STYLE_PEOPLE,
    ].join('\n\n'),
  },
  {
    id: 'story-lagna',
    code: 'IMG-06',
    title: 'Story: Lagna (antarpat)',
    usedIn: 'Stories chapter "Lagna"; Services "Traditional photo and video"; manifesto pill; Instagram tile',
    ratio: [3, 2],
    size: [1800, 1200],
    focal: [0.45, 0.35],
    prompt: [
      sizeLine(1800, 1200, 3, 2, 'landscape'),
      "Subject: the antarpat moment of a Marathi wedding. A plain maroon silk antarpat cloth with a simple gold border (no symbols or writing on it) is held up by two relatives, whose hands and arms are visible at the cloth's edges. Just above the top edge of the cloth, the bride's smiling eyes and forehead are visible, with a pearl mundavalya and a small crescent chandrakor bindi. Grains of rice (akshata) are caught mid-air, falling.",
      'Setting: a wedding mandap decorated with marigold garlands and mango leaves; guests softly out of focus in the background.',
      "Composition: the bride's eyes on the upper third, slightly left of centre; the cloth fills much of the lower half; keep the bride's face and the cloth edge inside the central area.",
      'Camera: full-frame camera, 50mm lens at f/2, fast shutter to freeze the rice.\nLight: soft, bright daylight under the mandap canopy, warm reflections from the marigolds.',
      GRADE_PEOPLE,
      STYLE_PEOPLE,
    ].join('\n\n'),
  },
  {
    id: 'story-reception',
    code: 'IMG-07',
    title: 'Story: Reception',
    usedIn: 'Stories chapter "Reception"; Instagram tile',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.5, 0.55],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      'Subject: a newly married Indian couple walking hand in hand at their evening reception, laughing and looking at each other. She (late twenties) wears a champagne-gold silk saree with a modern blouse and a single strand of jasmine in her hair; he (early thirties) wears a midnight-blue bandhgala.',
      'Setting: a garden path lined with glowing candle lanterns, leading toward a softly lit white pavilion; deep blue night sky.',
      'Composition: full-length couple in the centre, lower-middle of the frame; the top 20% is calm dark-blue night with soft bokeh.',
      'Camera: full-frame camera, 50mm lens at f/1.4, shallow depth of field.\nLight: warm lantern light from below and the sides, cool blue ambient night, glowing highlights on the silk.',
      GRADE_PEOPLE,
      STYLE_PEOPLE,
    ].join('\n\n'),
  },
  {
    id: 'story-prewedding',
    code: 'IMG-08',
    title: 'Story: Pre-wedding',
    usedIn: 'Stories chapter "Pre-wedding"; Services "Pre-wedding shoots"; Instagram tile',
    ratio: [3, 2],
    size: [1800, 1200],
    focal: [0.5, 0.55],
    prompt: [
      sizeLine(1800, 1200, 3, 2, 'landscape'),
      'Subject: an Indian couple on a pre-wedding shoot, walking between grapevine rows and holding hands; she leans into him laughing. She (late twenties) wears a flowing pale moon-blue chiffon saree; he (early thirties) wears a white linen shirt and beige trousers.',
      'Setting: a vineyard outside Nashik at golden hour, rows of vines as leading lines, the soft Sahyadri hills on the horizon.',
      'Composition: the couple sits in the central third of the frame (so it can also be cropped to a square and to 4:5), at about one third of the frame height; open landscape and sky around them.',
      'Camera: full-frame camera, 70mm lens at f/2.2.\nLight: low golden sun behind the couple, glowing backlight in her hair and the chiffon, soft lifted shadows.',
      GRADE_PEOPLE,
      STYLE_PEOPLE,
    ].join('\n\n'),
  },
  {
    id: 'svc-films',
    code: 'IMG-09',
    title: 'Services: Cinematic films',
    usedIn: 'Services row "Cinematic wedding films" (hover / accordion image)',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.5, 0.45],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      'Subject: behind the scenes at an Indian wedding. A wedding cinematographer is seen from behind and slightly to one side, so his face is not visible; he wears a plain black t-shirt and holds a compact cinema camera on a handheld gimbal, its small monitor glowing. Beyond him, softly out of focus, a bride and groom walk around a small sacred fire during the pheras, surrounded by marigold garlands. No visible brand names or logos on any equipment.',
      'Setting: an evening wedding mandap with warm practical lights.',
      "Composition: the cinematographer's shoulder, arms and camera fill the left and lower part of the frame; the glowing couple and the fire sit in the upper right.",
      'Camera: full-frame camera, 35mm lens at f/2.\nLight: warm firelight and practical lamps, rim light on the camera, deep but open shadows.',
      GRADE_PEOPLE,
      'Style: photorealistic editorial wedding photography, candid and documentary. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Natural, anatomically correct hands with five fingers each; no distorted equipment. Deliver as a PNG file.',
    ].join('\n\n'),
  },
  {
    id: 'svc-album',
    code: 'IMG-10',
    title: 'Services: Albums',
    usedIn: 'Services row "Albums"',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.5, 0.5],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      'Subject: a still life of a closed, handmade wedding album with a natural ivory linen cover and a small debossed crescent moon in the centre of the cover (no letters or text anywhere). It rests on a folded Paithani silk saree with a gold zari peacock border, next to a few marigold petals, one strand of jasmine and a pair of green glass bangles.',
      'Setting: a wooden table by a window.',
      'Composition: the album slightly below centre at a gentle angle, the silk border curving through the lower third, calm space above.',
      'Camera: full-frame camera, 50mm lens at f/4, seen from about 45 degrees above.\nLight: soft window light from the left, gentle shadows that show the linen texture and the weave of the silk.',
      'Colour grade (keep exactly): warm, soft analog-film look in the style of Kodak Portra 400; creamy highlights that never clip to pure white; gently lifted, warm-brown shadows that never go pure black; low contrast and airy; natural, gentle saturation; true-to-life colours; foliage muted toward olive green; silk magentas, emerald greens and marigold yellows rich but never neon; a faint cool moonlight-blue only in the deepest shadows; fine, even film grain across the whole frame.',
      'Style: photorealistic editorial still-life photography. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Deliver as a PNG file.',
    ].join('\n\n'),
  },
  {
    id: 'svc-destination',
    code: 'IMG-11',
    title: 'Services: Destination weddings',
    usedIn: 'Services row "Destination weddings"',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.5, 0.5],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      'Subject: an empty wedding mandap of white flowers and hanging marigold strands on the stone terrace of a heritage lakeside palace in Rajasthan, ready for an evening ceremony; warm lamps just beginning to glow; the palace arches reflected in calm water. No people.',
      'Composition: the mandap in the centre of the frame, the lake and reflections in the lower third, the palace and soft sky above.',
      'Camera: full-frame camera, 24mm lens at f/4, level horizon.\nLight: blue hour, the sky fading from apricot to soft blue, warm lamp light on stone.',
      'Colour grade (keep exactly): warm, soft analog-film look in the style of Kodak Portra 400; creamy highlights that never clip to pure white; gently lifted, warm-brown shadows that never go pure black; low contrast and airy; natural, gentle saturation; true-to-life colours; foliage muted toward olive green; magentas, emerald greens and marigold yellows rich but never neon; a faint cool moonlight-blue only in the deepest shadows; fine, even film grain across the whole frame.',
      'Style: photorealistic editorial travel and wedding photography. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Deliver as a PNG file.',
    ].join('\n\n'),
  },
  {
    id: 'about-hands',
    code: 'IMG-12',
    title: 'About: hands with camera',
    usedIn: 'About the director (detail image, no face)',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.5, 0.5],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      "Subject: close-up of a filmmaker's hands (Indian man) holding a compact cinema camera rig, his thumb turning the lens focus ring. No face in the frame. No visible brand names or logos on the camera or lens.",
      'Setting: behind him, softly out of focus, a wedding venue with marigold strands and warm string lights.',
      'Composition: the hands and camera fill the centre and lower half of the frame, the glowing background above.',
      'Camera: full-frame camera, 85mm lens at f/2, very shallow depth of field.\nLight: warm practical light from the venue behind, soft fill on the hands, gentle highlights on the metal.',
      'Colour grade (keep exactly): warm, soft analog-film look in the style of Kodak Portra 400; creamy highlights that never clip to pure white; gently lifted, warm-brown shadows that never go pure black; low contrast and airy; natural, gentle saturation; true-to-life Indian skin tones (warm golden-brown, natural texture, never orange, grey or plastic); foliage muted toward olive green; marigold yellows rich but never neon; a faint cool moonlight-blue only in the deepest shadows; fine, even film grain across the whole frame.',
      'Style: photorealistic editorial photography, candid and documentary. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Natural, anatomically correct hands with five fingers each; real skin texture. Deliver as a PNG file.',
    ].join('\n\n'),
  },
  {
    id: 'contact-twilight',
    code: 'IMG-13',
    title: 'Contact: twilight sky',
    usedIn: 'Contact panel; the live moon for your wedding date is drawn into its empty sky',
    ratio: [4, 5],
    size: [1280, 1600],
    focal: [0.5, 0.62],
    prompt: [
      sizeLine(1280, 1600, 4, 5, 'portrait'),
      'Subject: a quiet twilight over the Sahyadri hills near Nashik, seen from the bank of the Godavari river. Layered hill silhouettes in soft blue-grey; the calm river in the lower third reflects the sky, with a few tiny warm lamps on a distant ghat. No people.',
      'Composition: the upper half of the frame must be completely clean, empty sky: no moon, no stars, no birds, no clouds, nothing at all, because a moon will be added there later. Hills sit across the middle, the river reflection below.',
      'Camera: full-frame camera, 35mm lens at f/5.6, level horizon.\nLight: just after sunset, the sky fading from warm apricot at the horizon to deep twilight blue at the top, very soft and even.',
      'Colour grade (keep exactly): warm, soft analog-film look in the style of Kodak Portra 400; creamy highlights that never clip to pure white; gently lifted shadows that never go pure black; low contrast and airy; natural, gentle saturation; true-to-life colours; greens muted toward olive; a faint cool moonlight-blue in the deepest shadows; fine, even film grain across the whole frame.',
      'Style: photorealistic editorial landscape photography. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Deliver as a PNG file.',
    ].join('\n\n'),
  },
  {
    id: 'detail-paithani',
    code: 'IMG-14',
    title: 'Detail: Paithani border',
    usedIn: 'Manifesto inline pill; textures; 404 page',
    ratio: [3, 2],
    size: [1800, 1200],
    focal: [0.5, 0.5],
    prompt: [
      sizeLine(1800, 1200, 3, 2, 'landscape'),
      'Subject: a macro detail of a handwoven Paithani silk saree border from Yeola: a woven peacock motif in gold zari on deep magenta silk, beside a band of emerald green; a strand of small pearls (from a bridal mundavalya) lies diagonally across the fabric.',
      'Composition: the peacock motif centred, the border running diagonally across the frame, the pearls crossing the lower right.',
      'Camera: full-frame camera, 100mm macro lens at f/4, shallow depth of field.\nLight: soft raking window light from the left that reveals the weave and the shine of the zari.',
      'Colour grade (keep exactly): warm, soft analog-film look in the style of Kodak Portra 400; creamy highlights that never clip to pure white; gently lifted, warm-brown shadows that never go pure black; low contrast and airy; natural, gentle saturation; true-to-life colours; silk magentas, emerald greens and gold rich but never neon; a faint cool moonlight-blue only in the deepest shadows; fine, even film grain across the whole frame.',
      'Style: photorealistic editorial detail photography. No text, letters, numbers, logos, watermarks, signatures, borders or frames anywhere. Deliver as a PNG file.',
    ].join('\n\n'),
  },
];

export const video = {
  code: 'VID-01',
  title: 'Optional: hero cinemagraph',
  usedIn:
    'Hero video loop. Upload hero-desktop.png to an image-to-video tool, then encode to public/videos/hero-reel.mp4 (make a 1080 × 1920 version from hero-mobile.png as hero-reel-mobile.mp4).',
  prompt:
    "Animate this exact photograph into a 6–8 second seamless looping cinemagraph, 1920 × 1080, 24 fps, no audio. The camera stays perfectly still: no zoom, pan or tilt. Only subtle, natural motion: the warm string lights twinkle softly, a light breeze moves the edge of the bride's silk pallu and a few strands of hair, the couple breathes and her soft laugh continues with a tiny natural movement, vine leaves stir gently. Faces, hands and jewellery keep their exact shape (no morphing), no new objects or people appear, no text. The last frame must match the first so the loop is seamless. Keep the same warm Portra-like film colour grade and fine grain as the photograph.",
};

/**
 * Derived crops made from the generated images (no extra prompts needed).
 * @type {{ id: string, from: string, ratio: [number, number], size: [number, number], focal: [number, number] }[]}
 */
export const derived = [
  { id: 'ig-haldi', from: 'story-haldi', ratio: [1, 1], size: [1080, 1080], focal: [0.55, 0.42] },
  { id: 'ig-mehendi', from: 'story-mehendi', ratio: [1, 1], size: [1080, 1080], focal: [0.42, 0.5] },
  { id: 'ig-sangeet', from: 'story-sangeet', ratio: [1, 1], size: [1080, 1080], focal: [0.5, 0.4] },
  { id: 'ig-lagna', from: 'story-lagna', ratio: [1, 1], size: [1080, 1080], focal: [0.45, 0.42] },
  { id: 'ig-reception', from: 'story-reception', ratio: [1, 1], size: [1080, 1080], focal: [0.5, 0.58] },
  { id: 'ig-prewedding', from: 'story-prewedding', ratio: [1, 1], size: [1080, 1080], focal: [0.5, 0.55] },
  { id: 'svc-candid', from: 'story-haldi', ratio: [4, 5], size: [1280, 1600], focal: [0.55, 0.42] },
  { id: 'svc-prewedding', from: 'story-prewedding', ratio: [4, 5], size: [1280, 1600], focal: [0.5, 0.55] },
  { id: 'svc-traditional', from: 'story-lagna', ratio: [4, 5], size: [1280, 1600], focal: [0.45, 0.4] },
  { id: 'pill-antarpat', from: 'story-lagna', ratio: [3, 1], size: [600, 200], focal: [0.45, 0.32] },
  { id: 'pill-paithani', from: 'detail-paithani', ratio: [3, 1], size: [600, 200], focal: [0.5, 0.5] },
];

/** Social preview crop (written to src/app/opengraph-image.jpg + twitter-image.jpg). */
export const og = { from: 'hero-desktop', size: [1200, 630], focal: [0.5, 0.45], maxBytes: 300 * 1024 };
