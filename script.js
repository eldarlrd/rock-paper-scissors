"use strict";
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