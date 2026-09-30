/* Loads Baseline components that aren't in the prebuilt bundle straight from their
   source files onto window.Baseline. Adapted from Baseline's layouts/_source.js so it
   works from the project root. Usage: await BaselineSource(["SegmentedControl"]). */
window.BaselineSource = async function (names, base = "baseline/components/") {
  const DIRS = {
    Slider: "forms", SegmentedControl: "forms", Stepper: "forms", SearchField: "forms",
    Combobox: "forms", Calendar: "forms", FAB: "forms",
    Carousel: "data", Divider: "data", Kbd: "data", TranscriptRow: "data",
    Alert: "feedback",
    Sidebar: "navigation", NavigationMenu: "navigation",
    Menu: "overlay", Popover: "overlay",
  };
  await Promise.all(names.map(async (n) => {
    if (window.Baseline[n]) return;
    const res = await fetch(`${base}${DIRS[n]}/${n}.jsx`);
    if (!res.ok) throw new Error(`missing source for ${n}`);
    const impl = (await res.text())
      .replace(/^import .*$/gm, "")
      .replace(/export function/g, "function")
      .replace(/^export /gm, "");
    window.Baseline[n] = new Function(impl + ";return " + n + ";")();
  }));
};
