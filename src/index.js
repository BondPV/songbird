'use strict';

import birdsData from './assets/modules/birds';
import btnPageUp from './assets/modules/pageUp';

import Quiz from './assets/modules/Quiz';
import Question from './assets/modules/Question';
import Answer from './assets/modules/Answer';
import AnswerDescr from './assets/modules/AnswerDescr';
import AudioPlayer from './assets/modules/AudioPlayer';

// Элементы страницы hide
const scoreField = document.querySelector('.header__score');
const quizField = document.querySelector('.quiz');
const mainPageField = document.querySelector('.main-page');
const galleryField = document.querySelector('.gallery');

// Навигационное меню
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
const answerDescription = document.querySelector('#answer-description');

const audioWin = new Audio("assets/audio/win.mp3");
const audioError = new Audio("assets/audio/error.mp3");
const video = document.querySelector('.main-page__video');
const audioPlayerQuestions = document.querySelector('#question-audio');

let audioQuestion;
let correctAnswerIsReceived = 0;
let buttonMode = 'start';

//*Массив с вопросами

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

// массив для хранения всех экземляров класса AudioPlayer
let allAudioAnswers = [];

// функция остановки воспроизведения и очистки массива allAudioAnswers
function clearAllAudioAnswers() {
  //остановливаем воспроизведение 
  allAudioAnswers.forEach(elem => audioStop(elem));
  //обнуляем массив с Audio для оптимизации памяти
  allAudioAnswers = [];
} 

let quiz = new Quiz(questions);

//*Обновление теста
function UpdateQuiz() {
  //Формируем страницу с вопросами
  document.querySelector('.quiz__question-wrapper').classList.remove('hide');
  document.querySelector('.quiz__answer').classList.remove('hide');
  document.querySelector('.congratulate').classList.add('hide');
  
  //функция кнопки
  buttonMode = 'next';

  //Проверяем, есть ли ещё вопросы
  if (quiz.current < quiz.questions.length) {
    
    //?Если есть, обновляем вопрос
    questionName.innerHTML = '******';
    audioPlayerQuestions.innerHTML = '';
    audioQuestion = new AudioPlayer(audioPlayerQuestions, 1);
    let audioSrc = quiz.questions[quiz.current].audio;
    audioQuestion.setAudio(audioSrc);

    //остановливаем воспроизведение 
    clearAllAudioAnswers();

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
    if (quiz.score < 30) {
      document.querySelector('.congratulate__title').innerHTML = 'Попробуйте еще раз!';
    }
  
  //остановливаем воспроизведение 
  clearAllAudioAnswers();
  }
}

//* Обработчик на созданные кнопки ответов
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

//* Функция нажатия на кнопку ответа
function Click(index) {
  //Получаем номер правильного ответа
  let correct = quiz.Click(index);
  
  //Находим все кнопки
  let answerList = document.querySelectorAll(".quiz__answer-item");
  
  // Создаем HTML разметку для ответа
  answerDescription.innerHTML = '';
  
  let answerImage = quiz.questions[quiz.current].answers[index].image;
  let answerName = quiz.questions[quiz.current].answers[index].name;
  let answerSpecies = quiz.questions[quiz.current].answers[index].species;
  let answerDescr = quiz.questions[quiz.current].answers[index].description;
  
  new AnswerDescr(answerDescription, index, answerImage, answerName, answerSpecies, answerDescr);
  
  //добавляем плеер в разметку
  let audioPlayerAnswers = document.querySelector('#answer-audio');
  let audioAnswer = new AudioPlayer(audioPlayerAnswers, 0, allAudioAnswers);
  
  //добавляем в плеер источник audio
  const audioAnswerSrc = quiz.questions[quiz.current].answers[index].audio;
  audioAnswer.setAudio(audioAnswerSrc);
  
  //? Проверяем ответ
  if(correct >= 0 && correctAnswerIsReceived === 0) {
    correctAnswerIsReceived = 1;
    answerList[correct].classList.add("quiz__answer-item_yes");
    questionName.innerHTML = quiz.questions[quiz.current].answers[index].name;
    questionImage.src = quiz.questions[quiz.current].answers[index].image;
    audioStop(audioError);
    audioStop(audioWin);
    audioWin.play();
    score.innerHTML = quiz.score;

    //останавливаем воспроизведение "вопроса" при правильном ответе
    audioQuestion.audio.pause();

    //активируем кнопку следующего вопроса
    gameButton.classList.remove('game-button_disable');
  }

  if(index != correct && correctAnswerIsReceived === 0) {
    answerList[index].classList.add("quiz__answer-item_no");
    audioStop(audioError);
    audioStop(audioWin);
    audioError.play();
  }

  //остановливаем воспроизведение 
  allAudioAnswers.forEach(elem => audioStop(elem));
}

// наполнение галлереи карточками
function createGallary() {
  const wrapper = galleryField;
  for (let i = 0; i < quiz.questions.length; i++ ) {
      for (let j = 0; j <= 5; j++) {
        const cardWrap = document.createElement('div');
        cardWrap.classList.add('gallery__card');
        wrapper.append(cardWrap);
        
        let image = quiz.questions[i].answers[j].image;
        let name = quiz.questions[i].answers[j].name;
        let species = quiz.questions[i].answers[j].species;
        let descr = quiz.questions[i].answers[j].description;
        new AnswerDescr(cardWrap, 0, image, name, species, descr);
  
        const audioPlayerPosition = cardWrap.querySelector('.audio-player');
        const audioCard = new AudioPlayer(audioPlayerPosition, 0);
  
        const audioSrc = quiz.questions[i].answers[j].audio;
        audioCard.setAudio(audioSrc);
      }
    }
  } 

//*меню навигации
linkGame.addEventListener('click', getQuizPage);
linkMainPage.addEventListener('click', getMainPage);
linkGallery.addEventListener('click', getGallaryPage);

//*инициализация главной страницы
function getMainPage() {
  linkGame.classList.remove('menu__link_active');
  linkGallery.classList.remove('menu__link_active');
  linkMainPage.classList.add('menu__link_active');

  scoreField.classList.add('hide');
  quizField.classList.add('hide');
  galleryField.classList.add('hide');
  mainPageField.classList.remove('hide');

  video.play();
}

//*переходим на страницу с викториной
startButton.addEventListener('click', getQuizPage);

function getQuizPage() {
  window.location.hash = 'game';
  linkMainPage.classList.remove('menu__link_active');
  linkGallery.classList.remove('menu__link_active');
  linkGame.classList.add('menu__link_active');

  scoreField.classList.remove('hide');
  quizField.classList.remove('hide');
  mainPageField.classList.add('hide');
  galleryField.classList.add('hide');

  video.pause();
  
  questionImage.src = 'assets/images/bird.jpg';
  answerDescription.innerHTML = `<p>Послушайте плеер.<br>Выберите птицу из списка</p>`;
  gameButton.innerHTML = "Следующий вопрос";

  UpdateQuiz();
}

//* переходим на страницу с галереей

function getGallaryPage() {
  window.location.hash = 'gallery';
  linkGame.classList.remove('menu__link_active');
  linkMainPage.classList.remove('menu__link_active');
  linkGallery.classList.add('menu__link_active');

  scoreField.classList.add('hide');
  quizField.classList.add('hide');
  mainPageField.classList.add('hide');
  video.pause();
  
  galleryField.classList.remove('hide');
  createGallary(questions);

  //прокрутка страницы вверх
  btnPageUp.addEventListener();
}

//*отслеживание нажатий на кнопку Game
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

// роутинг страницы
initRouter();

function initRouter() {
  addEventListener('hashchange', handleHash);
  handleHash();
}

function handleHash() {
  const hash = location.hash ? location.hash.slice(1) : '';
  if (hash === 'main' || hash === '') {
    getMainPage();
  }

  if (hash === 'game') {
    getQuizPage();
  }

  if (hash === 'gallery') {
    getGallaryPage();
  }
}

// Самооценка задания
const crossCheck = {
  'https://github.com/rolling-scopes-school/tasks/blob/master/tasks/songbird/songbird-2022q3.md' : 'итог 260 баллов',
  'Вёрстка, дизайн, UI всех трёх страниц приложения +60' : 60,
  'Аудиоплеер +30 (у аудиоплеера есть регулятор громкости звука, в карточках регулятор отключен целенаправленно)' : 30,
  'Верхняя панель страницы викторины +20' : 20,
  'Блок с вопросом +20' : 20,
  'Блок с вариантами ответов (названия птиц) +60' : 60,
  'Блок с описанием птицы: +30' : 30,
  'Кнопка перехода к следующему вопросу +30': 30,
  'Extra scope +20 (создана галерея всех птиц)' : 10,
};
console.table(crossCheck);


