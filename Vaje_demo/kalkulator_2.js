
'use strict';

const izrazElement = document.getElementById('izraz');
const rezultatElement = document.getElementById('rezultat');
const tipkovnica = document.querySelector('.tipkovnica');

let trenutniVnos = '0';
let prvoStevilo = null;
let operator = null;
let zacniNovVnos = false;
let zakljucenIzracun = false;
let prikazIzraza = '';
let napaka = false;

const simboli = { '/': '÷', '*': '*', '+': '+', '-': '-' };

function osveziZaslon() {
  izrazElement.textContent = prikazIzraza;
  rezultatElement.textContent = trenutniVnos;
}

function pocistiVse() {
  trenutniVnos = '0';
  prvoStevilo = null;
  operator = null;
  zacniNovVnos = false;
  zakljucenIzracun = false;
  prikazIzraza = '';
  napaka = false;
  osveziZaslon();
}

function dodajStevko(stevka) {
  if (napaka) pocistiVse();

  if (zacniNovVnos || zakljucenIzracun) {
    trenutniVnos = stevka;
    zacniNovVnos = false;
    if (zakljucenIzracun) prikazIzraza = '';
    zakljucenIzracun = false;
  } else if (trenutniVnos === '0') {
    trenutniVnos = stevka;
  } else if (trenutniVnos.replace(/[^0-9]/g, '').length < 15) {
    trenutniVnos += stevka;
  }

  osveziZaslon();
}

function dodajDecimalnoPiko() {
  if (napaka) pocistiVse();

  if (zacniNovVnos || zakljucenIzracun) {
    trenutniVnos = '0.';
    zacniNovVnos = false;
    if (zakljucenIzracun) prikazIzraza = '';
    zakljucenIzracun = false;
  } else if (!trenutniVnos.includes('.')) {
    trenutniVnos += '.';
  }

  osveziZaslon();
}

function izracunaj(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
    default: return b;
  }
}

function oblikujStevilo(stevilo) {
  if (stevilo === null || !Number.isFinite(stevilo)) return null;

  // Odpravi tipične napake plavajoče vejice (npr. 0.1 + 0.2).
  return String(Number(stevilo.toPrecision(12)));
}

function prikaziNapako() {
  trenutniVnos = 'Napaka';
  prikazIzraza = 'Deljenje z nič ni dovoljeno';
  prvoStevilo = null;
  operator = null;
  zacniNovVnos = true;
  napaka = true;
  osveziZaslon();
}

function izberiOperator(noviOperator) {
  if (napaka) return;

  if (operator && !zacniNovVnos) {
    const rezultat = oblikujStevilo(
      izracunaj(prvoStevilo, Number(trenutniVnos), operator)
    );

    if (rezultat === null) return prikaziNapako();
    trenutniVnos = rezultat;
  }

  prvoStevilo = Number(trenutniVnos);
  operator = noviOperator;
  prikazIzraza = `${trenutniVnos} ${simboli[operator]}`;
  zacniNovVnos = true;
  zakljucenIzracun = false;
  osveziZaslon();
}

function enako() {
  if (napaka || operator === null || zacniNovVnos) return;

  const drugoStevilo = Number(trenutniVnos);
  const celotenIzraz =
    `${prvoStevilo} ${simboli[operator]} ${trenutniVnos} =`;

  const rezultat = oblikujStevilo(
    izracunaj(prvoStevilo, drugoStevilo, operator)
  );

  if (rezultat === null) return prikaziNapako();

  trenutniVnos = rezultat;
  prikazIzraza = celotenIzraz;
  prvoStevilo = null;
  operator = null;
  zacniNovVnos = false;
  zakljucenIzracun = true;
  osveziZaslon();
}

function izbrisiZadnjiZnak() {
  if (napaka) return pocistiVse();

  if (zacniNovVnos) return;
  // Operator je izbran; počakamo na drugi operand.

  if (zakljucenIzracun) {
    zakljucenIzracun = false;
    prikazIzraza = '';
  }

  trenutniVnos = trenutniVnos.length <= 1 ||
    (trenutniVnos.length === 2 && trenutniVnos.startsWith('-'))
    ? '0' : trenutniVnos.slice(0, -1);

  osveziZaslon();
}

// Obdelava klikov na tipke kalkulatorja.
tipkovnica.addEventListener('click', (dogodek) => {
  const tipka = dogodek.target.closest('button');
  if (!tipka) return;

  if (tipka.dataset.digit !== undefined)
    dodajStevko(tipka.dataset.digit);
  else if (tipka.dataset.operator)
    izberiOperator(tipka.dataset.operator);
  else if (tipka.dataset.action === 'decimal')
    dodajDecimalnoPiko();
  else if (tipka.dataset.action === 'equals')
    enako();
  else if (tipka.dataset.action === 'delete')
    izbrisiZadnjiZnak();
  else if (tipka.dataset.action === 'clear')
    pocistiVse();
});

// Kalkulator podpira tudi fizično tipkovnico.
document.addEventListener('keydown', (dogodek) => {
  const tipka = dogodek.key;

  if (/^[0-9]$/.test(tipka))
    dodajStevko(tipka);
  else if (['+', '-', '*', '/'].includes(tipka)) {
    dogodek.preventDefault();
    izberiOperator(tipka);
  } else if (tipka === '.' || tipka === ',')
    dodajDecimalnoPiko();
  else if (tipka === 'Enter' || tipka === '=') {
    dogodek.preventDefault();
    enako();
  } else if (tipka === 'Backspace')
    izbrisiZadnjiZnak();
  else if (tipka === 'Escape')
    pocistiVse();
});

// Začetni prikaz kalkulatorja.
osveziZaslon();
