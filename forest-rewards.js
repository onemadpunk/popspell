/* Counting Canopy's free, pupil-owned forest collection. Kept inside existing progress sync. */
(function () {
  const ITEMS = [
    { id: "lantern", name: "Glow lantern", icon: "🏮", cost: 4, description: "Light the path for Pip." },
    { id: "flowers", name: "Flower garden", icon: "🌼", cost: 6, description: "Give the forest friends a bright patch." },
    { id: "treehouse", name: "Owl's treehouse", icon: "🏡", cost: 10, description: "Build a cosy place for the owl." },
    { id: "rainbow", name: "Rainbow bridge", icon: "🌈", cost: 14, description: "Colour the crossing over the stream." }
  ];
  const byId = Object.fromEntries(ITEMS.map(item => [item.id, item]));

  function normalise(value) {
    const source = value && typeof value === "object" ? value : {};
    const runs = {};
    for (const [id, count] of Object.entries(source.runs || {})) {
      if (/^[a-z0-9-]{8,80}$/i.test(id) && Number.isInteger(count) && count > 0 && count <= 20)
        runs[id] = count;
    }
    const owned = new Set(Array.isArray(source.unlocked) ? source.unlocked : []);
    return { runs, unlocked: ITEMS.filter(item => owned.has(item.id)).map(item => item.id) };
  }

  function merge(a, b) {
    const left = normalise(a), right = normalise(b);
    const runs = { ...left.runs };
    for (const [id, count] of Object.entries(right.runs)) runs[id] = Math.max(runs[id] || 0, count);
    return normalise({ runs, unlocked: left.unlocked.concat(right.unlocked) });
  }

  function earned(value) {
    return Object.values(normalise(value).runs).reduce((total, count) => total + count, 0);
  }

  function balance(value) {
    const state = normalise(value);
    return Math.max(0, earned(state) - state.unlocked.reduce((total, id) => total + byId[id].cost, 0));
  }

  function award(value, runId, clearings) {
    const state = normalise(value);
    if (!/^[a-z0-9-]{8,80}$/i.test(runId) || !Number.isInteger(clearings) || clearings < 1 || clearings > 20)
      return state;
    state.runs[runId] = Math.max(state.runs[runId] || 0, clearings);
    return state;
  }

  function unlock(value, itemId) {
    const state = normalise(value), item = byId[itemId];
    if (!item || state.unlocked.includes(itemId) || balance(state) < item.cost) return state;
    state.unlocked.push(itemId);
    return normalise(state);
  }

  window.PopForest = { ITEMS, normalise, merge, earned, balance, award, unlock };
})();
