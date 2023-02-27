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
}
// Play Round
const playRound = plrChoice => {
  const compChoice = getCompChoice();
  // Reason Flavor Text
  const reason = {
    "Draw": `${plrChoice} is equal to ${compChoice}`,
    "Lose": `${plrChoice} loses to ${compChoice}`,
    "Win": `${plrChoice} beats ${compChoice}`
  };

  let result;
  if (plrChoice === compChoice) {
    result = "Draw";
  }
  if (plrChoice === "Rock" && compChoice === "Paper") {
    result = "Lose";
  }
  if (plrChoice === "Rock" && compChoice === "Scissors") {
    result = "Win";
  }
  if (plrChoice === "Paper" && compChoice === "Scissors") {
    result = "Lose";
  }
  if (plrChoice === "Paper" && compChoice === "Rock") {
    result = "Win";
  }
  if (plrChoice === "Scissors" && compChoice === "Rock") {
    result = "Lose";
  }
  if (plrChoice === "Scissors" && compChoice === "Paper") {
    result = "Win";
  }
  return `You ${result}! ${reason[result]}`;
}
// Test
console.log(playRound("Paper"));