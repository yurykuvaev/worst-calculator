(function () {
  const grid = document.getElementById("grid");
  const display = document.getElementById("result");
  const expr = document.getElementById("expr");

  const buttons = [
    { label: "7", v: "7" }, { label: "8", v: "8" }, { label: "9", v: "9" }, { label: "÷", v: "/", cls: "op" },
    { label: "4", v: "4" }, { label: "5", v: "5" }, { label: "6", v: "6" }, { label: "×", v: "*", cls: "op" },
    { label: "1", v: "1" }, { label: "2", v: "2" }, { label: "3", v: "3" }, { label: "−", v: "-", cls: "op" },
    { label: "0", v: "0" }, { label: ".", v: "." }, { label: "C", v: "C", cls: "clear" }, { label: "+", v: "+", cls: "op" },
    { label: "=", v: "=", cls: "eq" },
  ];

  let buf = "";

  function place(el) {
    const w = grid.clientWidth - 70;
    const h = grid.clientHeight - 70;
    el.style.left = Math.max(0, Math.random() * w) + "px";
    el.style.top = Math.max(0, Math.random() * h) + "px";
  }

  function flee(el, scale) {
    const w = grid.clientWidth - 70;
    const h = grid.clientHeight - 70;
    const dx = (Math.random() - 0.5) * 240 * scale;
    const dy = (Math.random() - 0.5) * 240 * scale;
    const cx = parseFloat(el.style.left) + dx;
    const cy = parseFloat(el.style.top) + dy;
    el.style.left = Math.max(0, Math.min(w, cx)) + "px";
    el.style.top = Math.max(0, Math.min(h, cy)) + "px";
  }

  function swapTwoRandom() {
    const all = Array.from(grid.querySelectorAll(".drunk-btn"));
    if (all.length < 2) return;
    const i = Math.floor(Math.random() * all.length);
    let j = Math.floor(Math.random() * all.length);
    while (j === i) j = Math.floor(Math.random() * all.length);
    const a = all[i], b = all[j];
    const al = a.style.left, at = a.style.top;
    a.style.left = b.style.left; a.style.top = b.style.top;
    b.style.left = al; b.style.top = at;
  }

  function compute() {
    try {
      if (!buf) return;
      const sanitized = buf.replace(/[^0-9+\-*/.]/g, "");
      const r = Function('"use strict";return (' + sanitized + ")")();
      expr.textContent = buf + " =";
      display.textContent = String(r);
      buf = String(r);
    } catch (e) {
      display.textContent = "ERR";
      buf = "";
    }
  }

  function press(v) {
    if (v === "C") { buf = ""; expr.textContent = ""; display.textContent = "0"; return; }
    if (v === "=") { compute(); return; }
    buf += v;
    display.textContent = buf;
  }

  function build() {
    grid.innerHTML = "";
    buttons.forEach((b) => {
      const el = document.createElement("button");
      el.className = "drunk-btn " + (b.cls || "");
      el.textContent = b.label;
      el.dataset.v = b.v;
      grid.appendChild(el);
      place(el);

      const isEq = b.v === "=";
      const fleeScale = isEq ? 1.6 : 1.0;

      el.addEventListener("mouseenter", () => {
        if (Math.random() < (isEq ? 0.85 : 0.5)) flee(el, fleeScale);
        if (Math.random() < 0.25) swapTwoRandom();
      });

      el.addEventListener("click", () => press(b.v));
    });
  }

  build();
  window.addEventListener("resize", build);

  setInterval(() => {
    if (Math.random() < 0.15) swapTwoRandom();
  }, 1500);
})();
