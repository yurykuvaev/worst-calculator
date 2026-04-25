(function () {
  const expr = document.getElementById("expr");
  const result = document.getElementById("result");
  const modal = document.getElementById("modal");
  const targetDigit = document.getElementById("targetDigit");
  const riddleQ = document.getElementById("riddleQ");
  const riddleA = document.getElementById("riddleA");
  const riddleErr = document.getElementById("riddleErr");
  const submit = document.getElementById("submit");
  const cancel = document.getElementById("cancel");

  let buf = "";
  let pendingDigit = null;
  let askCount = 0;

  function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

  function makeRiddle(target) {
    askCount += 1;
    const tier = Math.min(4, Math.floor(askCount / 3));

    if (tier === 0) {
      const a = rand(0, target);
      const b = target - a;
      return { q: `${a} + ${b} = ?`, ans: target };
    }
    if (tier === 1) {
      const a = target + rand(1, 9);
      return { q: `${a} − ${a - target} = ?`, ans: target };
    }
    if (tier === 2) {
      const m = rand(1, 9);
      const product = target * m;
      return { q: `${product} ÷ ${m} = ?  (integer division)`, ans: target };
    }
    if (tier === 3) {
      const a = rand(2, 9);
      const b = rand(2, 9);
      return { q: `((${a} × ${b}) − (${a * b - target})) = ?`, ans: target };
    }
    const noise = rand(10, 99);
    return { q: `((${noise} × 0) + ${target} + 7) − 7 = ?`, ans: target };
  }

  function ask(d) {
    pendingDigit = d;
    targetDigit.textContent = d;
    const { q, ans } = makeRiddle(Number(d));
    riddleQ.textContent = q;
    riddleA.value = "";
    riddleErr.textContent = "";
    modal.classList.add("open");
    setTimeout(() => riddleA.focus(), 50);
    submit.onclick = () => {
      if (Number(riddleA.value) === ans) {
        modal.classList.remove("open");
        buf += pendingDigit;
        result.textContent = buf;
        pendingDigit = null;
      } else {
        riddleErr.textContent = "Wrong. The answer was the digit you literally clicked. Try again.";
        riddleA.value = "";
        riddleA.focus();
      }
    };
  }

  cancel.addEventListener("click", () => {
    modal.classList.remove("open");
    pendingDigit = null;
  });
  riddleA.addEventListener("keydown", (e) => { if (e.key === "Enter") submit.click(); });

  document.querySelectorAll("button[data-d]").forEach((b) => {
    b.addEventListener("click", () => ask(b.dataset.d));
  });

  document.querySelectorAll("button[data-op]").forEach((b) => {
    b.addEventListener("click", () => {
      if (!buf) return;
      buf += b.dataset.op;
      result.textContent = buf;
    });
  });

  document.getElementById("clr").addEventListener("click", () => {
    buf = ""; expr.textContent = ""; result.textContent = "0";
  });

  document.getElementById("eq").addEventListener("click", () => {
    try {
      const sanitized = buf.replace(/[^0-9+\-*/.]/g, "");
      const r = Function('"use strict";return (' + sanitized + ")")();
      expr.textContent = buf + " =";
      result.textContent = String(r);
      buf = String(r);
    } catch {
      result.textContent = "ERR"; buf = "";
    }
  });
})();
