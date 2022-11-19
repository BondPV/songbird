const btnPageUp = {
  elem: document.querySelector('.pageup'),
  show() {
    this.elem.classList.remove('hide');
  },
  hide() {
    this.elem.classList.add('hide');
  },
  addEventListener() {
    // при прокрутке содержимого страницы
    window.addEventListener('scroll', () => {
      // определяем величину прокрутки
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
      scrollY > 400 ? this.show() : this.hide();
    });
    // при нажатии на кнопку переместим в начало страницы
    this.elem.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }
};

export default btnPageUp;