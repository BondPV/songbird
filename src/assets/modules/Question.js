//Класс, представляющий вопрос
export default class Question {
  constructor(name, audio, answers) {
    this.name = name;
    this.answers = answers;
    this.audio = audio;
  }

  Click(index) {
    return this.answers[index].value;
  }
}