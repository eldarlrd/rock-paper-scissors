"use strict";
// Theme
const root = document.getElementsByTagName("html")[0];
const themeBtn = document.getElementById("theme-btn");
const themeImg = document.getElementById("theme-img");
const toWhite = Array.from(document.getElementsByClassName("change"));
const toPink = Array.from(document.getElementsByClassName("gesture-img"));
// Audio
const volBtn = document.getElementById("volume-btn");
const volImg = document.getElementById("volume-img");
const audio = document.getElementsByTagName("audio");
// Game Mode
const toggle = document.getElementById("toggle");
const extra = Array.from(document.getElementsByClassName("extra"));
// Gesture Menu
const gestures = Array.from(document.getElementsByClassName("gesture"));
// Result
const plrChoiceImg = document.getElementById("player-choice");
const compChoiceImg = document.getElementById("comp-choice");
const firstHeader = document.getElementsByTagName("h2")[0];
const secondHeader = document.getElementsByTagName("h3")[0];
// Max Score
const radio = document.getElementsByName("max-score");
const plrScoreText = document.getElementById("player-score");
const compScoreText = document.getElementById("comp-score");
// Restart
const restartBtn = Array.from(document.getElementsByClassName("restart"));
const restartSnd = document.getElementById("restart-snd");
// Modal
const modal = document.getElementById("modal");
const finalText = document.getElementById("final-text");
const resultSnd = document.getElementById("result-snd");
// Settings Variables
let darkMode;
let volMute;
let maxScore;
let plrScore = 0;
let compScore = 0;

// Check Theme Preference
const themeCheck = () => {
  window.matchMedia("(prefers-color-scheme: dark)")
        .matches
          ? themeSwitch()
          : null;
};
// Change Color Theme
const themeSwitch = () => {
  darkMode
    ? themeImg.src = "assets/icons/moon.png"
    : themeImg.src = "assets/icons/sun.png";
  root.classList.toggle("dark");
  toWhite.forEach(e => {
    e.classList.toggle("white");
  });
  toPink.forEach(e => {
    e.classList.toggle("green");
    e.classList.toggle("pink");
  });
  darkMode = !darkMode;
};
// Change Volume
const volumeSwitch = () => {
  if (volMute) {
    volImg.src = "assets/icons/speaker.png"
    Object.values(audio).forEach(e => {
      e.volume = 1;
    });
  } else {
      volImg.src = "assets/icons/mute.png";
      Object.values(audio).forEach(e => {
        e.volume = 0;
      });
    } volMute = !volMute;
};
// Change Game Mode
const modeSwitch = () => {
  toggle.checked
    ? extra.forEach(e => {
        e.classList.remove("hide");
      })
    : extra.forEach(e => {
        e.classList.add("hide");
      });
};
// Gesture Selection
const gestureSelect = e => {
  // Audio
  const effect = new Audio(e.getElementsByTagName("audio")[0].src);
  effect.play();
  if (volMute) effect.muted = true;
  else effect.muted = false;
  // Display
  const gestureImg = e.getElementsByTagName("img")[0].src;
  plrChoiceImg.src = gestureImg;
};
// Computer's Choice
const getCompChoice = num => {
  const compRoll = Math.floor(Math.random() * num);
  let compChoice;

  switch (compRoll) {
    case 0:
      compChoice = "Rock";
      break;
    case 1:
      compChoice = "Paper";
      break;
    case 2:
      compChoice = "Scissors";
      break;
    case 3:
      compChoice = "Lizard";
      break;
    case 4:
      compChoice = "Spock";
  } compChoiceImg.src = document.getElementById(`${compChoice.toLowerCase()}-img`).src;
  return compChoice;
};
// Play Round
const playRound = plrChoice => {
  let num = 0;
  for (let i = 0; i < gestures.length; i++) {
    if (!Array.from(gestures[i].classList).includes("hide")) {
      num++;
    }
  } const compChoice = getCompChoice(num);
  // Reason Flavor Text
  const reason = {
    "Draw": `${plrChoice} ties with ${compChoice}`,
    "Lose...": `${plrChoice} falls to ${compChoice}`,
    "Win!": `${plrChoice} beats ${compChoice}`
  };

  let result;
  switch (true) {
    case (plrChoice === "Rock" && (compChoice === "Scissors" || compChoice === "Lizard")):
    case (plrChoice === "Paper" && (compChoice === "Rock" || compChoice === "Spock")):
    case (plrChoice === "Scissors" && (compChoice === "Paper" || compChoice === "Lizard")):
    case (plrChoice === "Lizard" && (compChoice === "Paper" || compChoice === "Spock")):
    case (plrChoice === "Spock" && (compChoice === "Rock" || compChoice === "Scissors")):
      plrScore++;
      result = "Win!";
      break;
    case (plrChoice === "Rock" && (compChoice === "Paper" || compChoice === "Spock")):
    case (plrChoice === "Paper" && (compChoice === "Scissors" || compChoice === "Lizard")):
    case (plrChoice === "Scissors" && (compChoice === "Rock" || compChoice === "Spock")):
    case (plrChoice === "Lizard" && (compChoice === "Rock" || compChoice === "Scissors")):
    case (plrChoice === "Spock" && (compChoice === "Paper" || compChoice === "Lizard")):
      compScore++;
      result = "Lose...";
      break;
    default:
      result = "Draw";
  } fullGame();
  firstHeader.innerText = `You ${result}`;
  secondHeader.innerText = `${reason[result]}`;
};
// Max Score Setter
const setMaxScore = () => {
  maxScore = document.querySelector("input[name='max-score']:checked").value;
  gameRestart();
};
// Full Game
const fullGame = () => {
  if (plrScore == maxScore) {
    resultSnd.src = "assets/sounds/victory.mp3";
    resultSnd.play();
    plrScoreText.innerText = `Player: ${plrScore}`;
    finalText.innerText = "Victory!";
    finalText.style.color = "var(--victory)";
    modal.style.visibility = "visible";
  } if (compScore == maxScore) {
    resultSnd.src = "assets/sounds/defeat.mp3";
    resultSnd.play();
    compScoreText.innerText = `Computer: ${compScore}`;
    finalText.innerText = "Defeat...";
    finalText.style.color = "var(--defeat)";
    modal.style.visibility = "visible";
  } else if (plrScore <= maxScore && compScore <= maxScore) {
      plrScoreText.innerText = `Player: ${plrScore}`;
      compScoreText.innerText = `Computer: ${compScore}`;
    }
};
// Restart Game
const gameRestart = () => {
  plrScore = 0;
  compScore = 0;
  modal.style.visibility = "hidden";
  firstHeader.innerText = "Choose wisely";
  secondHeader.innerText = `Score ${maxScore} to be victorious`;
  plrScoreText.innerText = `Player: ${plrScore}`;
  compScoreText.innerText = `Computer: ${compScore}`;
  plrChoiceImg.src = compChoiceImg.src = "assets/icons/gestures/unknown.png";
};
// Play Restart Sound
const playRestart = () => {
  const effect = new Audio(restartSnd.src);
  effect.play();
  if (volMute) effect.muted = true;
  else effect.muted = false;
};
// Calls on Load
themeCheck();
modeSwitch();
setMaxScore();
// Calls on Interaction
themeBtn.addEventListener("click", themeSwitch);
volBtn.addEventListener("click", volumeSwitch);
toggle.addEventListener("change", modeSwitch);

radio.forEach(e => {
  e.addEventListener("change", setMaxScore);
});

gestures.forEach(e => {
  e.addEventListener("click", () => {
    gestureSelect(e);
    playRound(e.innerText);
  });
});

restartBtn.forEach(e => {
  e.addEventListener("click", () => {
    gameRestart();
    playRestart();
  });
});
// Easter Egg
console.log("You can try, but you'll never catch me. Bazinga!");