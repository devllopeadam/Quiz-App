const startChoses = document.querySelector(".start-choses");
const toggler = document.querySelector(".toggle");
const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
const HTLM = document.querySelector("html");
const choses = [...document.querySelectorAll(".chose")];
let lightColors = ["./assets/images/icon-sun-dark.svg", "./assets/images/icon-moon-dark.svg"];
let darkColors = ["./assets/images/icon-sun-light.svg", "./assets/images/icon-moon-light.svg"];
const options = document.querySelectorAll(".option");
const theGame = document.querySelector(".the-game");
const submit = document.querySelector(".submit");
const nQBtn = document.querySelector(".next-question");
const error = document.querySelector(".error");
const prog = document.querySelector(".prog span");
const result = document.querySelector(".final-result");
const again = document.querySelector(".again");
const currentQuestionLabel = document.querySelector(".current-question-label");


// For The Animaiton on loading the window
window.onload = () => startChoses.classList.add("animation");
// Get The Theme Data From The LocalStorage

getDataFromLocalStorage();

// For The Toggler Theme
toggler.onclick = () => {
  toggler.classList.toggle("active");
  sunAndMoon();
  custmizeTheInterface();
};

function sunAndMoon() {
  if (toggler.classList.contains("active")) {
    sun.src = darkColors[0];
    moon.src = darkColors[1];
  } else {
    sun.src = lightColors[0];
    moon.src = lightColors[1];
  }
}

function custmizeTheInterface() {
  if (HTLM.dataset.theme === "dark") {
    HTLM.dataset.theme = "light";
    localStorage.setItem("theme", "light");
  } else {
    HTLM.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
  }
}

function getDataFromLocalStorage() {
  let getTheme = localStorage.getItem("theme");
  if (getTheme === "dark") {
    HTLM.dataset.theme = "dark";
    toggler.classList.add("active");
    sunAndMoon();
  }
}

// End the toggler theme

// Start Adding The Images And The Text To The Choses Interface

let getData = async () => {
  url = "./data.json";
  let data = await fetch(url);
  let objData = await data.json();
  tempData = objData;
  fitTheChoses(objData);
  hideTheStartInter(objData);
};

getData();

function fitTheChoses(objData) {
  let arData = objData.quizzes;
  for (let i = 0; i < arData.length; i++) {
    choses[i].querySelector("img").src = arData[i].icon;
    choses[i].querySelector("h4").textContent = arData[i].title;
    choses[i].querySelector("h4").setAttribute("data-name", arData[i].title);
  }
}

function hideTheStartInter(obj) {
  choses.forEach(chose => {
    chose.onclick = () => {
      startChoses.classList.add("hid");
      theGame.classList.add("show");
      let value = chose.querySelector("h4").dataset.name;
      let result = obj.quizzes.find(({ title }) => title === value);
      custmizeTheConceptSelected(result);
    };
  });
}

hideTheStartInter();

let currentQestion = 0;
let correctAnswers = 0;
let conceptSelected = null;

function custmizeTheConceptSelected(concept) {
  let img = document.querySelector(".img");
  let name = document.querySelector(".name");
  img.src = concept.icon;
  img.style.backgroundColor = concept.bgcolor;
  name.textContent = concept.title;
  conceptSelected = concept;
  makeQuestion(concept);
}

function makeQuestion(concept) {
  if (currentQestion <= 9) {
    let question = document.querySelector(".question");
    currentQuestionLabel.textContent = currentQestion + 1;
    let questions = concept.questions;
    question.textContent = questions[currentQestion].question;

    for (let i = 0; i < questions[currentQestion].options.length; i++) {
      options[i].querySelector("h4").textContent = questions[currentQestion].options[i];
    }
  }
}

// End Of Adding The Images And The Text To The Choses Interface

// For the option selection
let ar = [];
options.forEach(option => option.onclick = () => selectOption(option));

function selectOption(option) {
  error.classList.remove("show");
  options.forEach(option => option.classList.remove("selected"));
  option.classList.add("selected");
  ar.push(option);
}

submit.onclick = () => custmizeTheInterfaceOnsubmit();
nQBtn.onclick = () => custmizeTheInterfaceOnNextQuetion();
again.onclick = () => window.location.reload(true);

function custmizeTheInterfaceOnsubmit() {
  if (ar.length !== 0) {
    showStatusQuestions(conceptSelected.questions[currentQestion]);
    getTheSelectedByTheUser(ar[ar.length - 1], conceptSelected.questions[currentQestion]);
    if (currentQestion !== conceptSelected.questions.length - 1) { submit.classList.add("clicked"); }
    ar = [];
  } else {
    error.classList.add("show");
  }
  if (submit.classList.contains("clicked")) nQBtn.style.display = "block";
  if (currentQestion === conceptSelected.questions.length - 1) {
    submit.textContent = "Show Results";
    submit.onclick = () => showTheResults();
  }
}

function custmizeTheInterfaceOnNextQuetion() {
  removeStatusQuestions();
  currentQestion += 1;
  fitTheProg();
  makeQuestion(conceptSelected);
  nQBtn.style.display = "none";
  submit.classList.remove("clicked");
}

function showStatusQuestions(conceptSelected) {
  const goodAnswer = conceptSelected.answer;
  options.forEach(option => option.querySelector("h4").textContent !== goodAnswer ? option.classList.add("incorrect") : option.classList.add("correct"));
}

function removeStatusQuestions() {
  options.forEach(option => {
    option.classList.remove("selected");
    option.classList.contains("incorrect") ? option.classList.remove("incorrect") : option.classList.remove("correct");
  });
}

function getTheSelectedByTheUser(selected, currentSelecteds) {
  if (currentSelecteds.answer === selected.querySelector("h4").textContent) correctAnswers++;
}
let value = 10;
function fitTheProg() {
  if (value !== 100) {
    let dynamiqueWidth = 100 / conceptSelected.questions.length;
    value += dynamiqueWidth;
    prog.dataset.width = value + "%";
    prog.style.width = prog.dataset.width;
  }
}

function showTheResults() {
  theGame.style.display = "none";
  result.classList.add("show");
  document.querySelector(".img-result").src = conceptSelected.icon;
  document.querySelector(".img-result").style.backgroundColor = conceptSelected.bgcolor;
  document.querySelector(".name-result").textContent = conceptSelected.title;
  fromZeroToValue(document.querySelector(".score"), correctAnswers);
}

function fromZeroToValue(ele, value) {
  let newValue = 0;
  let stop = setInterval(() => {
    ele.textContent = newValue++;
    if (newValue > value) clearInterval(stop);
  }, 200 / value);
  setTimeout(() => { showTheConfetti(); }, 200);
}

function showTheConfetti() {
  var duration = 5 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}
