//Класс, который представляет тест
export default class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.score = 0;
    //Номер результата из массива
    this.result = 0;
    //Номер текущего вопроса
    this.current = 0;
    //количество кликов
    this.click = 0;
    this.answerIsReceived = false;
  }

  Click(index) {
    //Добавляем очки
    let value = this.questions[this.current].Click(index);
    let correct = -1;
    //Если было добавлено хотя бы одно очко, то считаем, что ответ верный
    if(!this.answerIsReceived && value >= 1) {
      correct = index;
      this.answerIsReceived = true;
      if (this.click <= 5) { 
        this.score += 5 - this.click; 
      }
    } else {
      this.click++;
      }
      
    return correct;
  }

  //Переход к следующему вопросу
  Next() {
    this.current++;
    this.click = 0;
    this.answerIsReceived = false;
  }
}


