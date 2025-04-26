function solve() {
  const pFunc = math.compile(document.getElementById('pFunction').value);
  const qFunc = math.compile(document.getElementById('qFunction').value);
  const rFunc = math.compile(document.getElementById('rFunction').value);

  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const alpha = parseFloat(document.getElementById('alpha').value);
  const beta = parseFloat(document.getElementById('beta').value);
  const n = parseInt(document.getElementById('n').value);
  const decimalPlaces = parseInt(document.getElementById('decimalPlaces').value);

  const h = (b - a) / (n + 1);

  let xArr = [];
  for (let i = 0; i <= n + 1; i++) {
    xArr.push(a + i * h);
  }

  let aArr = new Array(n + 2).fill(0);
  let bArr = new Array(n + 2).fill(0);
  let dArr = new Array(n + 2).fill(0);

  let calculationsContent = "";

  calculationsContent += `
  <div class="calculation-step">
  <b>Step 1: Initialize h</b><br>
  h = (b - a) / (n + 1) = (${b} - ${a}) / (${n} + 1) = <b>${h.toFixed(decimalPlaces)}</b>
  </div>`;

  for (let i = 1; i <= n; i++) {
    const xi = xArr[i];
    const pxi = pFunc.evaluate({x: xi});
    const qxi = qFunc.evaluate({x: xi});
    const rxi = rFunc.evaluate({x: xi});

    aArr[i] = 2 + h * h * qxi;
    bArr[i] = -1 + (h / 2) * pxi;
    dArr[i] = -h * h * rxi;

    if (i === 1) {
      dArr[i] += (1 + (h / 2) * pxi) * alpha;
    }
    if (i === n) {
      dArr[i] += (1 - (h / 2) * pxi) * beta;
    }

    calculationsContent += `
    <div class="calculation-step">
    <b>Step 2: Compute coefficients at i = ${i}</b><br>
    x<sub>${i}</sub> = a + i × h = ${a} + ${i} × ${h.toFixed(decimalPlaces)} = <b>${xi.toFixed(decimalPlaces)}</b><br><br>

    a<sub>${i}</sub> = 2 + (h)² × q(x<sub>${i}</sub>) = 2 + (${h.toFixed(decimalPlaces)})² × ${qxi.toFixed(decimalPlaces)} = <b>${aArr[i].toFixed(decimalPlaces)}</b><br>
    b<sub>${i}</sub> = -1 + (h/2) × p(x<sub>${i}</sub>) = -1 + (${h.toFixed(decimalPlaces)}/2) × ${pxi.toFixed(decimalPlaces)} = <b>${bArr[i].toFixed(decimalPlaces)}</b><br>
    d<sub>${i}</sub> = - (h)² × r(x<sub>${i}</sub>) + boundary terms = <b>${dArr[i].toFixed(decimalPlaces)}</b>
    </div>`;
  }

  // Thomas Algorithm (forward elimination)
  for (let i = 2; i <= n; i++) {
    const m = bArr[i-1] / aArr[i-1];
    aArr[i] = aArr[i] - m;
    dArr[i] = dArr[i] - m * dArr[i-1];
  }

  // Back substitution
  let wArr = new Array(n + 2).fill(0);
  wArr[n] = dArr[n] / aArr[n];

  for (let i = n - 1; i >= 1; i--) {
    wArr[i] = (dArr[i] - bArr[i] * wArr[i+1]) / aArr[i];
  }

  // Prepare output
  let resultContent = "<table border='1' cellspacing='0' cellpadding='5'><tr><th>x</th><th>Approximate w(x)</th></tr>";
  for (let i = 0; i <= n + 1; i++) {
    if (i === 0) {
      resultContent += `<tr><td>${xArr[i].toFixed(decimalPlaces)}</td><td>${alpha.toFixed(decimalPlaces)}</td></tr>`;
    } else if (i === n + 1) {
      resultContent += `<tr><td>${xArr[i].toFixed(decimalPlaces)}</td><td>${beta.toFixed(decimalPlaces)}</td></tr>`;
    } else {
      resultContent += `<tr><td>${xArr[i].toFixed(decimalPlaces)}</td><td>${wArr[i].toFixed(decimalPlaces)}</td></tr>`;
    }
  }
  resultContent += "</table>";

  document.getElementById('result').innerHTML = resultContent;
  document.getElementById('calculations').innerHTML = calculationsContent;
}

  document.getElementById('result').innerHTML = resultContent;
  document.getElementById('calculations').innerHTML = calculationsContent;
}

