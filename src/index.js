'use strict';
import './assets/modules/audio-player';


import birdsData from './assets/modules/birds';

const numberOfQuestions = document.querySelectorAll('.quiz__category-list');
const gameButton = document.querySelector('.game-button');
const questionName = document.querySelector('#question-name');
const questionImage = document.querySelector('#question-img');
const answerList = document.querySelector('.quiz__answer-options');

const questionAudio = document.querySelector('#question-audio');
const answerDescription = document.querySelector('#answer-description');

const audioWin = new Audio("assets/audio/win.mp3");
const audioError = new Audio("assets/audio/error.mp3");

let correctAnswerIsReceived = 0;
let buttonMode = 'next';

// викторина
//Класс, который представляет сам тест
class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.score = 0;
    //Номер результата из массива
    this.result = 0;
    //Номер текущего вопроса
    this.current = 0;
  }

  Click(index) {
    //Добавляем очки
    let value = this.questions[this.current].Click(index);
    this.score += value;
    let correct = -1;
    //Если было добавлено хотя бы одно очко, то считаем, что ответ верный
    if(value >= 1) {
      correct = index;
    } else {
      //Иначе ищем, какой ответ может быть правильным
      // for(let i = 0; i < this.questions[this.current].answers.length; i++) {
      //   if(this.questions[this.current].answers[i].value >= 1) {
      //     correct = i;
      //     break;
      //     }
      //   }
      }
    //this.Next();
    return correct;
  }

   //Переход к следующему вопросу
  Next() {
    correctAnswerIsReceived = 0;
    this.current++;
    if(this.current >= this.questions.length) {
      this.End();
    }
  }
  //Если вопросы кончились, этот метод проверит, какой результат получил пользователь
  End() {
    // for(let i = 0; i < this.results.length; i++)
    // {
    //   if(this.results[i].Check(this.score))
    //   {
    //     this.result = i;
    //   }
    // }
    //answerDescription.innerHTML = `Конец`;
  }
}



//Класс, представляющий вопрос
class Question {
  constructor(name, answers) {
    this.name = name;
    this.answers = answers;
  }

  Click(index) {
    return this.answers[index].value;
  }
}

//Класс, представляющий ответ
class Answer {
  constructor(name, species, description, image, audio, value) {
    this.name = name;
    this.species = species;
    this.description = description;
    this.image = image;
    this.audio = audio;
    this.value = value;
  }
}

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
    questions.push(new Question(randomQuestion.name, answers));
  } 
  return questions;
}


let quiz = new Quiz(questions);

UpdateQuiz();

//Обновление теста
function UpdateQuiz() {
  //Формируем страницу с вопросами
  document.querySelector('.quiz__question-wrapper').classList.remove('hide');
  document.querySelector('.quiz__answer').classList.remove('hide');
  document.querySelector('.congratulate').classList.add('hide');
  
  //функция кнопки
  buttonMode = 'next';

  //Проверяем, есть ли ещё вопросы
  if (quiz.current < quiz.questions.length) {
    //Если есть, меняем вопрос
    //console.log(questionAudio.src);
    questionName.innerHTML = quiz.questions[quiz.current].name;
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
    gameButton.innerHTML = "Попробовать еще раз!";
    buttonMode = 'end';
  //      headElem.innerHTML = quiz.results[quiz.result].text;
  //      pagesElem.innerHTML = "Очки: " + quiz.score;
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
  }

  if(index != correct && correctAnswerIsReceived === 0) {
    answerList[index].classList.add("quiz__answer-item_no");
    audioStop(audioError);
    audioStop(audioWin);
    audioError.play();
  }

  answerDescription.innerHTML = (`
  <div class="quiz__description">
    <div class="quiz__question">
      <div class="quiz__question-img"><img src="${quiz.questions[quiz.current].answers[index].image}" alt="bird"></div>
      <div class="quiz__media-wrapper">
        <div class="quiz__question-name">${quiz.questions[quiz.current].answers[index].name}</div>
        <span class="quiz__line"></span>
        <div class="quiz__question-name-en">${quiz.questions[quiz.current].answers[index].species}</div>
        <span class="quiz__line"></span>
        <div class="audio-player">
          <audio class="audio-player__audio" controls>
            <source src="${quiz.questions[quiz.current].answers[index].audio}" type="audio/mp3">
          </audio>
          <button class="audio-player__play-btn">
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
}
gameButton.addEventListener('click', pressGameButton);

function pressGameButton() {
  if (buttonMode === 'next') {
    quiz.Next();
    questionImage.src = 'assets/images/bird.jpg';
    answerDescription.innerHTML = `<p>Послушайте плеер.<br>Выберите птицу из списка</p>`;
    UpdateQuiz();
  } else if (buttonMode === 'end') {
    gameButton.innerHTML = "Следующий вопрос";
    questions = createQuestionsList(birdsData);
    quiz = new Quiz(questions);
    UpdateQuiz();
  }
}
