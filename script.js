function adjustWidth(input) {
    input.style.width = ((input.value.length + 1) * 8) + 'px';
}

function solveAndDisplay() {
    const pFunc = document.getElementById('pFunction').value;
    const qFunc = document.getElementById('qFunction').value;
    const rFunc = document.getElementById('rFunction').value;
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const alpha = parseFloat(document.getElementById('alpha').value);
    const beta = parseFloat(document.getElementById('beta').value);
    const n = parseInt(document.getElementById('n').value);
    const decimalPlaces = parseInt(document.getElementById('decimalPlaces').value);

    const calculationsContent = document.getElementById('ldfCalculationsContent');
    const resultTableBody = document.getElementById('ldfResultTable').querySelector('tbody');
    calculationsContent.innerHTML = '';
    resultTableBody.innerHTML = '';

    const h = (b - a) / (n + 1);
    let x = [];
    for (let i = 0; i <= n + 1; i++) {
        x.push(a + i * h);
    }

    let aArr = [], bArr = [], cArr = [], dArr = [], lArr = [], uArr = [], zArr = [], wArr = [];
    
    function evaluate(funcStr, xVal) {
        return eval(funcStr.replace(/x/g, `(${xVal})`));
    }

    calculationsContent.innerHTML += `<div class="step">Step 1: Setup h = ${(h).toFixed(decimalPlaces)}</div>`;

    // Step 1: Initial
    x1 = a + h;
    aArr[1] = 2 + h * h * evaluate(qFunc, x1);
    bArr[1] = -1 + (h/2) * evaluate(pFunc, x1);
    dArr[1] = -h * h * evaluate(rFunc, x1) + (1 + (h/2) * evaluate(pFunc, x1)) * alpha;
    calculationsContent.innerHTML += `<div class="step">Step 1: a1 = ${aArr[1].toFixed(decimalPlaces)}, b1 = ${bArr[1].toFixed(decimalPlaces)}, d1 = ${dArr[1].toFixed(decimalPlaces)}</div>`;

    // Step 2: Loop for i=2 to n-1
    for (let i = 2; i <= n - 1; i++) {
        const xi = a + i * h;
        aArr[i] = 2 + h * h * evaluate(qFunc, xi);
        bArr[i] = -1 + (h/2) * evaluate(pFunc, xi);
        cArr[i] = -1 - (h/2) * evaluate(pFunc, xi);
        dArr[i] = -h * h * evaluate(rFunc, xi);
        calculationsContent.innerHTML += `<div class="step">Step 2 (i=${i}): ai = ${aArr[i].toFixed(decimalPlaces)}, bi = ${bArr[i].toFixed(decimalPlaces)}, ci = ${cArr[i].toFixed(decimalPlaces)}, di = ${dArr[i].toFixed(decimalPlaces)}</div>`;
    }

    // Step 3: i = n
    const xn = b - h;
    aArr[n] = 2 + h * h * evaluate(qFunc, xn);
    cArr[n] = -1 - (h/2) * evaluate(pFunc, xn);
    dArr[n] = -h * h * evaluate(rFunc, xn) + (1 - (h/2) * evaluate(pFunc, xn)) * beta;
    calculationsContent.innerHTML += `<div class="step">Step 3: aN = ${aArr[n].toFixed(decimalPlaces)}, cN = ${cArr[n].toFixed(decimalPlaces)}, dN = ${dArr[n].toFixed(decimalPlaces)}</div>`;

    // Step 4: Thomas algorithm (Forward Elimination)
    lArr[1] = aArr[1];
    uArr[1] = bArr[1] / aArr[1];
    zArr[1] = dArr[1] / lArr[1];
    calculationsContent.innerHTML += `<div class="step">Step 4: l1 = ${lArr[1].toFixed(decimalPlaces)}, u1 = ${uArr[1].toFixed(decimalPlaces)}, z1 = ${zArr[1].toFixed(decimalPlaces)}</div>`;

    for (let i = 2; i <= n - 1; i++) {
        lArr[i] = aArr[i] - cArr[i] * uArr[i-1];
        uArr[i] = bArr[i] / lArr[i];
        zArr[i] = (dArr[i] - cArr[i] * zArr[i-1]) / lArr[i];
        calculationsContent.innerHTML += `<div class="step">Step 5 (i=${i}): li = ${lArr[i].toFixed(decimalPlaces)}, ui = ${uArr[i].toFixed(decimalPlaces)}, zi = ${zArr[i].toFixed(decimalPlaces)}</div>`;
    }

    lArr[n] = aArr[n] - cArr[n] * uArr[n-1];
    zArr[n] = (dArr[n] - cArr[n] * zArr[n-1]) / lArr[n];
    calculationsContent.innerHTML += `<div class="step">Step 6: lN = ${lArr[n].toFixed(decimalPlaces)}, zN = ${zArr[n].toFixed(decimalPlaces)}</div>`;

    // Step 7 and 8: Back Substitution
    wArr[0] = alpha;
    wArr[n+1] = beta;
    wArr[n] = zArr[n];
    calculationsContent.innerHTML += `<div class="step">Step 7: w0 = ${wArr[0]}, wN+1 = ${wArr[n+1]}, wN = ${wArr[n].toFixed(decimalPlaces)}</div>`;

    for (let i = n-1; i >= 1; i--) {
        wArr[i] = zArr[i] - uArr[i] * wArr[i+1];
        calculationsContent.innerHTML += `<div class="step">Step 8 (i=${i}): wi = ${wArr[i].toFixed(decimalPlaces)}</div>`;
    }

    // Step 9: Output x and w
    for (let i = 0; i <= n+1; i++) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${i}</td>
            <td>${x[i].toFixed(decimalPlaces)}</td>
            <td>${wArr[i] !== undefined ? wArr[i].toFixed(decimalPlaces) : ''}</td>
        `;
        resultTableBody.appendChild(newRow);
    }
}
