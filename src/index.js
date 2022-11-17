'use strict';

import Quiz from './assets/modules/Quiz';
import Question from './assets/modules/Question';
import Answer from './assets/modules/Answer';

import AudioPlayer from './assets/modules/AudioPlayer';


const audioPlayerQuestions = document.querySelector('#question-audio');
let audioRandom;


import birdsData from './assets/modules/birds';


const playerButton = document.querySelector('.audio-player__play-btn');
const playTime = document.querySelector('.audio-player__play-time');
const longTime = document.querySelector('.audio-player__long-time');
const timeline = document.querySelector('.audio-player__timeline');
const soundButton = document.querySelector('.audio-player__speaker-btn');
const volume = document.querySelector('.audio-player__volume');

const playIcon = '<img src="assets/icons/play.svg" alt="play" class="audio-player__play-btn-img">';
const pauseIcon = '<img src="assets/icons/pause.svg" alt="pause" class="audio-player__play-btn-img">';

const soundIcon = '<img src="assets/icons/speaker.svg" alt="Volume" class="audio-player__speaker">';
const muteIcon = '<img src="assets/icons/speaker-mute.svg" alt="Volume" class="audio-player__speaker">';




const linkMainPage = document.querySelector('#link-main-page');
const linkGame = document.querySelector('#link-game');
const linkGallery = document.querySelector('#link-gallery');

const score = document.querySelector('#score');
const scoreEnd = document.querySelector('#score-end');

const numberOfQuestions = document.querySelectorAll('.quiz__category-list');
const gameButton = document.querySelector('#button-next');
const startButton = document.querySelector('#button-start');
const questionName = document.querySelector('#question-name');
const questionImage = document.querySelector('#question-img');
const answerList = document.querySelector('.quiz__answer-options');

const questionAudio = document.querySelector('#question-audio');
const answerDescription = document.querySelector('#answer-description');

const audioWin = new Audio("assets/audio/win.mp3");
const audioError = new Audio("assets/audio/error.mp3");

let correctAnswerIsReceived = 0;
let buttonMode = 'start';



let isPlaying = false;



//Воспроизведение по кнопке
function toggleAudio (audio) {
  if (audio.paused) {
    audio.play();
    playerButton.innerHTML = pauseIcon;
  } else {
    audio.pause();
    playerButton.innerHTML = playIcon;
  }
}


//playerButton.addEventListener('click', () => toggleAudio(audioQuestion));

//изменение цвета шкалы прогресса
function changeTimelinePosition (audio) {
  const percentagePosition = (100 * audio.currentTime) / audio.duration;
  timeline.style.backgroundSize = `${percentagePosition}% 100%`;
  timeline.value = percentagePosition;
}

//audioQuestion.ontimeupdate = changeTimelinePosition(audioQuestion);

//изменение иконки в конце трека
function audioEnded (audio) {
  playerButton.innerHTML = playIcon;
}

//audio.onended = audioEnded;

//*перемещение по шкале прогресса
function changeSeek (audio) {
  const time = (timeline.value * audio.duration) / 100;
  audio.currentTime = time;
}

//timeline.addEventListener('change', () => changeSeek(audioQuestion));

// включение и выключение звука
function toggleSound (audio) {
  audio.muted = !audio.muted;
  soundButton.innerHTML = audio.muted ? muteIcon : soundIcon;
}



//функция для настройки громкости
// function toggleVolume(audio) { 
//   audio.volume = volume.value / 10;
//   audio.muted = !audio.muted;
//   soundButton.innerHTML = soundIcon;
// }

// volume.addEventListener('change', () => toggleVolume(audioQuestion));

//*пересчет секунд в минуты:секунды

function getTimeCodeFromNum(num) {
  let hours = Math.floor(num / 3600);
  let minutes = Math.floor((num - (hours * 3600)) / 60);
  let seconds = num - (hours * 3600) - (minutes * 60);
  
  seconds = Math.round(seconds);
  if (hours < 10) {
    hours   = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds; 
  } 
  return minutes + ':' + seconds;
}

//*функция вывода текущего времени воспроизведения
function getPlaybackTime(audio) {
  const secNum = audio.currentTime;
  playTime.innerHTML = getTimeCodeFromNum(secNum); 
}

//audioQuestion.addEventListener('timeupdate', () => getPlaybackTime(audioQuestion));

//*функция вывода продолжительности трека
function getLongTime(audio) {
  const secNum = audio.duration;
  if(secNum) {
  longTime.innerHTML = getTimeCodeFromNum(secNum);
  } 
}

//TODO Постоянно обновляется, надо переделать
//audioQuestion.addEventListener('timeupdate', () => getLongTime(audioQuestion));







// викторина
// //Класс, который представляет сам тест
// class Quiz {
//   constructor(questions) {
//     this.questions = questions;
//     this.score = 0;
//     //Номер результата из массива
//     this.result = 0;
//     //Номер текущего вопроса
//     this.current = 0;
//     //количество кликов
//     this.click = 0;
//   }

//   Click(index) {
//     //Добавляем очки
//     let value = this.questions[this.current].Click(index);
//     let correct = -1;
//     //Если было добавлено хотя бы одно очко, то считаем, что ответ верный
//     if(value >= 1) {
//       correct = index;
//       this.score += 5 - this.click;
//     } else {
//       this.click++;
//       }
      
//     return correct;
//   }

//    //Переход к следующему вопросу
//   Next() {
//     this.current++;
//     this.click = 0;
//   }
// }

// //Класс, представляющий вопрос
// class Question {
//   constructor(name, audio, answers) {
//     this.name = name;
//     this.answers = answers;
//     this.audio = audio;
//   }

//   Click(index) {
//     return this.answers[index].value;
//   }
// }

// //Класс, представляющий ответ
// class Answer {
//   constructor(name, species, description, image, audio, value) {
//     this.name = name;
//     this.species = species;
//     this.description = description;
//     this.image = image;
//     this.audio = audio;
//     this.value = value;
//   }
// }

//Массив с вопросами

let questions = createQuestionsList(birdsData);

function createQuestionsList(array) {
  const questions = [];
  for (let i = 0; i < array.length; i++ ) {
    const answers = [];
    const random = Math.floor(Math.random()*array[i].length);
    const randomQuestion = array[i][random];
    for (let j = 0; j < array[i].length; j++) {
      let answer = array[i][j];
      if (j === random) {
        answers.push(new Answer(answer.name, answer.species, answer.description, answer.image, answer.audio, 1));
      } else {
        answers.push(new Answer(answer.name, answer.species, answer.description, answer.image, answer.audio, 0));
      }
    }
    questions.push(new Question(randomQuestion.name, randomQuestion.audio, answers));
  } 
  return questions;
}


let quiz = new Quiz(questions);

//Обновление теста
function UpdateQuiz() {
  //Формируем страницу с вопросами
  document.querySelector('.quiz__question-wrapper').classList.remove('hide');
  document.querySelector('.quiz__answer').classList.remove('hide');
  document.querySelector('.congratulate').classList.add('hide');
  
  //функция кнопки
  buttonMode = 'next';

  //!Проверяем, есть ли ещё вопросы
  if (quiz.current < quiz.questions.length) {
    //Если есть, меняем вопрос
    questionName.innerHTML = quiz.questions[quiz.current].name;

    console.dir(audioRandom);
    let audioSrc = quiz.questions[quiz.current].audio;

    audioRandom.setAudio(audioSrc);




    // const audioPlayerQuestions = new AudioPlayer(quiz.questions[quiz.current].audio);
    // questionAudio.src = audioPlayerQuestions.audio.src;

    // console.log(audioPlayerQuestions);
    // console.log(questionAudio.src);
    
    

    
    //Удаляем старые варианты ответов
    answerList.innerHTML = "";
    //Создаём кнопки для новых вариантов ответов
    for(let i = 0; i < quiz.questions[quiz.current].answers.length; i++) {
      let li = document.createElement("li");
      li.className = "quiz__answer-item";
      li.innerHTML = quiz.questions[quiz.current].answers[i].name;
      li.setAttribute("index", i);
      answerList.append(li);
    }
    //Выводим номер текущего вопроса
    if (quiz.current === 0) {
    numberOfQuestions[quiz.current].classList.add('active');
    } else {
      numberOfQuestions[quiz.current-1].classList.remove('active');
      numberOfQuestions[quiz.current].classList.add('active');
    }
    
    //Вызываем функцию, которая прикрепит события к новым кнопкам
    Init();
  } else {
    //Если это конец, то выводим результат
    document.querySelector('.quiz__question-wrapper').classList.add('hide');
    document.querySelector('.quiz__answer').classList.add('hide');
    document.querySelector('.congratulate').classList.remove('hide');
    scoreEnd.innerHTML = quiz.score;
    gameButton.innerHTML = "Попробовать еще раз!";
    buttonMode = 'end';
    gameButton.classList.remove('game-button_disable');
    numberOfQuestions.forEach (item => item.classList.remove('active'));
  }
}

function Init() {
  //Находим все кнопки
  let answerList = document.querySelectorAll(".quiz__answer-item");

  for(let i = 0; i < answerList.length; i++) {
    //При нажатии на кнопку будет вызываться функция Click()
    answerList[i].addEventListener('click', (event) => { 
    Click(event.target.getAttribute("index")); 
    });
  }
}

function audioStop(audio) {
  audio.pause();
  audio.currentTime = 0;
}

function Click(index) {

  //Получаем номер правильного ответа
  let correct = quiz.Click(index);
  //Находим все кнопки
  let answerList = document.querySelectorAll(".quiz__answer-item");
      
  if(correct >= 0 && correctAnswerIsReceived === 0) {
    correctAnswerIsReceived = 1;
    answerList[correct].classList.add("quiz__answer-item_yes");
    questionName.innerHTML = quiz.questions[quiz.current].answers[index].name;
    questionImage.src = quiz.questions[quiz.current].answers[index].image;
    audioStop(audioError);
    audioStop(audioWin);
    audioWin.play();
    score.innerHTML = quiz.score;
    
    gameButton.classList.remove('game-button_disable');
  }

  if(index != correct && correctAnswerIsReceived === 0) {
    answerList[index].classList.add("quiz__answer-item_no");
    audioStop(audioError);
    audioStop(audioWin);
    audioError.play();
  }



  
  // console.log(audioRandom);

  // audioRandom.src =  quiz.questions[quiz.current].answers[index].audio;

  answerDescription.innerHTML = (`
  <div class="quiz__description quiz__description${index}">
    <div class="quiz__question">
      <div class="quiz__question-img"><img src="${quiz.questions[quiz.current].answers[index].image}" alt="bird"></div>
      <div class="quiz__media-wrapper">
        <div class="quiz__question-name">${quiz.questions[quiz.current].answers[index].name}</div>
        <span class="quiz__line"></span>
        <div class="quiz__question-name-en">${quiz.questions[quiz.current].answers[index].species}</div>
        <span class="quiz__line"></span>
        <div class="audio-player">
          <audio class="audio-player__audio" src="" type="audio/mp3" preload = "metadata" controls>
          </audio>
          <button class="audio-player__play-btn play-btn">
            <img src="assets/icons/play.svg" alt="play" class="audio-player__play-btn-img">
          </button>
          <div class="audio-player__timeline-wrapper">
            <div class="audio-player__play-time">00:00</div>
            <input type="range" class="audio-player__timeline" max="100" value="0">
            <div class="audio-player__long-time">00:00</div>
          </div>
        </div>
      </div>
    </div>
    <div class="quiz__description-txt">${quiz.questions[quiz.current].answers[index].description}</div>
  </div>
  `);

console.dir(document.querySelector('.audio-player__audio'));



  //отслеживание нажатий на кнопку Play
  answerDescription.addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains("play-btn")) {
        console.log(1);
        audioRandom.playStart();
      }
    });
    



console.log(score);

  
}





//!меню навигации
linkGame.addEventListener('click', getQuizPage);
linkMainPage.addEventListener('click', getMainPage);

//!инициализация главной страницы
function getMainPage() {
  document.querySelector('.header__score').classList.add('hide');
  document.querySelector('.quiz').classList.add('hide');
  document.querySelector('.main-page').classList.remove('hide');

  document.querySelector('.main-page__video').play();
}

//!переходим на страницу с викториной
startButton.addEventListener('click', getQuizPage);

function getQuizPage() {
  document.querySelector('.header__score').classList.remove('hide');
  document.querySelector('.quiz').classList.remove('hide');
  document.querySelector('.main-page').classList.add('hide');

  document.querySelector('.main-page__video').pause();
  
  audioRandom = new AudioPlayer(audioPlayerQuestions, 1);

  questionImage.src = 'assets/images/bird.jpg';
  answerDescription.innerHTML = `<p>Послушайте плеер.<br>Выберите птицу из списка</p>`;

  gameButton.innerHTML = "Следующий вопрос";
  UpdateQuiz();
}

//!отслеживание нажатий на кнопку Game

gameButton.addEventListener('click', pressGameButton);

function pressGameButton() {
  if (buttonMode === 'next' && correctAnswerIsReceived === 1) {
    quiz.Next();
    correctAnswerIsReceived = 0;
    gameButton.classList.add('game-button_disable');
    questionImage.src = 'assets/images/bird.jpg';
    answerDescription.innerHTML = `<p>Послушайте плеер.<br>Выберите птицу из списка</p>`;
    UpdateQuiz();

  } else if (buttonMode === 'end') {
    gameButton.innerHTML = "Следующий вопрос";
    quiz.score = 0;
    score.innerHTML = quiz.score;
    questions = createQuestionsList(birdsData);
    quiz = new Quiz(questions);
    UpdateQuiz();
  } 
}







