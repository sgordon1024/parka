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
  // drawing and a warmth tier, which sets its color on Week: the warmer the day, the more accent.
  const WEAR = [
    { min: 78, label: "T-shirt weather", garment: "tee", tier: "hot" },
    { min: 65, label: "Light layer", garment: "hoodie", tier: "warm" },
    { min: 50, label: "Jacket", garment: "jacket", tier: "mild" },
    { min: 35, label: "Warm coat", garment: "coat", tier: "cool" },
    { min: -Infinity, label: "Full parka", garment: "parka", tier: "cold" },
  ];
  const wear = (feels) => WEAR.find((w) => feels >= w.min);
  const outfit = (feels) => wear(feels).label;

  // Garment drawings on a 64 x 64 grid. The body is filled; seams are drawn in the tile color.
  const GARMENTS = {
    tee: {
      body: "M23 8 C26 12.5 38 12.5 41 8 L51 11.5 L60 21 L53.5 28 L48.5 24.5 L48.5 56 L15.5 56 L15.5 24.5 L10.5 28 L4 21 L13 11.5 Z",
      seams: ["M24.5 10.2 C27.5 15 36.5 15 39.5 10.2"],
    },
    hoodie: {
      body: "M18.5 15 C17 2 47 2 45.5 15 L52 16 Q56 17 57 21.5 L60.5 50 L53 51.5 L48.5 26.5 L48.5 57 L15.5 57 L15.5 26.5 L11 51.5 L3.5 50 L7 21.5 Q8 17 12 16 Z",
      opening: "M22.5 12.5 C22.5 26 41.5 26 41.5 12.5 C37 9.5 27 9.5 22.5 12.5 Z",
      seams: ["M26.5 21 L26 31", "M37.5 21 L38 31", "M22 41 L42 41 L44.5 52 L19.5 52 Z", "M15.5 53.8 L48.5 53.8"],
    },
    jacket: {
      body: "M24 5 L40 5 L41.5 10 L51 12 Q56 13.5 57 18 L60.5 50 L53 51.5 L48.5 25 L48.5 57 L15.5 57 L15.5 25 L11 51.5 L3.5 50 L7 18 Q8 13.5 13 12 L22.5 10 Z",
      seams: ["M22.5 10 L32 15 L41.5 10", "M32 15 L32 57", "M21 37 L24 46", "M43 37 L40 46", "M15.5 52.5 L48.5 52.5"],
    },
    coat: {
      body: "M23 4 L41 4 L42 9.5 L51 12 Q57.5 14 58.5 21 L61 52 Q61 54 59 54.5 L54 55.5 Q52 56 51.5 54 L49 30 L49.5 59 Q49.5 61 47.5 61 L16.5 61 Q14.5 61 14.5 59 L15 30 L12.5 54 Q12 56 10 55.5 L5 54.5 Q3 54 3 52 L5.5 21 Q6.5 14 13 12 L22 9.5 Z",
      seams: ["M32 4 L32 61", "M15 21.5 L49 21.5", "M15 32 L49 32", "M15 42.5 L49.3 42.5", "M14.8 52.5 L49.4 52.5",
        "M4.7 33 L13.6 34", "M3.9 44 L12.7 45", "M50.4 34 L59.3 33", "M51.3 45 L60.1 44"],
    },
    parka: {
      body: "M19 18 C16 1 48 1 45 18 L53 20 Q57.5 22 58 27 L61 56 L53.5 57.5 L49.5 32 L50.5 62 L13.5 62 L14.5 32 L10.5 57.5 L3 56 L6 27 Q6.5 22 11 20 Z",
      seams: ["M32 21.5 L32 62", "M19.5 44 L27 44", "M37 44 L44.5 44", "M14.4 36 L49.6 36"],
      hood: true,
    },
  };

  const deg = (n) => `${Math.round(n)}°`;
  const clock = (hr, min) => `${hr % 12 || 12}${min == null ? "" : ":" + min} ${hr >= 12 ? "PM" : "AM"}`;
  const hourLabel = (iso) => clock(Number(iso.slice(11, 13)));
  const timeLabel = (iso) => clock(Number(iso.slice(11, 13)), iso.slice(14, 16));
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function dayLabel(date, i) {
    if (i === 0) return "Today";
    const [y, m, d] = date.split("-").map(Number);
    return DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  }
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

  function Garment({ kind }) {
    const g = GARMENTS[kind];
    return h("svg", { className: "garment", viewBox: "0 0 64 64", "aria-hidden": true },
      h("path", { className: "body", d: g.body }),
      g.opening && h("path", { className: "face", d: g.opening }),
      g.hood && h("ellipse", { className: "fur", cx: 32, cy: 13, rx: 10.4, ry: 9.8 }),
      g.hood && h("ellipse", { className: "face", cx: 32, cy: 13, rx: 7.2, ry: 6.8 }),
      g.seams.map((d) => h("path", { key: d, className: "seam", d })));
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

  // Week: what to wear leads. Today gets the big card, and every day is colored by how warm it is.
  function Week({ fc, stale, place }) {
    const d = fc.daily;
    const days = d.time.map((date, i) => ({
      date,
      name: dayLabel(date, i),
      sky: sky(d.weather_code[i]),
      wear: wear(d.apparent_temperature_max[i]),
      hi: d.temperature_2m_max[i],
      lo: d.temperature_2m_min[i],
      rain: d.precipitation_probability_max[i],
    }));
    const [today, ...rest] = days;
    const rain = (day) => day.rain >= 30 &&
      h("span", { className: "wk-rain" }, h(Icon, { name: "Umbrella", label: "Chance of rain" }), `${day.rain}%`);
    return h(React.Fragment, null,
      h(Head, { title: "This week", place, updated: timeLabel(fc.current.time), stale }),
      h("main", { className: "wk" },
        h("article", { className: `wk-card wk-today tier-${today.wear.tier}` },
          h("div", { className: "wk-top" },
            h("span", { className: "wk-day" }, today.name),
            h("span", { className: "wk-sky" }, h(Icon, { name: today.sky.icon }), today.sky.label)),
          h("p", { className: "wk-wear" }, today.wear.label),
          h("p", { className: "wk-temps" },
            h("b", null, deg(today.hi)), ` / ${deg(today.lo)}`),
          rain(today),
          h(Garment, { kind: today.wear.garment })),
        h("div", { className: "wk-grid" }, rest.map((day) =>
          h("article", { key: day.date, className: `wk-card wk-tile tier-${day.wear.tier}` },
            h("div", { className: "wk-top" },
              h("span", { className: "wk-day" }, day.name),
              rain(day),
              h(Icon, { name: day.sky.icon, label: day.sky.label })),
            h(Garment, { kind: day.wear.garment }),
            h("div", { className: "wk-foot" },
              h("p", { className: "wk-wear" }, day.wear.label),
              h("p", { className: "wk-temps" }, h("b", null, deg(day.hi)), ` / ${deg(day.lo)}`))))),
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

  const TITLES = { today: "Today", week: "This week", places: "Places" };

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
