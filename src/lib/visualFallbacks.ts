const svgDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

export const heroVisualFallback = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 950">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#07131f"/>
      <stop offset=".52" stop-color="#12333a"/>
      <stop offset="1" stop-color="#d8a33b"/>
    </linearGradient>
    <pattern id="grid" width="90" height="90" patternUnits="userSpaceOnUse">
      <path d="M90 0H0v90" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1800" height="950" fill="url(#g)"/>
  <rect width="1800" height="950" fill="url(#grid)" opacity=".55"/>
  <path d="M-80 740 C310 560 620 625 955 490 C1245 374 1470 260 1880 340 L1880 950 L-80 950Z" fill="rgba(255,255,255,.14)"/>
  <path d="M130 720 L730 420 L1040 560 L1460 300 L1690 420" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M210 720 H1590" stroke="rgba(255,255,255,.22)" stroke-width="18" stroke-linecap="round"/>
  <circle cx="730" cy="420" r="34" fill="#0d9488"/>
  <circle cx="1040" cy="560" r="34" fill="#f2b84b"/>
  <circle cx="1460" cy="300" r="34" fill="#0d9488"/>
</svg>
`)

const roadVisual = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 820">
  <defs>
    <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#f8fafc"/>
      <stop offset=".45" stop-color="#c7d2fe"/>
      <stop offset="1" stop-color="#0f766e"/>
    </linearGradient>
    <linearGradient id="road" x1="0" x2="0" y1="0" y2="1">
      <stop stop-color="#334155"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="820" fill="url(#sky)"/>
  <circle cx="980" cy="130" r="92" fill="#fbbf24" opacity=".72"/>
  <path d="M0 540 C220 480 340 515 520 455 C740 380 910 385 1200 305 L1200 820 L0 820Z" fill="#ffffff" opacity=".34"/>
  <path d="M-60 820 L480 380 L650 820Z" fill="url(#road)"/>
  <path d="M780 820 L585 380 L1320 820Z" fill="url(#road)" opacity=".92"/>
  <path d="M575 425 L545 820" stroke="#f8fafc" stroke-width="16" stroke-dasharray="46 42" opacity=".85"/>
  <path d="M728 820 L640 420" stroke="#f8fafc" stroke-width="12" opacity=".55"/>
  <path d="M145 548 H980" stroke="#0f766e" stroke-width="20" stroke-linecap="round" opacity=".38"/>
  <path d="M165 500 H1000" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".44"/>
</svg>
`)

const bridgeVisual = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 820">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#ecfeff"/>
      <stop offset=".55" stop-color="#99f6e4"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="820" fill="url(#g)"/>
  <path d="M0 595 C220 525 425 560 600 505 C805 440 1010 485 1200 420 L1200 820 L0 820Z" fill="#2563eb" opacity=".22"/>
  <path d="M85 455 H1115" stroke="#0f172a" stroke-width="54" stroke-linecap="round"/>
  <path d="M120 422 H1080" stroke="#f8fafc" stroke-width="18" stroke-linecap="round" opacity=".92"/>
  <path d="M215 455 V690 M440 455 V690 M665 455 V690 M890 455 V690" stroke="#0f172a" stroke-width="34" stroke-linecap="round" opacity=".86"/>
  <path d="M180 455 C360 250 845 250 1020 455" fill="none" stroke="#0f766e" stroke-width="22" stroke-linecap="round"/>
  <path d="M265 450 L360 330 M455 450 L520 300 M650 450 L650 282 M845 450 L780 300 M1010 450 L925 330" stroke="#0f766e" stroke-width="10" stroke-linecap="round" opacity=".85"/>
</svg>
`)

const buildingVisual = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 820">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#f8fafc"/>
      <stop offset=".52" stop-color="#e2e8f0"/>
      <stop offset="1" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="820" fill="url(#g)"/>
  <path d="M210 735 V245 H430 V735 M500 735 V145 H760 V735 M830 735 V300 H1030 V735" fill="#0f172a" opacity=".9"/>
  <path d="M255 300 H380 M255 370 H380 M255 440 H380 M255 510 H380 M545 215 H705 M545 295 H705 M545 375 H705 M545 455 H705 M545 535 H705 M875 360 H990 M875 430 H990 M875 500 H990" stroke="#99f6e4" stroke-width="24" opacity=".82"/>
  <path d="M80 735 H1120" stroke="#ffffff" stroke-width="38" stroke-linecap="round" opacity=".65"/>
</svg>
`)

export function projectVisualFallback(category: string) {
    const normalized = category.toLowerCase()

    if (normalized.includes('bridge')) return bridgeVisual
    if (
        normalized.includes('commercial') ||
        normalized.includes('residential') ||
        normalized.includes('government') ||
        normalized.includes('industrial')
    ) {
        return buildingVisual
    }

    return roadVisual
}
