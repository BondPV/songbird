//Класс, представляющий описание ответа
export default class AnswerDescr {
  constructor(wrapperElement, index, image, name, species, description) {
    this.index = index;
    this.image = image;
    this.name = name;
    this.species = species;
    this.description = description;

    const wrapper = wrapperElement;

    this.quizDescrIndex = document.createElement('div');
    this.quizDescrIndex.classList.add('quiz__description');
    this.quizDescrIndex.classList.add(`quiz__description${this.index}`);
    wrapper.append(this.quizDescrIndex);

    this.quizQuestion = document.createElement('div');
    this.quizQuestion.classList.add('quiz__question');
    wrapper.append(this.quizQuestion);

    //картинка
    this.questionsImgWrap = document.createElement('div');
    this.questionsImgWrap.classList.add('quiz__question-img');
    this.quizQuestion.append(this.questionsImgWrap);

    this.questionsImg = document.createElement('IMG');
    this.questionsImg.src = this.image;
    this.questionsImg.alt = 'bird';
    this.questionsImgWrap.append(this.questionsImg);

    //media wrapper
    this.mediaWrapper = document.createElement('div');
    this.mediaWrapper.classList.add('quiz__media-wrapper');
    this.quizQuestion.append(this.mediaWrapper);

    // титул-имя
    this.questionsName = document.createElement('div');
    this.questionsName.classList.add('quiz__question-name');
    this.questionsName.textContent = `${this.name}`;
    this.mediaWrapper.append(this.questionsName);

    //разделитель
    this.line = document.createElement('SPAN');
    this.line.classList.add('quiz__line');
    this.mediaWrapper.append(this.line);

    // имя альтернативное
    this.questionsNameAlt = document.createElement('div');
    this.questionsNameAlt.classList.add('quiz__question-name-en');
    this.questionsNameAlt.textContent = `${this.species}`;
    this.mediaWrapper.append(this.questionsNameAlt);

    //разделитель
    this.line = document.createElement('SPAN');
    this.line.classList.add('quiz__line');
    this.mediaWrapper.append(this.line);

    //плеер
    this.audioWrapper = document.createElement('div');
    this.audioWrapper.classList.add('audio-player');
    this.audioWrapper.id = 'answer-audio';
    this.mediaWrapper.append(this.audioWrapper);

    //описание
    this.quizDescrTxt = document.createElement('div');
    this.quizDescrTxt.classList.add('quiz__description-txt');
    this.quizDescrTxt.textContent = `${this.description}`;
    wrapper.append(this.quizDescrTxt);
  }
}
