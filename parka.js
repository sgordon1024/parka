/* Parka: what to wear, from the live forecast.
   Weather comes from Open-Meteo (no API key). UI is Baseline components and tokens. */
(function () {
  const h = React.createElement;
  const { useEffect, useState } = React;

  const PLACES = [
    { id: "cville", name: "Charlottesville", region: "VA", lat: 38.03, lon: -78.48 },
    { id: "durham", name: "Durham", region: "NC", lat: 35.99, lon: -78.9 },
    { id: "nyc", name: "New York", region: "NY", lat: 40.71, lon: -74.01 },
    { id: "vancouver", name: "Vancouver", region: "BC", lat: 49.28, lon: -123.12 },
  ];

  const API = "https://api.open-meteo.com/v1/forecast";
  const UNITS = "&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto";

  /* ---------- weather words ---------- */

  // WMO weather codes, as Open-Meteo reports them, mapped to a label and a Lucide icon.
  function sky(code, isDay = 1) {
    if (code === 0) return { label: isDay ? "Sunny" : "Clear", icon: isDay ? "Sun" : "Moon" };
    if (code === 1) return { label: "Mostly clear", icon: isDay ? "CloudSun" : "CloudMoon" };
    if (code === 2) return { label: "Partly cloudy", icon: isDay ? "CloudSun" : "CloudMoon" };
    if (code === 3) return { label: "Cloudy", icon: "Cloud" };
    if (code === 45 || code === 48) return { label: "Fog", icon: "CloudFog" };
    if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "CloudDrizzle" };
    if (code >= 61 && code <= 67) return { label: "Rain", icon: "CloudRain" };
    if (code >= 80 && code <= 82) return { label: "Showers", icon: "CloudRain" };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "Snow", icon: "CloudSnow" };
    if (code >= 95) return { label: "Storms", icon: "CloudLightning" };
    return { label: "Mixed", icon: "Cloud" };
  }

  // The one question Parka answers, from the feels-like temperature. Each answer has a garment
  // drawing and a warmth tier, which sets its colors on Week.
  const WEAR = [
    { min: 78, label: "T-shirt weather", short: "T-shirt", many: "T-shirts", garment: "tee", tier: "hot" },
    { min: 65, label: "Light layer", short: "Layer", many: "Light layers", garment: "hoodie", tier: "warm" },
    { min: 50, label: "Jacket", short: "Jacket", many: "Jackets", garment: "jacket", tier: "mild" },
    { min: 35, label: "Warm coat", short: "Coat", many: "Warm coats", garment: "coat", tier: "cool" },
    { min: -Infinity, label: "Full parka", short: "Parka", many: "Parkas", garment: "parka", tier: "cold" },
  ];
  const wear = (feels) => WEAR.find((w) => feels >= w.min);
  const outfit = (feels) => wear(feels).label;

  // Garments on a 64 x 64 grid, drawn like soft clay. The body gets the fabric and a puffy edge,
  // "inside" is the dark inside of a collar or hood, folds are soft shadows, seams are stitched lines.
  const ring = (cx, cy, rx, ry, n, r) => Array.from({ length: n }, (_, i) =>
    [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI), r]);
  const GARMENTS = {
    tee: {
      body: "M23 8 C26 12.5 38 12.5 41 8 L51 11.5 L60 21 L53.5 28 L48.5 24.5 L48.5 56 L15.5 56 L15.5 24.5 L10.5 28 L4 21 L13 11.5 Z",
      inside: ["M23 8 C26 12.5 38 12.5 41 8 C37.5 6.3 26.5 6.3 23 8 Z"],
      rib: ["M23.2 8.3 C26.2 12.6 37.8 12.6 40.8 8.3"],
      folds: ["M17.6 27.5 Q22 33 21 41", "M46.4 27.5 Q42 33 43 41"],
      seams: ["M16.2 11 Q15.2 18 15.6 24.5", "M47.8 11 Q48.8 18 48.4 24.5", "M5.9 19.4 L12.1 26", "M58.1 19.4 L51.9 26",
        "M15.6 53 L48.4 53"],
    },
    hoodie: {
      body: "M18.5 15 C17 2 47 2 45.5 15 L52 16 Q56 17 57 21.5 L60.5 50 L53 51.5 L48.5 26.5 L48.5 57 L15.5 57 L15.5 26.5 L11 51.5 L3.5 50 L7 21.5 Q8 17 12 16 Z",
      inside: ["M22.5 12.5 C22.5 26 41.5 26 41.5 12.5 C37 9.5 27 9.5 22.5 12.5 Z"],
      rib: ["M22.6 13 C23 25.4 41 25.4 41.4 13"],
      folds: ["M17.5 30 Q21 36 19.5 41", "M46.5 30 Q43 36 44.5 41", "M8.8 26 Q10.5 36 7.5 44", "M55.2 26 Q53.5 36 56.5 44"],
      seams: ["M32 5.4 L32 10.2", "M22 41 L42 41 L44.5 52 L19.5 52 Z", "M3.95 46.5 L11.9 48", "M60.05 46.5 L52.1 48",
        "M15.6 53.5 L48.4 53.5", "M15.8 17 Q15.2 22 15.5 26.5", "M48.2 17 Q48.8 22 48.5 26.5"],
      cords: ["M28 22.5 L27.4 33", "M36 22.5 L36.6 33"],
    },
    jacket: {
      body: "M24 5 L40 5 L41.5 10 L51 12 Q56 13.5 57 18 L60.5 50 L53 51.5 L48.5 25 L48.5 57 L15.5 57 L15.5 25 L11 51.5 L3.5 50 L7 18 Q8 13.5 13 12 L22.5 10 Z",
      inside: ["M24.6 5.6 L39.4 5.6 L40.6 9.6 L32 13.6 L23.4 9.6 Z"],
      folds: ["M18 28 Q22 34 20.5 42", "M46 28 Q42 34 43.5 42", "M8.6 24 Q10.6 35 7.6 44", "M55.4 24 Q53.4 35 56.4 44"],
      seams: ["M22.5 10 L32 15 L41.5 10", "M21 37 L24 46", "M43 37 L40 46", "M15.6 52.5 L48.4 52.5",
        "M3.9 46.6 L11.7 48", "M60.1 46.6 L52.3 48", "M16.4 13 Q15.4 19 15.5 25", "M47.6 13 Q48.6 19 48.5 25"],
      zip: "M32 15 L32 57",
      pull: { x: 30.6, y: 15.5, width: 2.8, height: 5.2, rx: 1.2 },
    },
    coat: {
      body: "M23 4 L41 4 L42 9.5 L51 12 Q57.5 14 58.5 21 L61 52 Q61 54 59 54.5 L54 55.5 Q52 56 51.5 54 L49 30 L49.5 59 Q49.5 61 47.5 61 L16.5 61 Q14.5 61 14.5 59 L15 30 L12.5 54 Q12 56 10 55.5 L5 54.5 Q3 54 3 52 L5.5 21 Q6.5 14 13 12 L22 9.5 Z",
      inside: ["M23.8 4.6 L40.2 4.6 L41 9 L32 12 L23 9 Z"],
      bands: [[9.5, 21.5], [21.5, 32], [32, 42.5], [42.5, 52.5], [52.5, 61]],
      seams: ["M15 21.5 L49 21.5", "M15 32 L49 32", "M15 42.5 L49.3 42.5", "M14.8 52.5 L49.4 52.5",
        "M4.9 33 L13.6 34", "M4.1 44 L12.7 45", "M50.4 34 L59.1 33", "M51.3 45 L59.9 44"],
      zip: "M32 12 L32 61",
      pull: { x: 30.6, y: 12.6, width: 2.8, height: 5.2, rx: 1.2 },
    },
    parka: {
      body: "M19 18 C16 1 48 1 45 18 L53 20 Q57.5 22 58 27 L61 56 L53.5 57.5 L49.5 32 L50.5 62 L13.5 62 L14.5 32 L10.5 57.5 L3 56 L6 27 Q6.5 22 11 20 Z",
      fur: ring(32, 13, 10.2, 9.6, 24, 2.5),
      inside: ["M24.8 13 A7.2 6.8 0 1 0 39.2 13 A7.2 6.8 0 1 0 24.8 13 Z"],
      folds: ["M18 40 Q21 46 19.5 54", "M46 40 Q43 46 44.5 54", "M8 32 Q10 42 7 50", "M56 32 Q54 42 57 50"],
      seams: ["M14.4 36 L49.6 36", "M18.5 44 L28 44 L28 55 L18.5 55 Z", "M36 44 L45.5 44 L45.5 55 L36 55 Z",
        "M18.5 47 L28 47", "M36 47 L45.5 47", "M3.4 51.5 L10.9 53", "M60.6 51.5 L53.1 53"],
      zip: "M32 23 L32 62",
      toggles: [[32, 28], [32, 40], [32, 52]],
    },
  };

  const deg = (n) => `${Math.round(n)}°`;
  const clock = (hr, min) => `${hr % 12 || 12}${min == null ? "" : ":" + min} ${hr >= 12 ? "PM" : "AM"}`;
  const hourLabel = (iso) => clock(Number(iso.slice(11, 13)));
  const timeLabel = (iso) => clock(Number(iso.slice(11, 13)), iso.slice(14, 16));
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function weekday(date) {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  }
  const dayLabel = (date, i) => (i === 0 ? "Today" : DAYS[weekday(date)]);
  function localTime(offsetSeconds) {
    const t = new Date(Date.now() + offsetSeconds * 1000);
    return clock(t.getUTCHours(), String(t.getUTCMinutes()).padStart(2, "0"));
  }

  /* ---------- data ---------- */

  // The chosen place is shared by every screen, including the board's frames.
  const currentPlace = () => PLACES.find((p) => p.id === localStorage.getItem("parka.place")) || PLACES[0];

  // Every response is saved, so a bad connection shows the last forecast instead of a blank screen.
  async function getJSON(url, key) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      localStorage.setItem(key, JSON.stringify(data));
      return { data, stale: false };
    } catch (err) {
      const saved = localStorage.getItem(key);
      if (saved) return { data: JSON.parse(saved), stale: true };
      throw err;
    }
  }

  function forecast(place) {
    return getJSON(
      `${API}?latitude=${place.lat}&longitude=${place.lon}` +
        "&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m" +
        "&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,is_day" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max," +
        "precipitation_probability_max,uv_index_max&forecast_days=7" + UNITS,
      `parka.forecast.${place.id}`
    );
  }

  function everyPlaceNow() {
    return getJSON(
      `${API}?latitude=${PLACES.map((p) => p.lat)}&longitude=${PLACES.map((p) => p.lon)}` +
        "&current=temperature_2m,apparent_temperature,weather_code,is_day" +
        "&hourly=precipitation_probability&forecast_hours=12" + UNITS,
      "parka.places"
    );
  }

  // The next `count` hours after the current one.
  function upcoming(fc, count) {
    const start = Math.max(0, fc.hourly.time.findIndex((t) => t.slice(0, 13) === fc.current.time.slice(0, 13))) + 1;
    return fc.hourly.time.slice(start, start + count).map((time, k) => ({
      time,
      temp: fc.hourly.temperature_2m[start + k],
      feels: fc.hourly.apparent_temperature[start + k],
      rain: fc.hourly.precipitation_probability[start + k],
      code: fc.hourly.weather_code[start + k],
      isDay: fc.hourly.is_day[start + k],
    }));
  }

  function todayStory(fc) {
    const now = fc.current;
    const next = upcoming(fc, 12);
    // "Later" means this evening (9 PM), or tomorrow morning once the evening has passed.
    const target = Number(now.time.slice(11, 13)) < 21 ? 21 : 9;
    const later = next.find((x) => Number(x.time.slice(11, 13)) === target) || next[next.length - 1];
    const wet = next.find((x) => x.rain >= 40);
    const extras = [];
    if (wet) extras.push({ tone: "info", icon: "Umbrella", text: "Umbrella" });
    if (now.wind_speed_10m >= 18) extras.push({ tone: "warning", icon: "Wind", text: `Windy, ${Math.round(now.wind_speed_10m)} mph` });
    if (fc.daily.uv_index_max[0] >= 7) extras.push({ tone: "warning", icon: "Sun", text: "Sunscreen" });
    if (now.apparent_temperature - later.feels >= 15) extras.push({ tone: "neutral", icon: "Shirt", text: "A layer for later" });
    return {
      wear: outfit(now.apparent_temperature),
      why:
        `Feels like ${deg(now.apparent_temperature)} now and ${deg(later.feels)} by ${hourLabel(later.time)}. ` +
        (wet ? `Rain likely around ${hourLabel(wet.time)} (${wet.rain}%).` : "Dry for the next 12 hours."),
      extras,
      hours: next.slice(0, 6),
    };
  }

  /* ---------- pieces ---------- */

  function Icon({ name, label }) {
    const node = window.ParkaIcons[name] || window.ParkaIcons.Cloud;
    return h(
      "svg",
      {
        className: "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2,
        strokeLinecap: "round", strokeLinejoin: "round",
        role: label ? "img" : undefined, "aria-label": label, "aria-hidden": label ? undefined : true,
      },
      node.map(([tag, attrs], i) => h(tag, { ...attrs, key: i }))
    );
  }
  const Glyph = ({ name, label }) => h("span", { className: "glyph" }, h(Icon, { name, label }));

  // Shared paint for every garment: the fabric, the puffy clay edge, and the dark insides.
  function GarmentDefs() {
    const stop = (offset, color, opacity = 1) => h("stop", { offset, style: { stopColor: `var(--${color})`, stopOpacity: opacity } });
    return h("svg", { className: "gm-defs", width: 0, height: 0, "aria-hidden": true },
      h("defs", null,
        h("linearGradient", { id: "gm-fabric", x1: 0.1, y1: 0, x2: 0.8, y2: 1 }, stop(0, "cloth-hi"), stop(1, "cloth-lo")),
        h("linearGradient", { id: "gm-band", x1: 0, y1: 0, x2: 0, y2: 1 },
          stop(0, "cloth-hi", 0.8), stop(0.45, "cloth-hi", 0), stop(1, "cloth-shade", 0.3)),
        h("radialGradient", { id: "gm-inside", cx: 0.5, cy: 0.15, r: 0.95 }, stop(0, "cloth-inside-hi"), stop(1, "cloth-inside-lo")),
        h("radialGradient", { id: "gm-fur", cx: 0.35, cy: 0.3, r: 0.8 }, stop(0, "cloth-lo"), stop(1, "cloth-seam")),
        h("filter", { id: "gm-clay", x: "-20%", y: "-20%", width: "140%", height: "140%", colorInterpolationFilters: "sRGB" },
          h("feComponentTransfer", { in: "SourceAlpha", result: "out" }, h("feFuncA", { type: "table", tableValues: "1 0" })),
          h("feGaussianBlur", { in: "out", stdDeviation: 2.2, result: "soft" }),
          h("feOffset", { in: "soft", dx: -1.5, dy: -1.9, result: "lowEdge" }),
          h("feFlood", { style: { floodColor: "var(--cloth-shade)", floodOpacity: 0.42 } }),
          h("feComposite", { in2: "lowEdge", operator: "in" }),
          h("feComposite", { in2: "SourceAlpha", operator: "in", result: "shade" }),
          h("feOffset", { in: "soft", dx: 1.3, dy: 1.5, result: "highEdge" }),
          h("feFlood", { style: { floodColor: "var(--cloth-hi)", floodOpacity: 0.95 } }),
          h("feComposite", { in2: "highEdge", operator: "in" }),
          h("feComposite", { in2: "SourceAlpha", operator: "in", result: "light" }),
          h("feMerge", null, h("feMergeNode", { in: "SourceGraphic" }), h("feMergeNode", { in: "shade" }), h("feMergeNode", { in: "light" }))),
        h("filter", { id: "gm-blur", x: "-50%", y: "-50%", width: "200%", height: "200%" }, h("feGaussianBlur", { stdDeviation: 1.2 })),
        Object.entries(GARMENTS).map(([k, g]) => h("clipPath", { id: `gm-${k}`, key: k }, h("path", { d: g.body })))));
  }

  function Garment({ kind, className }) {
    const g = GARMENTS[kind];
    const clip = `url(#gm-${kind})`;
    const paths = (list, cls) => (list || []).map((d) => h("path", { key: cls + d, d, className: cls }));
    return h("svg", { className: "garment" + (className ? ` ${className}` : ""), viewBox: "0 0 64 64", "aria-hidden": true },
      h("g", { filter: "url(#gm-clay)" },
        h("path", { d: g.body, fill: "url(#gm-fabric)" }),
        g.bands && h("g", { clipPath: clip },
          g.bands.map(([a, b]) => h("rect", { key: a, x: 0, y: a, width: 64, height: b - a, fill: "url(#gm-band)" })))),
      h("g", { clipPath: clip }, paths(g.folds, "g-fold")),
      g.fur && h("g", { className: "g-fur" }, g.fur.map(([cx, cy, r], i) => h("circle", { key: i, cx, cy, r }))),
      paths(g.inside, "g-inside"),
      paths(g.rib, "g-rib"),
      paths(g.seams, "g-seam"),
      g.zip && h("path", { d: g.zip, className: "g-zip" }),
      g.pull && h("rect", { ...g.pull, className: "g-pull" }),
      paths(g.cords, "g-cord"),
      (g.toggles || []).map(([x, y]) => h("rect", { key: y, x: x - 1.6, y: y - 3, width: 3.2, height: 6, rx: 1.6, className: "g-pull" })));
  }

  function StatusBar() {
    return h("div", { className: "status" },
      h("span", null, "9:41"),
      h("span", { className: "sb-right" },
        h("span", { className: "sb-cell", "aria-hidden": true }, h("i"), h("i"), h("i"), h("i")),
        h("span", { className: "sb-5g" }, "5G"),
        h("span", { className: "sb-batt", "aria-hidden": true }, h("i"))));
  }

  const TABS = [
    { id: "today", label: "Today", icon: "Shirt", href: "today.html" },
    { id: "week", label: "Week", icon: "CalendarDays", href: "week.html" },
    { id: "places", label: "Places", icon: "MapPin", href: "places.html" },
  ];
  function TabBar({ on }) {
    return h(React.Fragment, null,
      h("nav", { className: "tabbar", "aria-label": "Screens" },
        TABS.map((t) => h("a", { key: t.id, href: t.href, className: t.id === on ? "on" : undefined,
          "aria-current": t.id === on ? "page" : undefined }, h(Glyph, { name: t.icon }), t.label))),
      h("div", { className: "home" }));
  }

  function Head({ title, place, updated, stale }) {
    return h("header", { className: "head" },
      h("div", null,
        h("h1", null, title),
        place && h("p", { className: "place" }, h(Icon, { name: "MapPin" }), `${place.name}, ${place.region}`)),
      updated && h("span", { className: "updated" }, `${stale ? "Saved" : "Updated"} ${updated}`));
  }

  function Loading({ title }) {
    const { Card, Skeleton } = window.Baseline;
    return h(React.Fragment, null,
      h(Head, { title }),
      h("main", null,
        h(Card, null,
          h(Skeleton, { variant: "text", width: "35%" }),
          h(Skeleton, { variant: "rect", height: 52, style: { margin: "14px 0" } }),
          h(Skeleton, { variant: "text", width: "90%" })),
        h(Card, null, h(Skeleton, { variant: "rect", height: 96 }))));
  }

  function Problem({ title }) {
    const { Card } = window.Baseline;
    return h(React.Fragment, null,
      h(Head, { title }),
      h("main", null, h(Card, null,
        h("p", { className: "eyebrow" }, "No forecast"),
        h("p", { className: "why" }, "Parka couldn't reach the weather service. Check the connection and reload."))));
  }

  /* ---------- screens ---------- */

  function Today({ fc, stale, place }) {
    const { Card, Badge } = window.Baseline;
    const now = fc.current;
    const s = sky(now.weather_code, now.is_day);
    const story = todayStory(fc);
    return h(React.Fragment, null,
      h(Head, { title: "Today", place, updated: timeLabel(now.time), stale }),
      h("main", null,
        h(Card, null,
          h("p", { className: "eyebrow" }, "What to wear"),
          h("p", { className: "answer" }, story.wear),
          h("p", { className: "why" }, story.why),
          story.extras.length > 0 && h("div", { className: "extras" },
            story.extras.map((x) => h(Badge, { key: x.text, tone: x.tone }, h(Icon, { name: x.icon }), x.text)))),
        h(Card, null,
          h("div", { className: "now" },
            h("span", { className: "big" }, deg(now.temperature_2m)),
            h("div", { className: "cond" },
              h("b", null, s.label),
              h("span", null, `High ${deg(fc.daily.temperature_2m_max[0])} · Low ${deg(fc.daily.temperature_2m_min[0])}`)),
            h(Glyph, { name: s.icon, label: s.label })),
          h("div", { className: "hours" },
            story.hours.map((x) => h("div", { className: "hour", key: x.time },
              h("span", null, hourLabel(x.time)),
              h(Glyph, { name: sky(x.code, x.isDay).icon, label: sky(x.code, x.isDay).label }),
              h("span", { className: "t" }, deg(x.temp)),
              h("span", { className: "drop" }, h(Icon, { name: "Droplets" }), `${x.rain}%`)))))));
  }

  // One line of advice for the week: how long the first outfit lasts, then the day that needs the most.
  function weekStory(days) {
    const first = days[0].wear;
    let run = 1;
    while (run < days.length && days[run].wear === first) run++;
    const lines = [run === days.length ? `${first.many} all week.`
      : run > 1 ? `${first.many} through ${days[run - 1].full}.` : `${first.label} today.`];
    const later = days.slice(run);
    if (later.length) {
      const coldest = later.reduce((a, b) => (b.feels < a.feels ? b : a));
      if (WEAR.indexOf(coldest.wear) > WEAR.indexOf(first)) {
        lines.push(`Grab a ${coldest.wear.label.toLowerCase()}${coldest.rain >= 40 ? " and an umbrella" : ""} ${coldest.full}.`);
      } else lines.push(`${later[0].wear.many} from ${later[0].full}.`);
    }
    return lines;
  }

  // A smooth line through the points (Catmull-Rom, as cubic Beziers).
  function smooth(p) {
    const f = (n) => n.toFixed(1);
    let d = `M${f(p[0][0])} ${f(p[0][1])}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ` C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`;
    }
    return d;
  }

  // The rest of the week as one line of highs. Each day's outfit rides on the line, in its warmth color.
  function WeekLine({ days }) {
    const W = 350, H = 150, R = 25, BLEED = 20;
    const step = W / days.length;
    const top = Math.max(...days.map((d) => d.hi)), low = Math.min(...days.map((d) => d.hi));
    const y = (t) => (top === low ? H / 2 : R + 4 + ((top - t) / (top - low)) * (H - 2 * R - 8));
    const pts = days.map((d, i) => [step * (i + 0.5), y(d.hi)]);
    const line = smooth([[-BLEED, pts[0][1]], ...pts, [W + BLEED, pts[pts.length - 1][1]]]);
    // The line takes each day's warmth color as it passes, and the area under it fades out downward.
    const colors = h("linearGradient", { id: "wk-days", x1: -BLEED, y1: 0, x2: W + BLEED, y2: 0, gradientUnits: "userSpaceOnUse" },
      days.map((d, i) => h("stop", { key: i, offset: (pts[i][0] + BLEED) / (W + 2 * BLEED), style: { stopColor: `var(--${d.wear.tier}-b)` } })));
    const fade = h("linearGradient", { id: "wk-fade", x1: 0, y1: 0, x2: 0, y2: 1 },
      h("stop", { offset: 0, style: { stopColor: "white", stopOpacity: "var(--wk-fill)" } }), h("stop", { offset: 1, stopColor: "white", stopOpacity: 0 }));
    return h("div", { className: "wk-line", style: { height: H } },
      h("svg", { viewBox: `${-BLEED} 0 ${W + 2 * BLEED} ${H}`, preserveAspectRatio: "none", "aria-hidden": true },
        h("defs", null, colors, fade,
          h("mask", { id: "wk-under", maskUnits: "userSpaceOnUse", x: -BLEED, y: 0, width: W + 2 * BLEED, height: H },
            h("rect", { x: -BLEED, y: Math.min(...pts.map((p) => p[1])), width: W + 2 * BLEED, height: H - Math.min(...pts.map((p) => p[1])), fill: "url(#wk-fade)" }))),
        h("path", { d: `${line} L${W + BLEED} ${H} L${-BLEED} ${H} Z`, fill: "url(#wk-days)", mask: "url(#wk-under)" }),
        h("path", { d: line, className: "wk-stroke" })),
      days.map((d, i) => h("span", {
        key: d.date, className: `wk-dot tier-${d.wear.tier}`,
        style: { left: `calc(${((pts[i][0] / W) * 100).toFixed(2)}% - ${R}px)`, top: pts[i][1] - R },
      }, h(Garment, { kind: d.wear.garment }))));
  }

  // Week: what to wear leads. Today is the big card, and the rest of the week is one line of highs.
  function Week({ fc, stale, place }) {
    const d = fc.daily;
    const days = d.time.map((date, i) => ({
      date,
      name: dayLabel(date, i),
      full: FULL_DAYS[weekday(date)],
      sky: sky(d.weather_code[i]),
      feels: d.apparent_temperature_max[i],
      wear: wear(d.apparent_temperature_max[i]),
      hi: d.temperature_2m_max[i],
      lo: d.temperature_2m_min[i],
      rain: d.precipitation_probability_max[i],
    }));
    const [today, ...rest] = days;
    const [lead, then] = weekStory(days);
    return h(React.Fragment, null,
      h(GarmentDefs),
      h(Head, { title: "What to wear", place, updated: timeLabel(fc.current.time), stale }),
      h("main", { className: "wk" },
        h("article", { className: `wk-hero tier-${today.wear.tier}` },
          h("div", { className: "wk-hero-top" },
            h("span", { className: "wk-kicker" }, "Today"),
            h("span", { className: "wk-glass" }, h(Icon, { name: today.sky.icon }), today.sky.label)),
          h("p", { className: "wk-hero-wear" }, today.wear.label),
          h("p", { className: "wk-hero-temps" },
            h("b", null, deg(today.hi)), ` / ${deg(today.lo)}`,
            h("span", null, `Feels like ${deg(today.feels)}`)),
          today.rain >= 30 && h("span", { className: "wk-glass wk-hero-rain" },
            h(Icon, { name: "Umbrella", label: "Chance of rain" }), `${today.rain}%`),
          h(Garment, { kind: today.wear.garment, className: "wk-hero-garment" })),
        h("section", { className: "wk-ahead", "aria-label": "The next six days" },
          h("p", { className: "eyebrow" }, "Next 6 days"),
          h("p", { className: "wk-story" }, h("b", null, lead), then && ` ${then}`),
          h(WeekLine, { days: rest }),
          h("div", { className: "wk-cols" }, rest.map((day) =>
            h("div", { key: day.date, className: "wk-col" },
              h("span", { className: "wk-day" }, day.name),
              h("b", null, day.wear.short),
              h("span", { className: "wk-hl" }, h("b", null, deg(day.hi)), ` ${deg(day.lo)}`),
              day.rain >= 30 && h("span", { className: "wk-wet" },
                h(Icon, { name: "Umbrella", label: "Chance of rain" }), `${day.rain}%`))))),
        h("p", { className: "note" }, "What to wear is based on each day's feels-like high.")));
  }

  function Places({ list, stale, place, onPick }) {
    const { Card, Badge, Tag } = window.Baseline;
    return h(React.Fragment, null,
      h(Head, { title: "Places", updated: stale ? "earlier" : null, stale }),
      h("main", null,
        h("div", { className: "places" }, PLACES.map((p, i) => {
          const r = list[i];
          const now = r.current;
          const s = sky(now.weather_code, now.is_day);
          const rainLater = Math.max(...r.hourly.precipitation_probability) >= 40;
          return h(Card, {
            key: p.id, as: "button", interactive: true, className: "pl",
            onClick: () => onPick(p.id), "aria-pressed": p.id === place.id,
          },
            h("div", null,
              h("p", { className: "city" }, p.name),
              h("p", { className: "sub" }, `${p.region} · ${localTime(r.utc_offset_seconds)} · ${s.label}`),
              h("div", { className: "meta" },
                h(Tag, null, outfit(now.apparent_temperature)),
                p.id === place.id && h(Badge, { tone: "accent" }, "Current"),
                rainLater && h(Badge, { tone: "info" }, h(Icon, { name: "Umbrella" }), "Rain later"))),
            h("div", { className: "right" },
              h(Glyph, { name: s.icon, label: s.label }),
              h("span", { className: "temp" }, deg(now.temperature_2m))));
        })),
        h("p", { className: "note" }, "Tap a place to see its forecast.")));
  }

  /* ---------- app ---------- */

  const TITLES = { today: "Today", week: "What to wear", places: "Places" };

  function App() {
    const screen = document.body.dataset.screen;
    const [place, setPlace] = useState(currentPlace);
    const [state, setState] = useState({ status: "loading" });

    // Another screen (or another frame on the board) picked a new place.
    useEffect(() => {
      const onStorage = (e) => e.key === "parka.place" && setPlace(currentPlace());
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
      let live = true;
      const job = screen === "places" ? everyPlaceNow() : forecast(place);
      job.then((r) => {
        if (!live) return;
        setState({ status: "ready", ...r });
        const now = screen === "places" ? r.data[PLACES.indexOf(place)].current : r.data.current;
        document.documentElement.dataset.theme = now.is_day === 0 ? "dark" : "light";
      }).catch(() => live && setState({ status: "error" }));
      return () => { live = false; };
    }, [place.id]);

    const pick = (id) => {
      localStorage.setItem("parka.place", id);
      if (window.self === window.top) location.href = "today.html";
      else setPlace(currentPlace());
    };

    let body;
    if (state.status === "loading") body = h(Loading, { title: TITLES[screen] });
    else if (state.status === "error") body = h(Problem, { title: TITLES[screen] });
    else if (screen === "week") body = h(Week, { fc: state.data, stale: state.stale, place });
    else if (screen === "places") body = h(Places, { list: state.data, stale: state.stale, place, onPick: pick });
    else body = h(Today, { fc: state.data, stale: state.stale, place });

    return h(React.Fragment, null, h(StatusBar), body, h(TabBar, { on: screen }));
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
