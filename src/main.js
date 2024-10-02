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

const domElements = {
  theme: {
    root: document.documentElement,
    button: document.getElementById('theme-btn'),
    image: document.getElementById('theme-img'),
    toWhite: Array.from(document.getElementsByClassName('change')),
    toPink: Array.from(document.getElementsByClassName('gesture-img'))
  },
  audio: {
    button: document.getElementById('volume-btn'),
    image: document.getElementById('volume-img'),
    elements: document.getElementsByTagName('audio')
  },
  game: {
    toggle: document.getElementById('toggle'),
    extra: Array.from(document.getElementsByClassName('extra')),
    gestures: Array.from(document.getElementsByClassName('gesture')),
    playerChoiceImage: document.getElementById('player-choice'),
    computerChoiceImage: document.getElementById('comp-choice'),
    playerScoreText: document.getElementById('player-score'),
    computerScoreText: document.getElementById('comp-score'),
    firstHeader: document.querySelector('h2'),
    secondHeader: document.querySelector('h3'),
    radioElements: document.getElementsByName('max-score'),
    restartButton: Array.from(document.getElementsByClassName('restart')),
    restartSound: document.getElementById('restart-snd'),
    resultSound: document.getElementById('result-snd'),
    modalWindow: document.getElementById('modal'),
    finalText: document.getElementById('final-text')
  }
};

const ASSETS = {
  images: {
    sun: 'src/assets/icons/sun.avif',
    moon: 'src/assets/icons/moon.avif',
    mute: 'src/assets/icons/mute.avif',
    speaker: 'src/assets/icons/speaker.avif',
    unknown: 'src/assets/icons/gestures/unknown.avif'
  },
  sfx: {
    victory: 'src/assets/sfx/victory.opus',
    defeat: 'src/assets/sfx/defeat.opus'
  }
};
const CHOICES = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

const saveToLocalStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const getFromLocalStorage = (key, defaultValue = null) =>
  JSON.parse(localStorage.getItem(key)) ?? defaultValue;

// Settings Variables
let isDarkMode = getFromLocalStorage('isDarkMode');
let isMuted = getFromLocalStorage('isMuted', false);
let isExtraMode = getFromLocalStorage('isExtraMode', false);
let maxScore = getFromLocalStorage('maxScore', 5);
let playerScore = 0;
let computerScore = 0;

const setImageSrc = (imageElement, src) => {
  imageElement.src = src;
};

const toggleClasses = (elements, className, condition) =>
  elements.forEach(element => element.classList.toggle(className, condition));

const checkTheme = () => {
  if (isDarkMode === null)
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  toggleTheme();
};

const checkMuted = () => {
  setImageSrc(
    domElements.audio.image,
    isMuted ? ASSETS.images.mute : ASSETS.images.speaker
  );
};

const checkMode = () => {
  domElements.game.toggle.checked = isExtraMode;
};

const checkScore = () => {
  [...domElements.game.radioElements].forEach(radioElement => {
    if (radioElement.value === maxScore.toString()) radioElement.checked = true;
  });
};

const checkGame = () => {
  if (playerScore >= +maxScore)
    showResult('Victory!', 'var(--victory)', ASSETS.sfx.victory);
  else if (computerScore >= +maxScore)
    showResult('Defeat...', 'var(--defeat)', ASSETS.sfx.defeat);
  else updateScoreDisplay();
};

const toggleTheme = () => {
  setImageSrc(
    domElements.theme.image,
    isDarkMode ? ASSETS.images.sun : ASSETS.images.moon
  );

  domElements.theme.root.classList.toggle('dark', isDarkMode);
  toggleClasses(domElements.theme.toWhite, 'white', isDarkMode);

  const extraGestures = domElements.theme.toPink.filter(
    gesture => !gesture.classList.contains('regular')
  );

  toggleClasses(extraGestures, 'green', !isDarkMode);
  toggleClasses(extraGestures, 'pink', isDarkMode);

  saveToLocalStorage('isDarkMode', isDarkMode);
};

const toggleMuted = () => {
  isMuted = !isMuted;
  Array.from(domElements.audio.elements).forEach(
    a => (a.volume = isMuted ? 0 : 1)
  );

  checkMuted();
  saveToLocalStorage('isMuted', isMuted);
};

const toggleMode = () => {
  isExtraMode = domElements.game.toggle.checked;
  toggleClasses(domElements.game.extra, 'hide', !isExtraMode);
  saveToLocalStorage('isExtraMode', isExtraMode);
};

const setMaxScore = () => {
  [...domElements.game.radioElements].forEach(radioElement => {
    if (radioElement.checked) {
      maxScore = radioElement.value;
      saveToLocalStorage('maxScore', maxScore);
      startGame();
    }
  });
};

const selectGesture = gesture => {
  const soundEffect = new Audio(gesture.querySelector('audio').src);
  soundEffect.muted = isMuted;
  soundEffect.play();

  domElements.game.playerChoiceImage.src = gesture.querySelector('img').src;
};

const getComputerChoice = num => {
  const computerChoice = CHOICES[~~(Math.random() * num)];

  domElements.game.computerChoiceImage.src = document.getElementById(
    `${computerChoice.toLowerCase()}-img`
  ).src;

  return computerChoice;
};

const playRound = playerChoice => {
  const gesturesArray = domElements.game.gestures.filter(
    gesture => !gesture.classList.contains('hide')
  );

  const computerChoice = getComputerChoice(gesturesArray.length);

  // Reason Flavor Text
  const reason = {
    Draw: `${playerChoice} ties with ${computerChoice}`,
    'Lose...': `${playerChoice} falls to ${computerChoice}`,
    'Win!': `${playerChoice} beats ${computerChoice}`
  };

  const outcomes = {
    'Win!':
      (playerChoice === CHOICES[0] &&
        (computerChoice === CHOICES[2] || computerChoice === CHOICES[3])) ||
      (playerChoice === CHOICES[1] &&
        (computerChoice === CHOICES[0] || computerChoice === CHOICES[4])) ||
      (playerChoice === CHOICES[2] &&
        (computerChoice === CHOICES[1] || computerChoice === CHOICES[3])) ||
      (playerChoice === CHOICES[3] &&
        (computerChoice === CHOICES[1] || computerChoice === CHOICES[4])) ||
      (playerChoice === CHOICES[4] &&
        (computerChoice === CHOICES[0] || computerChoice === CHOICES[2])),

    'Lose...':
      (playerChoice === CHOICES[0] &&
        (computerChoice === CHOICES[1] || computerChoice === CHOICES[4])) ||
      (playerChoice === CHOICES[1] &&
        (computerChoice === CHOICES[2] || computerChoice === CHOICES[3])) ||
      (playerChoice === CHOICES[2] &&
        (computerChoice === CHOICES[0] || computerChoice === CHOICES[4])) ||
      (playerChoice === CHOICES[3] &&
        (computerChoice === CHOICES[0] || computerChoice === CHOICES[2])) ||
      (playerChoice === CHOICES[4] &&
        (computerChoice === CHOICES[1] || computerChoice === CHOICES[3]))
  };

  const result =
    outcomes['Win!'] ? 'Win!'
    : outcomes['Lose...'] ? 'Lose...'
    : 'Draw';

  playerScore += result === 'Win!' ? 1 : 0;
  computerScore += result === 'Lose...' ? 1 : 0;

  domElements.game.firstHeader.innerText = `You ${result}`;
  domElements.game.secondHeader.innerText = `${reason[result]}`;
  checkGame();
};

const startGame = () => {
  playerScore = 0;
  computerScore = 0;
  domElements.game.modalWindow.style.visibility = 'hidden';
  domElements.game.firstHeader.innerText = 'Choose wisely';
  domElements.game.secondHeader.innerText = `Score ${maxScore} to be victorious`;
  domElements.game.playerScoreText.innerText = `Player: ${playerScore}`;
  domElements.game.computerScoreText.innerText = `Computer: ${computerScore}`;
  domElements.game.playerChoiceImage.src =
    domElements.game.computerChoiceImage.src = ASSETS.images.unknown;
};

const updateScoreDisplay = () => {
  domElements.game.playerScoreText.innerText = `Player: ${playerScore}`;
  domElements.game.computerScoreText.innerText = `Computer: ${computerScore}`;
};

const showResult = (text, color, sound) => {
  domElements.game.resultSound.src = sound;
  !isMuted && domElements.game.resultSound.play();
  domElements.game.finalText.innerText = text;
  domElements.game.finalText.style.color = color;
  domElements.game.modalWindow.style.visibility = 'visible';
};

const playRestartSound = () => {
  const effect = new Audio(domElements.game.restartSound.src);
  effect.muted = isMuted;
  effect.play();
};

domElements.audio.button.addEventListener('click', toggleMuted);
domElements.game.toggle.addEventListener('change', toggleMode);
domElements.theme.button.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  toggleTheme();
});

domElements.game.radioElements.forEach(e => {
  e.addEventListener('change', setMaxScore);
});

domElements.game.gestures.forEach(e => {
  e.addEventListener('click', () => {
    selectGesture(e);
    playRound(e.innerText);
  });
});

domElements.game.restartButton.forEach(e => {
  e.addEventListener('click', () => {
    startGame();
    playRestartSound();
  });
});

checkTheme();
checkMuted();
checkMode();
checkScore();
toggleMode();
startGame();

// Easter Egg
console.log("You can try, but you'll never catch me. Bazinga!");
