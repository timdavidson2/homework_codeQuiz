const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progress-bar-full");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCoutner = 0;
let availableQuestions = [];

let questions = [];

fetch("../questions.json")
  .then((res) => {
    return res.json();
  })

  .then((loadedQuestions) => {
    console.log(loadedQuestions);
    questions = loadedQuestions;

    startGame();
  })
  .catch((err) => {
    alert("questions did not load, refresh to try again.");
  });

// **** CONSTANTS ****

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCoutner >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    // got to the end page
    return window.location.assign("./end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  // update progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    // const classToApply = 'incorrect';
    // if (selectedAnswer == currrentQuestion.answer) {
    //     classToApply = 'correct';
    // }
    // alternate possibility (teranary operator)
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    selectedChoice.parentElement.classList.add(classToApply);

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    } else {
      timeSecond -= 5;
    }

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

// **** Timer ****
const timeH = document.getElementById("timer");
let timeSecond = MAX_QUESTIONS * 10;

displayTime(timeSecond);
const countdown = setInterval(() => {
  timeSecond--;
  displayTime(timeSecond);
  if (timeSecond <= 0 || timeSecond < 1) {
    clearInterval(countdown);
    return window.location.assign("./end.html");
  }
}, 1000);

function displayTime(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timeH.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
}
