//Класс, представляющий ответ
export default class Answer {
  constructor(name, species, description, image, audio, value) {
    this.name = name;
    this.species = species;
    this.description = description;
    this.image = image;
    this.audio = audio;
    this.value = value;
  }
}