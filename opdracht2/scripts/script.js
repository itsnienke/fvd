const card = document.getElementById('bingo-card');
const numbers = [];
const generateButton = document.getElementById('generate-number');
generateButton.addEventListener('click', generateNumber);
const generatedNumbers = document.getElementById('generated-numbers');
const generatedNumbersArray = [];


// genereert 25 nummers van 1 tot 75
while (numbers.length < 25) {
  const number = Math.floor(Math.random() * 75) + 1;
  if (!numbers.includes(number)) {
    numbers.push(number);
  }
}

// maakt de nummers op de bingo kaart
for (let i = 0; i < 25; i++) {
  const cell = document.createElement('div');
  cell.className = 'bingo-cell';
  cell.innerText = numbers[i];
  cell.addEventListener('click', toggleCell);
  card.appendChild(cell);
}


function toggleCell() {
  const number = parseInt(this.innerText);
  if (generatedNumbersArray.includes(number)) {
    this.classList.toggle('generated');
  }
}

function generateNumber() {
  let number;
  do {
    number = Math.floor(Math.random() * 75) + 1;
  } while (generatedNumbersArray.includes(number));
  
  generatedNumbersArray.push(number);
  const generatedNumberElement = document.createElement('span');
  generatedNumberElement.textContent = number + ' ';
  generatedNumberElement.addEventListener('click', function() {
    const cells = document.getElementsByClassName('bingo-cell');
    for (let i = 0; i < cells.length; i++) {
      if (parseInt(cells[i].innerText) == number) {
        cells[i].classList.toggle('generated');
        break;
      }
    }
  });
  generatedNumbers.appendChild(generatedNumberElement);
}
  

// sorteer knoppen 
function sortNumbers(order) {
  const cells = document.querySelectorAll('.bingo-cell');
  const cellsArray = Array.from(cells);
  if (order === 'asc') {
    cellsArray.sort((a, b) => parseInt(a.innerText) - parseInt(b.innerText));
  } else if (order === 'desc') {
    cellsArray.sort((a, b) => parseInt(b.innerText) - parseInt(a.innerText));
  } else if (order === 'random') {
    cellsArray.sort(() => Math.random() - 0.5);
  }
  cellsArray.forEach(cell => {
    card.appendChild(cell);
  });
}








// de commando's
const commandos = [ 'bingo', 'bingo!']; 
const grammar = '#JSGF V1.0; grammar commandos; public <commando> = ' + commandos.join(' | ') + ' ;'

// de browser de benodigde dingen leren 
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var gewonnen = document.querySelector('.gewonnen');

// een lijstje maken van de grammer/commando's 
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

// het luisterobject aanmaken en de commando's en de taal leren
const recognition = new SpeechRecognition();
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en','nl';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

// als er tekst verstaan is
function spraakAfhandelen(event) {
  const lijstMetAlleResultaten = event.results;
  const indexVanHetLaatsteResultaat = lijstMetAlleResultaten.length - 1;
  const hetLaatsteResultaat = lijstMetAlleResultaten[indexVanHetLaatsteResultaat];     

  let deTekstDieVerstaanIs = hetLaatsteResultaat[0].transcript;
  
  deTekstDieVerstaanIs = deTekstDieVerstaanIs.trim();
  deTekstDieVerstaanIs = deTekstDieVerstaanIs.toLowerCase();
  
  console.log(deTekstDieVerstaanIs) 
  
  if (deTekstDieVerstaanIs == "bingo") {
    let matchingNumbers = 0;
    const cells = document.getElementsByClassName('bingo-cell');
    // Checkt horizontale rijen voor bingo
    for (let i = 0; i < 25; i += 5) {
      if (cells[i].classList.contains('generated') &&
          cells[i+1].classList.contains('generated') &&
          cells[i+2].classList.contains('generated') &&
          cells[i+3].classList.contains('generated') &&
          cells[i+4].classList.contains('generated')) {
        matchingNumbers = 5;
        break;
      }
    }
    // Checkt verticale rijen voor bingo
    for (let i = 0; i < 5; i++) {
      if (cells[i].classList.contains('generated') &&
          cells[i+5].classList.contains('generated') &&
          cells[i+10].classList.contains('generated') &&
          cells[i+15].classList.contains('generated') &&
          cells[i+20].classList.contains('generated')) {
        matchingNumbers = 5;
        break;
      }
    }
    // Checkt diagonale rijen voor bingo
    if (cells[0].classList.contains('generated') &&
        cells[6].classList.contains('generated') &&
        cells[12].classList.contains('generated') &&
        cells[18].classList.contains('generated') &&
        cells[24].classList.contains('generated')) {
      matchingNumbers = 5;
    } else if (cells[4].classList.contains('generated') &&
               cells[8].classList.contains('generated') &&
               cells[12].classList.contains('generated') &&
               cells[16].classList.contains('generated') &&
               cells[20].classList.contains('generated')) {
      matchingNumbers = 5;
    }

    // als er bingo gevonden is kan je pas bingo roepen en dat het reageert
    if (matchingNumbers === 5) {
      gewonnen.classList.add('show');
    }
  }
}


// het luisterobject laten luisteren 
function luisteren() {
   recognition.start();
   console.log('Ready to receive a command.');
}

// als er een woord herkent is - de functie starten 
recognition.onresult = event => {
   spraakAfhandelen(event);
}

// als het luisterobject er onverhoopt mee ophoudt - opnieuw starten met luisteren 
recognition.onend = () => {
   luisteren();
}


luisteren();

console.log("he");