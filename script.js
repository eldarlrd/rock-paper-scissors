"use strict";
// Theme Relevant
const root = document.getElementsByTagName("html")[0];
const themeBtn = document.getElementById("theme-btn");
const themeImg = document.getElementById("theme-img");
const toWhite = document.getElementsByClassName("change");
const toPink = document.getElementsByClassName("gesture-img");
// Audio Relevant
const volBtn = document.getElementById("volume-btn");
const volImg = document.getElementById("volume-img");
const audio = document.getElementsByTagName("audio");
// Game Mode Relevant
const toggle = document.getElementById("toggle");
const extra = document.getElementsByClassName("extra");
// Settings Variables
let darkMode;
let volMute;

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
  Object.values(toWhite).forEach(e => {
    e.classList.toggle("white");
  });
  Object.values(toPink).forEach(e => {
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
    }
  volMute = !volMute;
};
// Change Game Mode
const modeSwitch = () => {
  toggle.checked
    ? Object.values(extra).forEach(e => {
        e.classList.remove("remove");
      })
    : Object.values(extra).forEach(e => {
        e.classList.add("remove");
      });
};

// Calls
themeCheck();
modeSwitch();

themeBtn.addEventListener("click", () => {
  themeSwitch();
});

volBtn.addEventListener("click", () => {
  volumeSwitch();
});

toggle.addEventListener("change", () => {
  modeSwitch();
});

// Computer's Choice
const getCompChoice = () => {
  const compRoll = Math.floor(Math.random() * 3);
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
  } return compChoice;
};
// Play Round
const playRound = plrChoice => {
  const compChoice = getCompChoice();
  // Reason Flavor Text
  const reason = {
    "Draw.": `${plrChoice} is equal to ${compChoice}`,
    "Lose...": `${plrChoice} falls to ${compChoice}`,
    "Win!": `${plrChoice} beats ${compChoice}`
  };

  let result;
  switch (true) {
    case (plrChoice === "Rock" && compChoice === "Scissors"):
    case (plrChoice === "Paper" && compChoice === "Rock"):
    case (plrChoice === "Scissors" && compChoice === "Paper"):
      result = "Win!";
      break;
    case (plrChoice === "Rock" && compChoice === "Paper"):
    case (plrChoice === "Paper" && compChoice === "Scissors"):
    case (plrChoice === "Scissors" && compChoice === "Rock"):
      result = "Lose...";
      break;
    default:
      result = "Draw.";
  } return `You ${result} ${reason[result]}`;
};
// Full Game
const game = () => {
  return playRound("Rock"); // Temporary
};
// Test
console.log(game());
// Easter Egg
console.log("Bazinga!");