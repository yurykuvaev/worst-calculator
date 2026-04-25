(function () {
  const expr = document.getElementById("expr");
  const result = document.getElementById("result");

  const ROMAN_TABLE = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];

  function toRoman(n) {
    if (n === 0) return "N";
    if (n < 0) return "MINVS " + toRoman(-n);
    let out = "";
    for (const [v, s] of ROMAN_TABLE) {
      while (n >= v) { out += s; n -= v; }
    }
    return out;
  }

  function fromRoman(s) {
    if (!s) return 0;
    if (s === "N") return 0;
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
      const cur = map[s[i]];
      const nxt = map[s[i + 1]];
      if (nxt && nxt > cur) { total -= cur; } else { total += cur; }
    }
    return total;
  }

  let buf = "";
  let lhs = null;
  let op = null;

  function show() {
    result.textContent = buf || "N";
  }

  function pressDigit(c) {
    buf += c;
    show();
  }

  function pressOp(o) {
    if (buf === "") return;
    if (lhs === null) {
      lhs = fromRoman(buf);
    } else {
      lhs = apply(lhs, fromRoman(buf), op);
    }
    op = o;
    expr.textContent = toRoman(lhs) + " " + opSym(op);
    buf = "";
    show();
  }

  function apply(a, b, o) {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : Math.floor(a / b);
    }
  }

  function opSym(o) { return { "+": "+", "-": "−", "*": "×", "/": "÷" }[o]; }

  function compute() {
    if (lhs === null || op === null || buf === "") return;
    const r = apply(lhs, fromRoman(buf), op);
    expr.textContent = toRoman(lhs) + " " + opSym(op) + " " + (buf || "N") + " =";
    if (Number.isNaN(r)) { result.textContent = "NEFAS"; lhs = null; op = null; buf = ""; return; }
    buf = toRoman(r);
    lhs = null;
    op = null;
    show();
  }

  function clear() {
    buf = ""; lhs = null; op = null;
    expr.textContent = "";
    show();
  }

  document.querySelectorAll("button[data-c]").forEach((b) => {
    b.addEventListener("click", () => pressDigit(b.dataset.c));
  });
  document.querySelectorAll("button[data-op]").forEach((b) => {
    b.addEventListener("click", () => pressOp(b.dataset.op));
  });
  document.getElementById("eq").addEventListener("click", compute);
  document.getElementById("clr").addEventListener("click", clear);
})();
