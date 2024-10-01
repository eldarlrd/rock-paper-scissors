/**
 * @license AGPL-3.0-only
 * Rock Paper Scissors - Rock Paper Scissors Lizard Spock
 * Copyright (C) 2023-2024 Eldar Pashazade <eldarlrd@pm.me>
 *
 * This file is part of Rock Paper Scissors.
 *
 * Rock Paper Scissors is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * Rock Paper Scissors is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Rock Paper Scissors. If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

// Theme
const root = document.getElementsByTagName('html')[0];
const themeBtn = document.getElementById('theme-btn');
const themeImg = document.getElementById('theme-img');
const toWhite = Array.from(document.getElementsByClassName('change'));
const toPink = Array.from(document.getElementsByClassName('gesture-img'));

// Audio
const volBtn = document.getElementById('volume-btn');
const volImg = document.getElementById('volume-img');
const audio = document.getElementsByTagName('audio');

// Game Mode
const toggle = document.getElementById('toggle');
const extra = Array.from(document.getElementsByClassName('extra'));

// Gesture Menu
const gestures = Array.from(document.getElementsByClassName('gesture'));

// Result
const plrChoiceImg = document.getElementById('player-choice');
const compChoiceImg = document.getElementById('comp-choice');
const firstHeader = document.getElementsByTagName('h2')[0];
const secondHeader = document.getElementsByTagName('h3')[0];

// Max Score
const radio = document.getElementsByName('max-score');
const plrScoreText = document.getElementById('player-score');
const compScoreText = document.getElementById('comp-score');

// Restart
const restartBtn = Array.from(document.getElementsByClassName('restart'));
const restartSnd = document.getElementById('restart-snd');

// Modal
const modal = document.getElementById('modal');
const finalText = document.getElementById('final-text');
const resultSnd = document.getElementById('result-snd');

// Local Storage Helpers
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key, defaultValue = null) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Settings Variables
let darkMode = getFromLocalStorage('darkMode');
let gameMode = getFromLocalStorage('gameMode', false);
let volMute = getFromLocalStorage('volMute', false);
let maxScore = getFromLocalStorage('maxScore', 5);
let plrScore = 0;
let compScore = 0;

const themeCheck = () => {
  if (darkMode === null)
    darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  themeSwitch();
};

const volumeCheck = () => {
  volImg.src =
    volMute ? 'src/assets/icons/mute.avif' : 'src/assets/icons/speaker.avif';
};

const modeCheck = () => {
  toggle.checked = gameMode;
};

const scoreCheck = () => {
  radio.forEach(e => {
    if (e.value === maxScore.toString()) e.checked = true;
  });
  setMaxScore();
};

const themeSwitch = () => {
  themeImg.src =
    darkMode ? 'src/assets/icons/sun.avif' : 'src/assets/icons/moon.avif';
  root.classList.toggle('dark', darkMode);

  toWhite.forEach(e => {
    e.classList.toggle('white', darkMode);
  });

  toPink.forEach(e => {
    e.classList.toggle('green', !darkMode);
    e.classList.toggle('pink', darkMode);
  });

  saveToLocalStorage('darkMode', darkMode);
};

const volumeSwitch = () => {
  Array.from(audio).forEach(a => (a.volume = volMute ? 1 : 0));
  volMute = !volMute;
  volumeCheck();
  saveToLocalStorage('volMute', volMute);
};

const modeSwitch = () => {
  gameMode = toggle.checked;
  extra.forEach(e => e.classList.toggle('hide', !gameMode));
  saveToLocalStorage('gameMode', gameMode);
};

const setMaxScore = () => {
  for (const radioElem of radio) {
    if (radioElem.checked) {
      maxScore = radioElem.value;
      saveToLocalStorage('maxScore', maxScore);
      gameRestart();
      return;
    }
  }
};

const gestureSelect = e => {
  // Audio
  const effect = new Audio(e.getElementsByTagName('audio')[0].src);
  effect.muted = volMute;
  effect.play();

  // Display
  const gestureImg = e.getElementsByTagName('img')[0].src;
  plrChoiceImg.src = gestureImg;
};

const getCompChoice = num => {
  const CHOICES = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];
  const compChoice = CHOICES[~~(Math.random() * num)];

  compChoiceImg.src = document.getElementById(
    `${compChoice.toLowerCase()}-img`
  ).src;

  return compChoice;
};

const playRound = plrChoice => {
  const gesturesArr = gestures.filter(g => !g.classList.contains('hide'));
  const compChoice = getCompChoice(gesturesArr.length);

  // Reason Flavor Text
  const reason = {
    Draw: `${plrChoice} ties with ${compChoice}`,
    'Lose...': `${plrChoice} falls to ${compChoice}`,
    'Win!': `${plrChoice} beats ${compChoice}`
  };

  const outcomes = {
    'Win!':
      (plrChoice === 'Rock' &&
        (compChoice === 'Scissors' || compChoice === 'Lizard')) ||
      (plrChoice === 'Paper' &&
        (compChoice === 'Rock' || compChoice === 'Spock')) ||
      (plrChoice === 'Scissors' &&
        (compChoice === 'Paper' || compChoice === 'Lizard')) ||
      (plrChoice === 'Lizard' &&
        (compChoice === 'Paper' || compChoice === 'Spock')) ||
      (plrChoice === 'Spock' &&
        (compChoice === 'Rock' || compChoice === 'Scissors')),

    'Lose...':
      (plrChoice === 'Rock' &&
        (compChoice === 'Paper' || compChoice === 'Spock')) ||
      (plrChoice === 'Paper' &&
        (compChoice === 'Scissors' || compChoice === 'Lizard')) ||
      (plrChoice === 'Scissors' &&
        (compChoice === 'Rock' || compChoice === 'Spock')) ||
      (plrChoice === 'Lizard' &&
        (compChoice === 'Rock' || compChoice === 'Scissors')) ||
      (plrChoice === 'Spock' &&
        (compChoice === 'Paper' || compChoice === 'Lizard'))
  };

  const result =
    outcomes['Win!'] ? 'Win!'
    : outcomes['Lose...'] ? 'Lose...'
    : 'Draw';
  plrScore += result === 'Win!' ? 1 : 0;
  compScore += result === 'Lose...' ? 1 : 0;

  firstHeader.innerText = `You ${result}`;
  secondHeader.innerText = `${reason[result]}`;
  fullGame();
};

const fullGame = () => {
  if (plrScore >= +maxScore) {
    showResult('Victory!', 'var(--victory)', 'src/assets/sfx/victory.opus');
  } else if (compScore >= +maxScore) {
    showResult('Defeat...', 'var(--defeat)', 'src/assets/sfx/defeat.opus');
  } else {
    updateScoreDisplay();
  }
};

const updateScoreDisplay = () => {
  plrScoreText.innerText = `Player: ${plrScore}`;
  compScoreText.innerText = `Computer: ${compScore}`;
};

const showResult = (text, color, sound) => {
  resultSnd.src = sound;
  !volMute && resultSnd.play();
  finalText.innerText = text;
  finalText.style.color = color;
  modal.style.visibility = 'visible';
};

const gameRestart = () => {
  plrScore = 0;
  compScore = 0;
  modal.style.visibility = 'hidden';
  firstHeader.innerText = 'Choose wisely';
  secondHeader.innerText = `Score ${maxScore} to be victorious`;
  plrScoreText.innerText = `Player: ${plrScore}`;
  compScoreText.innerText = `Computer: ${compScore}`;
  plrChoiceImg.src = compChoiceImg.src =
    'src/assets/icons/gestures/unknown.avif';
};

const playRestart = () => {
  const effect = new Audio(restartSnd.src);
  effect.muted = volMute;
  effect.play();
};

themeCheck();
volumeCheck();
modeCheck();
modeSwitch();
scoreCheck();

volBtn.addEventListener('click', volumeSwitch);
toggle.addEventListener('change', modeSwitch);

themeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  themeSwitch();
});

radio.forEach(e => {
  e.addEventListener('change', setMaxScore);
});

gestures.forEach(e => {
  e.addEventListener('click', () => {
    gestureSelect(e);
    playRound(e.innerText);
  });
});

restartBtn.forEach(e => {
  e.addEventListener('click', () => {
    gameRestart();
    playRestart();
  });
});

// Easter Egg
console.log("You can try, but you'll never catch me. Bazinga!");
