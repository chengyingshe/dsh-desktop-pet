const inject = [];
const DEFAULT_CHARACTER_ASSETS = {};

const DEFAULT_CHARACTER = {
  id: "shinchan",
  name: "小新",
  size: 150,
  assets: DEFAULT_CHARACTER_ASSETS
};

const PET_ART = `<svg viewBox="0 0 220 250" aria-hidden="true"><g stroke="#171815" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M48 107C25 91 18 69 30 60c10-7 15 12 22 16-3-18 6-25 13-16 5 7 3 20 2 28" fill="#f4bf98"/><path d="M62 134c-5 27-10 55-5 73h58c8 0 13-7 15-15 3 9 9 15 18 15h44c1-27-5-55-12-75z" fill="#ef2b22"/><path d="M75 203v30h31l5-31m45 1 5 30h31v-29" fill="#f7e84c"/><path d="M75 232v10h31l-4-9m59 0-1 9h33l-9-10" fill="#fff"/><path d="M70 242c-10 0-20 1-28 6h68c-4-5-10-7-18-7m69 1c-8 0-14 2-18 7h68c-7-5-17-7-27-7" fill="#ffd000"/><path d="M47 96C43 40 74 11 126 13c46 2 76 32 76 77 17-10 30 0 27 18-3 19-19 27-37 18-24 20-54 29-91 28-42-1-65-20-54-58z" fill="#f4bf98"/><path d="M59 54c4-39 35-46 69-41 35-1 63 19 70 50-18-5-22-20-34-25-3 12-16 8-26-5-11 15-23 15-34-2-13 13-27 18-45 23z" fill="#171815"/><ellipse cx="91" cy="87" rx="25" ry="31" fill="#171815"/><ellipse cx="154" cy="87" rx="25" ry="31" fill="#171815"/><ellipse cx="97" cy="82" rx="8" ry="10" fill="#fff" stroke="none"/><ellipse cx="160" cy="82" rx="8" ry="10" fill="#fff" stroke="none"/><path d="M72 55q19-17 37 3m22 0q18-18 39-2" fill="none"/><path d="M109 130q11 5 20-2" fill="none" stroke-width="4"/><path d="M192 133c16 19 14 50 3 60-8 7-20 2-17-10 4-16 4-29-1-39" fill="#f4bf98"/></g></svg>`;
const STORE_KEY = "dsh-desktop-pet:v2";
const CHARACTER_KEY = "dsh-desktop-pet:character:v1";
const ASSET_STATES = ["idle", "walk", "run", "sleep", "think", "celebrate", "surprised", "drag", "talk"];
const STATE_LINES = {
  idle: ["小新待命中。", "今天也要认真摸鱼。", "有事尽管叫我。"],
  walk: ["我去旁边看看。", "散个步，马上回来。", "巡逻一下工作区。"],
  run: ["冲呀！", "灵感正在追我！", "让一让，让一让！"],
  sleep: ["先睡五分钟……", "嘘，我在充电。", "Zzz……"],
  think: ["正在思考，别催嘛。", "这个问题有点意思。", "让我想想看。"],
  celebrate: ["完成啦！", "干得漂亮。", "今天也很能干嘛。"],
  surprised: ["哎呀！", "你点到我啦。", "吓我一跳！"],
  drag: ["慢一点，我会晕的。", "要带我去哪？", "放我下来嘛。"],
  hide: ["我先躲起来。按 Alt+P 叫我。"]
};

const CSS = String.raw`
[data-dsh-desktop-pet] { --pet-size: 150px; position: fixed; left: 0; top: 0; width: clamp(104px, var(--pet-size), 220px); height: calc(clamp(104px, var(--pet-size), 220px) * 1.18); z-index: 2147482200; user-select: none; touch-action: none; cursor: grab; outline: none; filter: drop-shadow(0 12px 12px rgba(0,0,0,.2)); transform-origin: 50% 100%; contain: layout style; }
[data-dsh-desktop-pet][data-dragging="true"] { cursor: grabbing; }
.dsh-pet-stage { position: absolute; inset: 0; transform-origin: 50% 100%; }
.dsh-pet-image { position: absolute; inset: 0; display: grid; place-items: end center; pointer-events: none; transform-origin: 50% 100%; }
.dsh-pet-image img, .dsh-pet-image svg { display: block; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; overflow: visible; }
.dsh-pet-shadow { position: absolute; z-index: -1; left: 19%; right: 18%; bottom: 1px; height: 12px; border-radius: 50%; background: rgba(15,23,42,.2); filter: blur(3px); }
.dsh-pet-bubble { position: absolute; right: 80%; bottom: 76%; width: max-content; max-width: min(230px, 54vw); padding: 9px 12px; color: #202124; background: rgba(255,255,255,.97); border: 1px solid rgba(26,26,26,.14); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.15); font: 600 13px/1.45 ui-sans-serif, system-ui, -apple-system, sans-serif; letter-spacing: 0; opacity: 0; transform: translateY(7px) scale(.96); transform-origin: 100% 100%; pointer-events: none; transition: opacity .18s ease, transform .18s ease; }
.dsh-pet-bubble::after { content: ""; position: absolute; right: 13px; bottom: -7px; width: 12px; height: 12px; background: inherit; border-right: inherit; border-bottom: inherit; transform: rotate(45deg); }
[data-speech="true"] .dsh-pet-bubble { opacity: 1; transform: translateY(0) scale(1); }
.dsh-pet-menu { position: absolute; right: 74%; bottom: 27%; display: none; width: 190px; padding: 5px; background: rgba(255,255,255,.98); color: #202124; border: 1px solid rgba(26,26,26,.14); border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,.2); font: 500 13px/1.2 ui-sans-serif, system-ui, sans-serif; }
[data-menu="true"] .dsh-pet-menu { display: grid; }
.dsh-pet-menu button { border: 0; padding: 9px 10px; border-radius: 5px; background: transparent; color: inherit; text-align: left; font: inherit; cursor: pointer; }
.dsh-pet-menu button:hover, .dsh-pet-menu button:focus-visible { background: rgba(15,23,42,.08); outline: none; }
.dsh-pet-status { position: absolute; right: 7%; bottom: 5%; min-width: 22px; height: 22px; padding: 0 6px; display: grid; place-items: center; border-radius: 11px; background: #fff; color: #111827; box-shadow: 0 2px 8px rgba(0,0,0,.2); font: 700 11px/1 system-ui; pointer-events: none; }
.dsh-pet-file { display: none; }
[data-state="idle"] .dsh-pet-stage { animation: dsh-pet-breathe 2.8s ease-in-out infinite; }
[data-state="walk"] .dsh-pet-stage { animation: dsh-pet-walk .55s ease-in-out infinite; }
[data-state="run"] .dsh-pet-stage { animation: dsh-pet-run .28s ease-in-out infinite; }
[data-state="sleep"] .dsh-pet-stage { animation: dsh-pet-sleep 3s ease-in-out infinite; }
[data-state="think"] .dsh-pet-stage { animation: dsh-pet-think 1.2s ease-in-out infinite; }
[data-state="celebrate"] .dsh-pet-stage { animation: dsh-pet-celebrate .52s cubic-bezier(.2,.8,.3,1) infinite; }
[data-state="surprised"] .dsh-pet-stage { animation: dsh-pet-surprise .48s cubic-bezier(.2,.9,.2,1); }
[data-state="drag"] .dsh-pet-stage { animation: dsh-pet-drag .45s ease-in-out infinite; }
[data-facing="left"] .dsh-pet-image { transform: scaleX(-1); }
@keyframes dsh-pet-breathe { 0%,100% { transform: translateY(0) rotate(-1deg) scale(1); } 50% { transform: translateY(-4px) rotate(1deg) scale(1.015); } }
@keyframes dsh-pet-walk { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
@keyframes dsh-pet-run { 0%,100% { transform: translateY(0) rotate(-5deg) scaleY(.98); } 50% { transform: translateY(-13px) rotate(5deg) scaleY(1.02); } }
@keyframes dsh-pet-sleep { 0%,100% { transform: translateY(9px) rotate(-7deg) scaleY(.95); } 50% { transform: translateY(11px) rotate(-6deg) scaleY(.92); } }
@keyframes dsh-pet-think { 0%,100% { transform: rotate(-2deg); } 50% { transform: translateY(-3px) rotate(3deg); } }
@keyframes dsh-pet-celebrate { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-18px) rotate(7deg) scale(1.04); } }
@keyframes dsh-pet-surprise { 0% { transform: scale(1); } 35% { transform: translateY(-20px) scale(1.12,.9); } 70% { transform: translateY(2px) scale(.94,1.08); } 100% { transform: scale(1); } }
@keyframes dsh-pet-drag { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
@media (max-width: 700px) { [data-dsh-desktop-pet] { --pet-size: 108px !important; } .dsh-pet-menu { right: 55%; } }
@media (prefers-reduced-motion: reduce) { [data-dsh-desktop-pet] .dsh-pet-stage { animation-duration: 2s !important; animation-iteration-count: 1 !important; } }
`;

function loadJson(key, fallback) {
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { return { ...fallback }; }
}
function saveJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function apply(ctx) {
  ctx.effect(() => {
    if (document.querySelector("[data-dsh-desktop-pet]")) return;
    const style = document.createElement("style");
    style.dataset.dshDesktopPetStyle = "";
    style.textContent = CSS;
    document.head.appendChild(style);

    const pet = document.createElement("div");
    pet.dataset.dshDesktopPet = "";
    pet.dataset.state = "idle";
    pet.dataset.facing = "right";
    pet.dataset.speech = "false";
    pet.dataset.menu = "false";
    pet.setAttribute("role", "button");
    pet.setAttribute("tabindex", "0");
    pet.innerHTML = `<div class="dsh-pet-bubble" role="status" aria-live="polite"></div><div class="dsh-pet-menu" role="menu"><button type="button" data-action="talk">和宠物说话</button><button type="button" data-action="walk">出去走走</button><button type="button" data-action="sleep">睡一会儿</button><button type="button" data-action="asset">更换当前动作图片</button><button type="button" data-action="reset-asset">恢复默认形象</button><button type="button" data-action="sound">关闭提示音</button><button type="button" data-action="hide">暂时隐藏</button></div><input class="dsh-pet-file" type="file" accept="image/png,image/webp,image/gif,image/jpeg,image/svg+xml"><div class="dsh-pet-stage"><div class="dsh-pet-shadow"></div><div class="dsh-pet-image"></div><span class="dsh-pet-status" aria-hidden="true">闲</span></div>`;
    document.body.appendChild(pet);

    const bubble = pet.querySelector(".dsh-pet-bubble");
    const image = pet.querySelector(".dsh-pet-image");
    const status = pet.querySelector(".dsh-pet-status");
    const menu = pet.querySelector(".dsh-pet-menu");
    const fileInput = pet.querySelector(".dsh-pet-file");
    const soundButton = pet.querySelector('[data-action="sound"]');
    const prefs = loadJson(STORE_KEY, { x: innerWidth - 176, y: innerHeight - 202, hidden: false, sound: true, roam: true });
    let character = loadJson(CHARACTER_KEY, DEFAULT_CHARACTER);
    character.assets = character.assets || {};
    let state = "idle";
    let assetTargetState = "idle";
    let dragging = false;
    let moved = false;
    let pointerId = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let speechTimer = 0;
    let stateTimer = 0;
    let roamTimer = 0;
    let inactivityTimer = 0;
    let lastActivity = Date.now();
    let runningObserved = false;
    const timers = new Set();
    const later = (fn, ms) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };

    function renderImage(next = state) {
      const asset = character.assets[next] || character.assets.idle;
      image.replaceChildren();
      if (asset) {
        const img = document.createElement("img");
        img.src = asset;
        img.alt = `${character.name || "桌面宠物"}的${next}动作`;
        img.draggable = false;
        img.onerror = () => { image.innerHTML = PET_ART; };
        image.appendChild(img);
      } else {
        image.innerHTML = PET_ART;
      }
      pet.style.setProperty("--pet-size", `${clamp(Number(character.size) || 150, 104, 220)}px`);
      pet.setAttribute("aria-label", `桌面宠物${character.name || ""}。单击互动，拖动移动，右键打开菜单。Alt+P 显示或隐藏。`);
    }
    function bounds() {
      return { maxX: Math.max(8, innerWidth - pet.offsetWidth - 8), maxY: Math.max(8, innerHeight - pet.offsetHeight - 8) };
    }
    function place(x, y, persist = false) {
      const b = bounds();
      prefs.x = clamp(x, 8, b.maxX);
      prefs.y = clamp(y, 8, b.maxY);
      pet.style.transform = `translate3d(${prefs.x}px, ${prefs.y}px, 0)`;
      if (persist) saveJson(STORE_KEY, prefs);
    }
    function speak(text, duration = 2800) {
      window.clearTimeout(speechTimer);
      bubble.textContent = text;
      pet.dataset.speech = "true";
      speechTimer = window.setTimeout(() => { pet.dataset.speech = "false"; }, duration);
    }
    function beep(frequency = 520, duration = 55) {
      if (!prefs.sound) return;
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        const audio = new Audio();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.025, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration / 1000);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(); oscillator.stop(audio.currentTime + duration / 1000);
        oscillator.onended = () => audio.close();
      } catch {}
    }
    function setState(next, line, duration = 0) {
      window.clearTimeout(stateTimer);
      state = next;
      pet.dataset.state = next;
      status.textContent = ({ idle: "闲", walk: "走", run: "跑", sleep: "睡", think: "想", celebrate: "好", surprised: "!", drag: "移", talk: "说" })[next] || "闲";
      renderImage(next);
      if (line) speak(line);
      if (duration > 0) stateTimer = window.setTimeout(() => setState("idle"), duration);
    }
    function animateMove(targetX, targetY, fast = false) {
      if (dragging || prefs.hidden) return;
      const startX = prefs.x, startY = prefs.y;
      const dx = targetX - startX, dy = targetY - startY;
      pet.dataset.facing = dx < 0 ? "left" : "right";
      setState(fast ? "run" : "walk", pick(STATE_LINES[fast ? "run" : "walk"]));
      const started = performance.now();
      const duration = clamp(Math.hypot(dx, dy) * (fast ? 2.4 : 4), 650, fast ? 1800 : 3200);
      const tick = (now) => {
        if (dragging || state === "sleep") return;
        const t = clamp((now - started) / duration, 0, 1);
        const eased = .5 - Math.cos(Math.PI * t) / 2;
        place(startX + dx * eased, startY + dy * eased);
        if (t < 1) requestAnimationFrame(tick); else { saveJson(STORE_KEY, prefs); setState("idle"); }
      };
      requestAnimationFrame(tick);
    }
    function scheduleRoam() {
      window.clearTimeout(roamTimer);
      roamTimer = window.setTimeout(() => {
        if (prefs.roam && !dragging && state === "idle" && Date.now() - lastActivity > 8000) {
          const b = bounds();
          animateMove(8 + Math.random() * (b.maxX - 8), Math.max(8, b.maxY - Math.random() * 65), Math.random() > .78);
        }
        scheduleRoam();
      }, 12000 + Math.random() * 10000);
    }
    function activity() {
      lastActivity = Date.now();
      if (state === "sleep") setState("idle", "醒啦，继续干活。", 1500);
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        if (!dragging && !runningObserved) setState("sleep", pick(STATE_LINES.sleep));
      }, 90000);
    }
    function observeConversation() {
      const text = document.body.innerText;
      const running = /停止生成|停止响应|Stop generating|正在运行|思考中/.test(text);
      if (running && !runningObserved) {
        runningObserved = true;
        setState("think", pick(STATE_LINES.think));
      } else if (!running && runningObserved) {
        runningObserved = false;
        setState("celebrate", pick(STATE_LINES.celebrate), 3600);
        beep(720, 90);
      }
    }

    const observer = new MutationObserver(() => observeConversation());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    const onResize = () => requestAnimationFrame(() => place(prefs.x, prefs.y, true));
    const onActivity = () => activity();
    const onPointerDown = (event) => {
      if (event.button !== 0 || event.target.closest(".dsh-pet-menu")) return;
      dragging = true; moved = false; pointerId = event.pointerId;
      const rect = pet.getBoundingClientRect(); dragOffsetX = event.clientX - rect.left; dragOffsetY = event.clientY - rect.top;
      pet.setPointerCapture(event.pointerId); pet.dataset.dragging = "true";
      setState("drag", pick(STATE_LINES.drag));
    };
    const onPointerMove = (event) => {
      if (!dragging || event.pointerId !== pointerId) return;
      moved = moved || Math.abs(event.movementX) + Math.abs(event.movementY) > 2;
      place(event.clientX - dragOffsetX, event.clientY - dragOffsetY);
    };
    const onPointerUp = (event) => {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false; delete pet.dataset.dragging; saveJson(STORE_KEY, prefs); setState("idle");
      if (!moved) { setState("surprised", pick(STATE_LINES.surprised), 1100); beep(); }
    };
    const onDoubleClick = () => { setState("celebrate", pick(STATE_LINES.celebrate), 3300); beep(780, 100); };
    const onContext = (event) => { event.preventDefault(); pet.dataset.menu = pet.dataset.menu === "true" ? "false" : "true"; };
    const onDocumentPointer = (event) => { if (!pet.contains(event.target)) pet.dataset.menu = "false"; };
    const toggleVisible = () => {
      prefs.hidden = !prefs.hidden; pet.hidden = prefs.hidden; saveJson(STORE_KEY, prefs);
      if (!prefs.hidden) { place(prefs.x, prefs.y); speak("我回来啦！"); }
    };
    const onKey = (event) => {
      if (event.altKey && event.key.toLowerCase() === "p") { event.preventDefault(); toggleVisible(); return; }
      if (document.activeElement !== pet) return;
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setState("surprised", pick(STATE_LINES.surprised), 1100); }
      const step = event.shiftKey ? 40 : 12;
      if (event.key === "ArrowLeft") place(prefs.x - step, prefs.y, true);
      if (event.key === "ArrowRight") place(prefs.x + step, prefs.y, true);
      if (event.key === "ArrowUp") place(prefs.x, prefs.y - step, true);
      if (event.key === "ArrowDown") place(prefs.x, prefs.y + step, true);
    };
    const onFile = async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      try {
        character.assets[assetTargetState] = await readFile(file);
        saveJson(CHARACTER_KEY, character);
        renderImage(state);
        speak(`已替换${assetTargetState}动作图片。`);
      } catch { speak("图片读取失败，请换一张试试。"); }
      fileInput.value = "";
    };
    const onMenu = (event) => {
      const button = event.target.closest("button[data-action]"); if (!button) return;
      const action = button.dataset.action; pet.dataset.menu = "false";
      if (action === "talk") setState("talk", pick(STATE_LINES.idle), 1400);
      if (action === "walk") { const b = bounds(); animateMove(Math.random() * b.maxX, b.maxY - Math.random() * 50); }
      if (action === "sleep") setState("sleep", pick(STATE_LINES.sleep));
      if (action === "asset") { assetTargetState = state; fileInput.click(); speak(`请选择${assetTargetState}动作的图片。`); }
      if (action === "reset-asset") { character = { ...DEFAULT_CHARACTER, assets: {} }; localStorage.removeItem(CHARACTER_KEY); renderImage(); speak("已恢复默认形象。"); }
      if (action === "sound") { prefs.sound = !prefs.sound; soundButton.textContent = prefs.sound ? "关闭提示音" : "开启提示音"; saveJson(STORE_KEY, prefs); speak(prefs.sound ? "提示音开启。" : "安静模式开启。"); }
      if (action === "hide") { speak(STATE_LINES.hide[0], 800); later(toggleVisible, 750); }
    };
    const onCharacterChange = (event) => {
      const detail = event.detail || {};
      if (detail.name) character.name = String(detail.name);
      if (detail.size) character.size = clamp(Number(detail.size) || 150, 104, 220);
      if (detail.assets && typeof detail.assets === "object") {
        character.assets = { ...character.assets, ...Object.fromEntries(Object.entries(detail.assets).filter(([key, value]) => ASSET_STATES.includes(key) && typeof value === "string")) };
      }
      saveJson(CHARACTER_KEY, character);
      renderImage();
      speak(`${character.name || "新伙伴"}已就位。`);
    };

    pet.addEventListener("pointerdown", onPointerDown);
    pet.addEventListener("pointermove", onPointerMove);
    pet.addEventListener("pointerup", onPointerUp);
    pet.addEventListener("pointercancel", onPointerUp);
    pet.addEventListener("dblclick", onDoubleClick);
    pet.addEventListener("contextmenu", onContext);
    pet.addEventListener("keydown", onKey);
    menu.addEventListener("click", onMenu);
    fileInput.addEventListener("change", onFile);
    document.addEventListener("pointerdown", onDocumentPointer, true);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onActivity, true);
    document.addEventListener("keydown", onActivity, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("dsh-desktop-pet:set-character", onCharacterChange);
    soundButton.textContent = prefs.sound ? "关闭提示音" : "开启提示音";
    pet.hidden = prefs.hidden;
    renderImage();
    place(prefs.x, prefs.y);
    if (!prefs.hidden) speak(`嗨，我是${character.name || "你的桌面宠物"}。右键可以打开菜单。`, 4200);
    scheduleRoam(); activity(); observeConversation();

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(speechTimer); window.clearTimeout(stateTimer); window.clearTimeout(roamTimer); window.clearTimeout(inactivityTimer);
      document.removeEventListener("pointerdown", onDocumentPointer, true);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onActivity, true);
      document.removeEventListener("keydown", onActivity, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("dsh-desktop-pet:set-character", onCharacterChange);
      pet.remove(); style.remove();
    };
  }, "dsh-desktop-pet: mount");
}

exports.inject = inject;
exports.apply = apply;
