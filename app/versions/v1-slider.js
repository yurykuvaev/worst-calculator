(function () {
  const a = document.getElementById("a");
  const b = document.getElementById("b");
  const aVal = document.getElementById("aVal");
  const bVal = document.getElementById("bVal");
  const expr = document.getElementById("expr");
  const result = document.getElementById("result");
  const eq = document.getElementById("eq");

  let op = "+";
  let lastShown = "";

  function refresh() {
    aVal.textContent = a.value;
    bVal.textContent = b.value;
    expr.textContent = `${a.value} ${opSymbol(op)} ${b.value} = ?`;
  }

  function opSymbol(o) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[o];
  }

  function compute() {
    const x = Number(a.value);
    const y = Number(b.value);
    let r;
    switch (op) {
      case "+": r = x + y; break;
      case "-": r = x - y; break;
      case "*": r = x * y; break;
      case "/": r = y === 0 ? "undefined (you picked 0, of course)" : (x / y).toFixed(4); break;
    }
    expr.textContent = `${x} ${opSymbol(op)} ${y} =`;
    result.textContent = r;
    lastShown = String(r);
  }

  a.addEventListener("input", refresh);
  b.addEventListener("input", refresh);

  document.querySelectorAll("button.op").forEach((btn) => {
    btn.addEventListener("click", () => {
      op = btn.dataset.op;
      refresh();
    });
  });

  eq.addEventListener("click", compute);
  refresh();
})();
