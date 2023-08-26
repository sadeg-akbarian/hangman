const findTheWord = document.querySelector("#theWord");
const singleLetters = document.querySelectorAll(".singleLetters");
const failedNumbers = document.querySelector("#failedNumbers");
const paragraphActive = document.querySelector("#paragraphActive");
const theFails = document.querySelector("#theFails");

const initialObject = {
  randomWord: "",
  randomWordLength: 0,
  hiddenWord: "",
  count: 0,
  hiddenWordArray: [],
};

const initialObjectSerialized = JSON.stringify(initialObject);
localStorage.setItem("Anfangswerte", initialObjectSerialized);

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function initialState() {
  singleLetters.forEach((singleLetter) => {
    singleLetter.disabled = false;
    singleLetter.classList.remove("clickedLetter");
  });
  paragraphActive.innerText = "ACTIVE";
  paragraphActive.style.color = "rgb(0, 0, 0)";
  paragraphActive.style.opacity = "1";
  theFails.style.backgroundColor = "rgba(255, 0, 0, 0)";
  failedNumbers.innerText = "0";
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

let fadingInterval;
function toggleOpacity() {
  fadingInterval = setInterval(function () {
    if (paragraphActive.style.opacity === "1") {
      paragraphActive.style.opacity = "0";
    } else {
      paragraphActive.style.opacity = "1";
    }
  }, 200);
}

function stopFading() {
  clearInterval(fadingInterval);
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function newGame() {
  const codingWords = [
    "Javascript",
    "opacity",
    "padding",
    "grid",
    "property",
    "selector",
    "function",
    "variable",
    "object",
    "JSON",
  ];

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const audioContext = new AudioContext();

  function playSound(frequency, volume) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine"; // Sinus-Wellenform
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  function noHover() {
    singleLetters.forEach((singleLetter) => {
      singleLetter.classList.add("no-hover-effect");
    });
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const initialObjectDeserialized = JSON.parse(initialObjectSerialized);

  let randomWord = initialObjectDeserialized.randomWord;
  randomWord = codingWords[Math.floor(Math.random() * 10)];

  let randomWordLength = initialObjectDeserialized.randomWordLength;
  randomWordLength = randomWord.length;

  let hiddenWord = initialObjectDeserialized.hiddenWord;
  hiddenWord = "_".repeat(randomWordLength);

  findTheWord.innerText = hiddenWord;

  let count = initialObjectDeserialized.count;
  count = 0;

  let hiddenWordArray = initialObjectDeserialized.hiddenWordArray;
  hiddenWordArray = hiddenWord.split("");

  singleLetters.forEach((letter) => {
    letter.addEventListener("click", function (event) {
      if (hiddenWordArray.includes("_") === true && count < 10) {
        letter.classList.add("clickedLetter");
        event.target.disabled = "true";
        const isLetterInRandomWord = randomWord
          .toLowerCase()
          .includes(event.target.innerText);
        if (isLetterInRandomWord === true) {
          for (let i = 0; i < randomWordLength; i++) {
            if (randomWord[i].toLowerCase() === event.target.innerText) {
              hiddenWordArray[i] = randomWord[i];
            }
          }
          findTheWord.innerText = hiddenWordArray.join("");
          if (hiddenWordArray.includes("_") === false) {
            paragraphActive.innerText = "WIN";
            paragraphActive.style.color = "green";
            toggleOpacity();
            noHover();
          }
        } else {
          playSound(440, 0.05);
          count++;
          failedNumbers.innerText = count;
          theFails.style.backgroundColor = `rgba(255, 0, 0, 0.${count})`;
          if (count === 10) {
            theFails.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
            paragraphActive.innerText = "FAIL";
            paragraphActive.style.color = "red";
            toggleOpacity();
            noHover();
          }
        }
      }
    });
  });
}

newGame();

const buttonRestart = document.querySelector("#buttonRestart");

buttonRestart.addEventListener("click", function () {
  stopFading();
  initialState();
  newGame();
});
