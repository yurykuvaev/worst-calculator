(function () {
  const expr = document.getElementById("expr");
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  const modal = document.getElementById("modal");
  const confirmTitle = document.getElementById("confirmTitle");
  const confirmBody = document.getElementById("confirmBody");
  const yes = document.getElementById("yes");
  const no = document.getElementById("no");

  let buf = "";
  let busy = false;

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function setBusy(msg) {
    busy = true;
    status.innerHTML = `<span class="spinner"></span>${msg}`;
  }
  function clearBusy() {
    busy = false;
    status.innerHTML = "&nbsp;";
  }

  function delayed(action, label) {
    if (busy) return;
    const ms = Math.floor(rand(400, 2000));
    setBusy(`${label}… (${(ms / 1000).toFixed(1)}s)`);
    setTimeout(() => {
      clearBusy();
      action();
    }, ms);
  }

  function confirm(title, body) {
    return new Promise((resolve) => {
      confirmTitle.textContent = title;
      confirmBody.textContent = body;
      modal.classList.add("open");
      const onYes = () => { cleanup(); resolve(true); };
      const onNo = () => { cleanup(); resolve(false); };
      function cleanup() {
        modal.classList.remove("open");
        yes.removeEventListener("click", onYes);
        no.removeEventListener("click", onNo);
      }
      yes.addEventListener("click", onYes);
      no.addEventListener("click", onNo);
    });
  }

  function appendDigit(d) {
    delayed(() => {
      buf += d;
      result.textContent = buf || "0";
    }, `registering "${d}"`);
  }

  async function appendOp(o) {
    if (!buf) return;
    const ok = await confirm(`Use ${opSym(o)} ?`, `You're about to apply ${opSym(o)}. This is a serious commitment.`);
    if (!ok) return;
    delayed(() => {
      buf += o;
      result.textContent = buf;
    }, `committing ${opSym(o)}`);
  }

  function opSym(o) { return { "+": "+", "-": "−", "*": "×", "/": "÷" }[o]; }

  let lastExpr = "";

  function paintExpr() {
    expr.textContent = "";
    expr.appendChild(status);
    if (lastExpr) expr.append(" " + lastExpr);
  }

  async function compute() {
    if (!buf) return;
    const ok = await confirm("Compute?", `We're about to evaluate "${buf}". You can never undo this. Proceed?`);
    if (!ok) return;
    delayed(() => {
      try {
        const sanitized = buf.replace(/[^0-9+\-*/.]/g, "");
        let r = Function('"use strict";return (' + sanitized + ")")();
        const lied = Math.random() < 0.10;
        if (lied && Number.isFinite(r)) {
          r = r + (Math.random() < 0.5 ? -1 : 1);
        }
        lastExpr = buf + " =";
        paintExpr();
        result.textContent = String(r);
        buf = String(r);
      } catch {
        result.textContent = "ERR";
        buf = "";
      }
    }, "computing");
  }

  document.querySelectorAll("button[data-d]").forEach((b) => {
    b.addEventListener("click", () => appendDigit(b.dataset.d));
  });
  document.querySelectorAll("button[data-op]").forEach((b) => {
    b.addEventListener("click", () => appendOp(b.dataset.op));
  });
  document.getElementById("eq").addEventListener("click", compute);
  document.getElementById("clr").addEventListener("click", async () => {
    const ok = await confirm("Clear everything?", "All your hard work, gone. Are you sure?");
    if (!ok) return;
    buf = ""; lastExpr = ""; paintExpr(); result.textContent = "0";
  });
})();
