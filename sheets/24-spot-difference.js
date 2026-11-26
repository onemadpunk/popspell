  /* ===================== Spot the difference =====================
     Tutors use spot-the-difference sheets for looking closely, talking and taking turns. These are PopSpell's
     own: line drawings built from simple shapes (so they print clearly in black and white and can be coloured
     in), eight scenes at three sizes (5, 7 or 10 differences). A fresh pair of pictures is drawn each print, and
     the answers page circles every difference on the second picture and says what changed. */

  const SL = `fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const SD = `fill="#222"`;
  const sdPts = (n, r1, r2, rot = -90) => Array.from({ length: n * 2 }, (_, i) => { const a = (rot + i * 180 / n) * Math.PI / 180, r = i % 2 ? r2 : r1; return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const sdRing = (n, r, f) => Array.from({ length: n }, (_, i) => { const a = (i * 360 / n - 90) * Math.PI / 180; return f(r * Math.cos(a), r * Math.sin(a), a); }).join("");
  const sdFace = (y = 0) => `<circle cx="-4" cy="${y - 3}" r="1.6" ${SD}/><circle cx="4" cy="${y - 3}" r="1.6" ${SD}/><path d="M-4 ${y + 3} Q0 ${y + 7} 4 ${y + 3}" ${SL}/>`;
  // Each kind: a name, a drawing (p holds the changes, all off in the first picture), and changes it can show.
  const SPOT = {
    sun: { n: "sun", d: p => `<circle r="10" ${SL}/>${sdRing(p.few ? 6 : 8, 1, (x, y) => `<line x1="${x * 14}" y1="${y * 14}" x2="${x * 22}" y2="${y * 22}" ${SL}/>`)}${p.face ? sdFace(2) : ""}`, t: [["few", "has fewer rays"], ["face", "has a face"]] },
    cloud: { n: "cloud", d: p => `<path d="M-20 6 a8 8 0 0 1 2-15 a10 10 0 0 1 18-5 a9 9 0 0 1 16 6 a7 7 0 0 1 -2 14 z" ${SL}/>${p.rain ? `<path d="M-10 12 l-2 6 M0 12 l-2 6 M10 12 l-2 6" ${SL}/>` : ""}${p.bolt ? `<path d="M6 -24 l-4 6 h5 l-4 7" ${SL}/>` : ""}`, t: [["rain", "is raining"], ["bolt", "has a lightning bolt"]] },
    tree: { n: "tree", d: p => `<rect x="-4" y="6" width="8" height="20" ${SL}/><circle cy="-8" r="16" ${SL}/>${[[-7, -12], [6, -4], [2, -16]].slice(0, p.fewer ? 2 : 3).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" ${SL}/>`).join("")}${p.hole ? `<ellipse cy="15" rx="2" ry="3" ${SD}/>` : ""}`, t: [["fewer", "has one fewer apple"], ["hole", "has a hole in its trunk"]] },
    flower: { n: "flower", d: p => `<line y1="2" y2="26" ${SL}/>${p.noleaf ? "" : `<path d="M0 18 q8 -8 12 -4 q-6 6 -12 4" ${SL}/>`}<circle cy="-8" r="4" ${SL}/>${sdRing(p.five ? 5 : 6, 9, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${(y - 8).toFixed(1)}" r="4.5" ${SL}/>`)}`, t: [["five", "has fewer petals"], ["noleaf", "has lost its leaf"]] },
    house: { n: "house", d: p => `<rect x="-18" y="-4" width="36" height="28" ${SL}/><path d="M-22 -4 L0 -24 L22 -4" ${SL}/>${p.nochim ? "" : `<path d="M10 -14 v-8 h6 v13" ${SL}/>`}<rect x="-4" y="10" width="8" height="14" ${SL}/>${p.knob ? `<circle cx="2" cy="17" r="1" ${SD}/>` : ""}<rect x="-14" y="2" width="7" height="6" ${SL}/>${p.onewin ? "" : `<rect x="7" y="2" width="7" height="6" ${SL}/>`}`, t: [["nochim", "has no chimney"], ["onewin", "has a window missing"], ["knob", "has a door knob"]] },
    fish: { n: "fish", d: p => `<ellipse rx="16" ry="9" ${SL}/><path d="M14 0 L24 -8 L24 8 Z" ${SL}/><circle cx="-9" cy="-2" r="1.6" ${SD}/>${p.nostripe ? "" : `<path d="M-2 -8 q2 8 0 16 M4 -8 q2 8 0 16" ${SL}/>`}${p.bubble ? `<circle cx="-20" cy="-12" r="2" ${SL}/><circle cx="-24" cy="-19" r="3" ${SL}/>` : ""}`, t: [["nostripe", "has lost its stripes"], ["bubble", "is blowing bubbles"]] },
    star: { n: "star", d: p => `<polygon points="${sdPts(p.six ? 6 : 5, 18, 8)}" ${SL}/>${p.face ? sdFace(2) : ""}`, t: [["six", "has six points"], ["face", "has a face"]] },
    bird: { n: "bird", d: p => `<ellipse rx="10" ry="7" ${SL}/><circle cx="9" cy="-8" r="5" ${SL}/><circle cx="10" cy="-9" r="1.2" ${SD}/>${p.nobeak ? "" : `<path d="M14 -10 L19 -8 L14 -6" ${SL}/>`}<path d="M-4 -2 q4 6 8 0" ${SL}/><path d="M-10 0 l-6 -4 M-10 2 l-6 2" ${SL}/><path d="M-2 7 v6 M3 7 v6" ${SL}/>${p.worm ? `<path d="M19 -8 q2 4 0 6 q-2 3 1 5" ${SL}/>` : ""}`, t: [["nobeak", "has no beak"], ["worm", "has a worm in its beak"]] },
    boat: { n: "boat", d: p => `<path d="M-22 6 H22 L15 18 H-15 Z" ${SL}/><line y1="6" y2="-24" ${SL}/><path d="M2 -22 V2 H18 Z" ${SL}/>${p.flag ? `<path d="M0 -24 l-9 3 l9 3" ${SL}/>` : ""}${p.port ? `<circle cx="-8" cy="11" r="2.5" ${SL}/>` : ""}`, t: [["flag", "has a flag on its mast"], ["port", "has a round window"]] },
    snowman: { n: "snowman", d: p => `<circle cy="12" r="13" ${SL}/><circle cy="-8" r="8" ${SL}/>${[5, 12, 19].slice(0, p.two ? 2 : 3).map(y => `<circle cy="${y}" r="1.6" ${SD}/>`).join("")}<circle cx="-3" cy="-10" r="1.2" ${SD}/><circle cx="3" cy="-10" r="1.2" ${SD}/><path d="M0 -7 l6 1 l-6 1" ${SL}/>${p.nohat ? "" : `<path d="M-9 -15 h18 M-6 -15 v-8 h12 v8" ${SL}/>`}${p.scarf ? `<path d="M-7 -1 h14 M4 -1 v8" ${SL}/>` : ""}`, t: [["two", "has one fewer button"], ["nohat", "has lost its hat"], ["scarf", "has a scarf"]] },
    rocket: { n: "rocket", d: p => `<path d="M-8 18 V-8 L0 -26 L8 -8 V18 Z" ${SL}/><path d="M-8 8 L-15 20 L-8 18 M8 8 L15 20 L8 18" ${SL}/><circle cy="-6" r="3.5" ${SL}/>${p.onewin ? "" : `<circle cy="5" r="3.5" ${SL}/>`}${p.flame ? `<path d="M-5 20 l2 7 l3 -4 l3 4 l2 -7" ${SL}/>` : ""}`, t: [["onewin", "has one window fewer"], ["flame", "has flames coming out"]] },
    planet: { n: "planet", d: p => `<circle r="12" ${SL}/>${p.noring ? "" : `<ellipse rx="24" ry="6" ${SL} transform="rotate(-15)"/>`}<circle cx="-4" cy="-4" r="2.5" ${SL}/>${p.moon ? `<circle cx="22" cy="-18" r="4" ${SL}/>` : ""}`, t: [["noring", "has lost its ring"], ["moon", "has a little moon"]] },
    moon: { n: "moon", d: p => `<path d="M4 -18 A18 18 0 1 0 4 18 A14 14 0 1 1 4 -18 Z" ${SL}/>${p.face ? `<circle cx="-9" cy="-4" r="1.5" ${SD}/><path d="M-12 5 q3 3 6 0" ${SL}/>` : ""}${p.star ? `<polygon points="${sdPts(5, 5, 2)}" ${SL} transform="translate(16 -10)"/>` : ""}`, t: [["face", "has a face"], ["star", "has a star next to it"]] },
    balloon: { n: "balloon", d: p => `<ellipse cy="-8" rx="12" ry="15" ${SL}/><path d="M-2 7 h4 l-2 3 z" ${SL}/><path d="M0 10 q-4 ${p.short ? "4 0 8" : "6 0 10 q4 4 0 8"}" ${SL}/>${p.stripe ? `<path d="M-11 -4 q11 6 22 0" ${SL}/>` : ""}`, t: [["stripe", "has a stripe"], ["short", "has a shorter string"]] },
    kite: { n: "kite", d: p => `<path d="M0 -24 L14 -6 L0 12 L-14 -6 Z" ${SL}/>${p.nocross ? "" : `<path d="M0 -24 V12 M-14 -6 H14" ${SL}/>`}<path d="M0 12 q6 6 0 10 q-6 4 2 8" ${SL}/>${[[3, 16], [-2, 22], [2, 28]].slice(0, p.fewer ? 2 : 3).map(([x, y]) => `<path d="M${x - 3} ${y - 2} l6 4 m0 -4 l-6 4" ${SL}/>`).join("")}`, t: [["nocross", "has no cross on it"], ["fewer", "has one fewer bow on its tail"]] },
    butterfly: { n: "butterfly", d: p => `<line y1="-10" y2="12" ${SL}/><ellipse cx="-10" cy="-5" rx="10" ry="8" ${SL}/><ellipse cx="10" cy="-5" rx="10" ry="8" ${SL}/><ellipse cx="-8" cy="8" rx="7" ry="6" ${SL}/><ellipse cx="8" cy="8" rx="7" ry="6" ${SL}/>${p.nospot ? "" : `<circle cx="-10" cy="-5" r="3" ${SD}/><circle cx="10" cy="-5" r="3" ${SD}/>`}${p.noant ? "" : `<path d="M0 -10 q-3 -8 -7 -10 M0 -10 q3 -8 7 -10" ${SL}/>`}`, t: [["nospot", "has lost its spots"], ["noant", "has no feelers"]] },
    mushroom: { n: "mushroom", d: p => `<path d="M-18 0 A18 16 0 0 1 18 0 Z" ${SL}/><rect x="-6" y="0" width="12" height="18" ${SL}/>${[[-8, -6], [6, -9], [0, -2]].slice(0, p.fewer ? 1 : 3).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" ${SL}/>`).join("")}${p.door ? `<path d="M-3 18 v-7 a3 3 0 0 1 6 0 v7" ${SL}/>` : ""}`, t: [["fewer", "has fewer spots"], ["door", "has a tiny door"]] },
    bucket: { n: "bucket", d: p => `<path d="M-14 -8 H14 L10 18 H-10 Z" ${SL}/>${p.nohandle ? "" : `<path d="M-14 -8 Q0 -26 14 -8" ${SL}/>`}${p.stripe ? `<line x1="-12" y1="4" x2="12" y2="4" ${SL}/>` : ""}`, t: [["nohandle", "has no handle"], ["stripe", "has a stripe"]] },
    shell: { n: "shell", d: p => `<path d="M-18 8 Q0 -30 18 8 Q0 16 -18 8 Z" ${SL}/>${(p.three ? [-8, 0, 8] : [-12, -6, 0, 6, 12]).map(x => `<line x1="0" y1="10" x2="${x}" y2="${-4 - (12 - Math.abs(x)) * 0.6}" ${SL}/>`).join("")}`, t: [["three", "has fewer lines"]] },
    crab: { n: "crab", d: p => `<ellipse cy="4" rx="14" ry="8" ${SL}/><path d="M-5 -4 v-8 M5 -4 v-8" ${SL}/><circle cx="-5" cy="-13" r="2" ${SD}/><circle cx="5" cy="-13" r="2" ${SD}/><path d="M-14 2 l-6 -6 M-20 -4 a4 4 0 1 1 2 -6" ${SL}/>${p.oneclaw ? "" : `<path d="M14 2 l6 -6 M20 -4 a4 4 0 1 0 -2 -6" ${SL}/>`}<path d="M-10 10 l-6 6 M-4 12 l-3 7 M10 10 l6 6 M4 12 l3 7" ${SL}/>${p.smile ? `<path d="M-4 5 q4 4 8 0" ${SL}/>` : ""}`, t: [["oneclaw", "has lost a claw"], ["smile", "is smiling"]] },
    castle: { n: "sandcastle", d: p => `<rect x="-18" y="0" width="36" height="22" ${SL}/><path d="M-18 0 v-10 h10 v10 M8 0 v-10 h10 v10 M-5 0 v-16 h10 v16" ${SL}/>${p.noflag ? "" : `<path d="M0 -16 v-10 l7 3 l-7 3" ${SL}/>`}<path d="M-4 22 v-7 a4 4 0 0 1 8 0 v7" ${SL}/>${p.win ? `<rect x="-15" y="4" width="5" height="5" ${SL}/>` : ""}`, t: [["noflag", "has no flag"], ["win", "has a window"]] },
    umbrella: { n: "umbrella", d: p => `<path d="M-22 -2 A22 20 0 0 1 22 -2 Q16 -6 11 -2 Q5 -6 0 -2 Q-5 -6 -11 -2 Q-16 -6 -22 -2 Z" ${SL}/><path d="M0 -2 V20 q0 4 -4 4 q-3 0 -3 -3" ${SL}/>${p.nostripe ? "" : `<path d="M-11 -2 Q-8 -14 0 -22 M11 -2 Q8 -14 0 -22" ${SL}/>`}${p.ball ? `<circle cy="-24" r="2" ${SD}/>` : ""}`, t: [["nostripe", "has lost its stripes"], ["ball", "has a knob on top"]] },
    seaweed: { n: "seaweed", d: p => `<path d="M0 26 q-6 -10 0 -20 q6 -10 0 -20 q-4 -6 0 -10" ${SL}/>${[[0, 14, -1], [0, 4, 1], [0, -8, -1], [0, -18, 1]].slice(0, p.fewer ? 2 : 4).map(([x, y, s]) => `<path d="M${x} ${y} q${s * 8} -2 ${s * 10} -8 q${s * -6} 0 ${s * -10} 8" ${SL}/>`).join("")}`, t: [["fewer", "has fewer leaves"]] },
    chicken: { n: "hen", d: p => `<ellipse cy="4" rx="12" ry="10" ${SL}/><circle cx="10" cy="-8" r="6" ${SL}/><circle cx="11" cy="-9" r="1.2" ${SD}/><path d="M15 -9 l5 2 l-5 2" ${SL}/>${p.nocomb ? "" : `<path d="M6 -13 q1 -5 3 -1 q1 -5 3 -1 q2 -4 3 0" ${SL}/>`}<path d="M-12 0 l-6 -6 l2 8" ${SL}/><path d="M-3 13 v7 M3 13 v7" ${SL}/>${p.egg ? `<ellipse cx="-16" cy="16" rx="3.5" ry="5" ${SL}/>` : ""}`, t: [["nocomb", "has no comb on its head"], ["egg", "has laid an egg"]] },
    pig: { n: "pig", d: p => `<circle r="14" ${SL}/><path d="M-12 -8 l-2 -10 l9 5" ${SL}/>${p.noear ? "" : `<path d="M12 -8 l2 -10 l-9 5" ${SL}/>`}<ellipse cy="4" rx="6" ry="4" ${SL}/><circle cx="-2" cy="4" r="1" ${SD}/><circle cx="2" cy="4" r="1" ${SD}/><circle cx="-5" cy="-4" r="1.5" ${SD}/><circle cx="5" cy="-4" r="1.5" ${SD}/>${p.smile ? `<path d="M-5 10 q5 4 10 0" ${SL}/>` : ""}`, t: [["noear", "has lost an ear"], ["smile", "is smiling"]] },
    sheep: { n: "sheep", d: p => `<path d="M-16 4 a6 6 0 0 1 2 -12 a7 7 0 0 1 12 -4 a7 7 0 0 1 12 2 a6 6 0 0 1 4 12 a6 6 0 0 1 -8 6 h-16 a6 6 0 0 1 -6 -4 z" ${SL}/><ellipse cx="18" cy="-4" rx="5" ry="7" ${SL}/><circle cx="19" cy="-6" r="1.2" ${SD}/><path d="M-10 8 v10 M-3 8 v10 M4 8 v10 M10 8 v10" ${SL}/>${p.bell ? `<circle cx="17" cy="6" r="2.5" ${SL}/>` : ""}${p.tail ? `<circle cx="-20" cy="-2" r="2.5" ${SL}/>` : ""}`, t: [["bell", "has a bell"], ["tail", "has a tail"]] },
    car: { n: "car", d: p => `<path d="M-24 10 V0 L-14 -2 L-8 -12 H10 L16 -2 L24 0 V10 Z" ${SL}/><circle cx="-13" cy="11" r="5" ${SL}/><circle cx="13" cy="11" r="5" ${SL}/>${p.nodiv ? "" : `<line x1="1" y1="-12" x2="1" y2="-2" ${SL}/>`}${p.light ? `<circle cx="21" cy="3" r="2" ${SL}/>` : ""}`, t: [["nodiv", "has one big window instead of two"], ["light", "has a headlight"]] },
    lamp: { n: "lamp post", d: p => `<line y1="26" y2="-14" ${SL}/><path d="M-7 -14 h14 l-3 -8 h-8 z" ${SL}/><path d="M-6 26 h12" ${SL}/>${p.lit ? `<path d="M-10 -10 l-4 3 M10 -10 l4 3 M0 -8 v4" ${SL}/>` : ""}${p.sign ? `<rect x="0" y="0" width="10" height="7" ${SL}/>` : ""}`, t: [["lit", "is lit up"], ["sign", "has a sign on it"]] },
    lights: { n: "traffic light", d: p => `<rect x="-7" y="-24" width="14" height="32" rx="3" ${SL}/><line y1="8" y2="26" ${SL}/><circle cy="-17" r="3.5" ${p.top ? SD : SL}/>${p.nomid ? "" : `<circle cy="-8" r="3.5" ${SL}/>`}<circle cy="1" r="3.5" ${SL}/>`, t: [["top", "has its top light on"], ["nomid", "has a light missing"]] },
    present: { n: "present", d: p => `<rect x="-14" y="-6" width="28" height="24" ${SL}/><path d="M0 -6 V18 M-14 4 H14" ${SL}/>${p.nobow ? "" : `<path d="M0 -6 q-10 -10 -8 -2 z M0 -6 q10 -10 8 -2 z" ${SL}/>`}${p.tag ? `<rect x="6" y="8" width="6" height="5" ${SL}/>` : ""}`, t: [["nobow", "has lost its bow"], ["tag", "has a label"]] },
    snowflake: { n: "snowflake", d: p => sdRing(6, 18, (x, y) => `<line x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" ${SL}/>${p.nobranch ? "" : `<line x1="${(x * 0.55).toFixed(1)}" y1="${(y * 0.55).toFixed(1)}" x2="${(x * 0.55 + y * 0.25).toFixed(1)}" y2="${(y * 0.55 - x * 0.25).toFixed(1)}" ${SL}/>`}`) + (p.dot ? `<circle r="3" ${SL}/>` : ""), t: [["nobranch", "has lost its little branches"], ["dot", "has a circle in the middle"]] },
    apple: { n: "apple", d: p => `<path d="M0 -8 C-8 -16 -20 -10 -18 2 C-16 14 -6 20 0 16 C6 20 16 14 18 2 C20 -10 8 -16 0 -8 Z" ${SL}/><path d="M0 -8 q1 -6 4 -10" ${SL}/>${p.noleaf ? "" : `<path d="M3 -14 q8 -6 10 0 q-6 4 -10 0" ${SL}/>`}${p.bite ? `<path d="M14 -6 a4 4 0 0 0 2 8 a4 4 0 0 0 1 6" ${SL}/>` : ""}`, t: [["noleaf", "has no leaf"], ["bite", "has a bite out of it"]] },
    alien: { n: "alien", d: p => `<circle r="13" ${SL}/><path d="M-6 -12 l-4 -10 M6 -12 l4 -10" ${SL}/><circle cx="-10" cy="-23" r="2" ${SL}/>${p.oneant ? "" : `<circle cx="10" cy="-23" r="2" ${SL}/>`}${(p.two ? [-5, 5] : [-6, 0, 6]).map(x => `<circle cx="${x}" cy="-3" r="2.2" ${SD}/>`).join("")}<path d="M-5 6 q5 4 10 0" ${SL}/>`, t: [["two", "has two eyes instead of three"], ["oneant", "has lost the ball on an antenna"]] },
    ball: { n: "ball", d: p => `<circle r="12" ${SL}/><path d="M-12 0 q12 ${p.flat ? "0" : "8"} 24 0" ${SL}/>${p.star ? `<polygon points="${sdPts(5, 5, 2)}" ${SL} transform="translate(0 -5)"/>` : ""}`, t: [["star", "has a star on it"], ["flat", "has a straight line instead of a curved one"]] }
  };
  const SPOT_SKY = new Set(["sun", "cloud", "bird", "kite", "balloon", "moon", "star", "planet", "snowflake"]);
  const SPOT_THEMES = [
    { id: "garden", title: "In the garden", ground: "land", kinds: ["sun", "cloud", "tree", "flower", "butterfly", "mushroom", "house", "bird", "apple", "flower"] },
    { id: "beach", title: "At the beach", ground: "sand", kinds: ["sun", "cloud", "boat", "bucket", "shell", "crab", "castle", "umbrella", "bird", "ball"] },
    { id: "space", title: "In space", ground: "space", kinds: ["planet", "moon", "star", "rocket", "alien", "star", "planet", "rocket"] },
    { id: "farm", title: "On the farm", ground: "land", kinds: ["house", "tree", "chicken", "pig", "sheep", "sun", "flower", "car", "cloud"] },
    { id: "town", title: "In town", ground: "land", kinds: ["house", "car", "lamp", "lights", "tree", "bird", "cloud", "balloon", "house"] },
    { id: "sea", title: "Under the sea", ground: "sea", kinds: ["fish", "shell", "crab", "seaweed", "star", "fish", "seaweed"] },
    { id: "winter", title: "A winter's night", ground: "land", kinds: ["snowman", "snowflake", "tree", "house", "present", "star", "moon", "bird", "snowman"] },
    { id: "park", title: "In the park", ground: "land", kinds: ["kite", "balloon", "ball", "tree", "flower", "bird", "sun", "cloud", "butterfly", "umbrella"] }
  ];
  const SPOT_SIZES = [
    { k: 5, cols: 4, rows: 2, missing: true, lesson: "lesson-early-spot-the-difference", label: "5 differences" },
    { k: 7, cols: 4, rows: 3, missing: true, lesson: "lesson-first-spot-the-difference", label: "7 differences" },
    { k: 10, cols: 5, rows: 3, missing: false, lesson: "lesson-first-spot-the-difference", label: "10 differences" }
  ];
  const SPOT_GROUND = {
    land: `<path d="M0 198 H400" ${SL}/><path d="M30 198 l3 -5 l3 5 M120 198 l3 -5 l3 5 M250 198 l3 -5 l3 5 M350 198 l3 -5 l3 5" ${SL}/>`,
    sand: `<path d="M0 196 q25 -6 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" ${SL}/>`,
    sea: `<path d="M0 200 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" ${SL}/><path d="M0 6 q20 6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" ${SL}/>`,
    space: [[18, 30], [380, 22], [200, 8], [90, 200], [310, 196], [12, 150], [392, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" ${SD}/>`).join("")
  };
  const spotScene = (theme, size) => {
    const n = size.cols * size.rows, cw = 400 / size.cols, top = theme.ground === "sea" ? 16 : 6, chh = (190 - top) / size.rows;
    const s = Math.min(cw, chh) / 60 * 1.1;
    // Things in the sky (sun, clouds, birds, kites) go in the top row; the rest stand lower down
    const kinds = Array.from({ length: n }, () => pick(theme.kinds)).sort((a, b) => SPOT_SKY.has(b) - SPOT_SKY.has(a));
    const objs = kinds.map((kind, i) => ({ kind, x: cw * (i % size.cols + 0.5) + rand(13) - 6, y: top + chh * (Math.floor(i / size.cols) + 0.5) + rand(7) - 3 }));
    // Choose which objects change, and how: a toggle of its own, or (on the smaller sizes) missing altogether
    const changed = shuffle(objs.map((_, i) => i)).slice(0, size.k).sort((a, b) => a - b);
    changed.forEach(i => { const o = objs[i], opts = SPOT[o.kind].t.map(t => t[0]).concat(size.missing ? ["missing"] : []); o.change = pick(opts); });
    const count = k => objs.filter(o => o.kind === k).length;
    const draw = (two, marks) => `<svg class="sd-pic" viewBox="0 0 400 210" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="398" height="208" rx="6" ${SL}/>${SPOT_GROUND[theme.ground]}${objs.map(o => {
      if (two && o.change === "missing") return "";
      const p = two && o.change ? { [o.change]: true } : {};
      return `<g transform="translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) scale(${s.toFixed(3)})">${SPOT[o.kind].d(p)}</g>`;
    }).join("")}${marks ? changed.map((i, j) => { const o = objs[i]; return `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(30 * s).toFixed(1)}" fill="none" stroke="#d22" stroke-width="2.5" stroke-dasharray="5 3"/><text x="${(o.x + 22 * s).toFixed(1)}" y="${(o.y - 22 * s).toFixed(1)}" font-size="13" font-weight="700" fill="#d22">${j + 1}</text>`; }).join("") : ""}</svg>`;
    const say = changed.map(i => { const o = objs[i], nm = SPOT[o.kind].n, who = count(o.kind) > 1 ? `One ${nm}` : `The ${nm}`;
      return o.change === "missing" ? `${who} is missing.` : `${who} ${SPOT[o.kind].t.find(t => t[0] === o.change)[1]}.`; });
    return { one: draw(false), two: draw(true), marked: draw(true, true), say };
  };
  SPOT_THEMES.forEach(theme => SPOT_SIZES.forEach(size => {
    add(`paper-spot-${theme.id}-${size.k}`, size.lesson, `Spot the difference (${size.k}): ${theme.title}`,
      `Two line drawings of ${theme.title.toLowerCase().replace(/^(in|at|on|under) /, "")}: find the ${size.k} differences and circle them. New pictures each time you print; the answers page circles each one. They can be coloured in afterwards.`, (who, h) => {
        const sc = spotScene(theme, size);
        return {
          pupil: `${h.sheetHead(`Spot the difference: ${theme.title}`, who)}
            <p class="sd-say"><b>Find ${size.k} differences.</b> Look at the top picture, then the bottom one. Circle each difference on the bottom picture and colour a star.</p>
            ${sc.one}${sc.two}
            <p class="sd-found">Found: ${"☆ ".repeat(size.k)}</p>`,
          answers: answersPage(h, `Spot the difference: ${theme.title}`, sc.say, `Talk about each one: "What's different about the…?" Naming the change ("it has fewer petals") builds vocabulary as well as looking skills.`, sc.marked)
        };
      });
  }));
