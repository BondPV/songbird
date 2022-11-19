//Класс, который представляет плеер

export default class AudioPlayer {
  constructor(wrapperElement, volumType, allAudioClassArray) {
    
    this.wrapper = wrapperElement;
    //иконки кнопок
    this.playIcon = 'assets/icons/play.svg';
    this.pauseIcon = 'assets/icons/pause.svg';
    this.speakerIcon = 'assets/icons/speaker.svg';
    this.speakerIconMute = 'assets/icons/speaker-mute.svg';
    this.volumType = volumType;
    
    this.audio = new Audio();
    //добавляем созданный Audio class в массив
    if (allAudioClassArray) {
      allAudioClassArray.push(this.audio);
    }

    //кнопка play-pause
    this.buttonPlay = document.createElement('BUTTON');
    this.buttonPlay.classList.add('audio-player__play-btn');
    this.wrapper.append(this.buttonPlay);
    
    this.buttonPlayImg = document.createElement('IMG');
    this.buttonPlayImg.classList.add('audio-player__play-btn-img');
    this.buttonPlayImg.src = this.playIcon;
    this.buttonPlayImg.alt = 'play';
    this.buttonPlay.append(this.buttonPlayImg);

    //Шкала воспроизведения
    this.timelineWrapper = document.createElement('div');
    this.timelineWrapper.classList.add('audio-player__timeline-wrapper');
    this.wrapper.append(this.timelineWrapper);
    
    this.playTimeCurrent = document.createElement('div');
    this.playTimeCurrent.classList.add('audio-player__play-time');
    this.playTimeCurrent.textContent = '00:00';
    this.timelineWrapper.append(this.playTimeCurrent);

    this.timeline = document.createElement('INPUT');
    this.timeline.classList.add('audio-player__timeline');
    this.timeline.type = 'range';
    this.timeline.max = '100';
    this.timeline.value ='0';
    this.timeline.style.backgroundSize = 0;
    this.timelineWrapper.append(this.timeline);

    this.playTimeLong = document.createElement('div');
    this.playTimeLong.classList.add('audio-player__long-time');
    this.playTimeLong.textContent = '00:00';
    this.timelineWrapper.append(this.playTimeLong);

    if (this.volumType > 0) {
      //кнопка volume
      this.buttonSpeaker = document.createElement('div');
      this.buttonSpeaker.classList.add('audio-player__speaker-btn');
      this.wrapper.append(this.buttonSpeaker);

      this.buttonSpeakerImg = document.createElement('IMG');
      this.buttonSpeakerImg.classList.add('audio-player__speaker');
      this.buttonSpeakerImg.src = this.speakerIcon;
      this.buttonSpeakerImg.alt = 'volume';
      this.buttonSpeaker.append(this.buttonSpeakerImg);

      //шкала громкости
      this.volume = document.createElement('INPUT');
      this.volume.classList.add('audio-player__volume');
      this.volume.type = 'range';
      this.volume.min = '0';
      this.volume.max = '5';
      this.volume.value ='5';
      this.wrapper.append(this.volume);
    }
  }

  setAudio(audioSrc) {
    this.audio.src = audioSrc;
    
    //продолжительность трека
    setTimeout(() => this.getLongTime(), 500);

    //play-pause
    this.buttonPlay.addEventListener('click', () => {
      this.toggleAudio();
    });

    //отчет времени воспроизведения
    this.audio.addEventListener('timeupdate', () => {
      this.getPlaybackTime();
      setTimeout(() => this.changeTimelinePosition(), 100);
    });

    this.audio.addEventListener('ended', () => this.audioEnded());

    //управление шкалой воспроизведения
    this.timeline.addEventListener('change', () => {
      this.changeSeek();
    });
    
    //управление громкостью
    if (this.volumType > 0) {
      
      this.buttonSpeaker.addEventListener('click', () => {
        this.toggleSound();
      });

      this.volume.addEventListener('change', () => {
        this.toggleVolume();
      });
    }
  }

  //Воспроизведение по кнопке
  toggleAudio() {
    if (this.audio.paused) {
      this.audio.play();
      this.buttonPlayImg.src = this.pauseIcon;
    } else {
      this.audio.pause();
      this.buttonPlayImg.src = this.playIcon;
    }
  }

  //Изменение цвета шкалы прогресса
  changeTimelinePosition() {
    this.percentagePosition = (100 * this.audio.currentTime) / this.audio.duration;
    this.timeline.style.backgroundSize = `${this.percentagePosition}% 100%`;
    this.timeline.value = this.percentagePosition;
  }

  //изменение иконки в конце трека
  audioEnded() {
    this.buttonPlayImg.src = this.playIcon;
  }

  //перемещение по шкале прогресса
  changeSeek() {
    this.time = (this.timeline.value * this.audio.duration) / 100;
    this.audio.currentTime = this.time;
  }

  //включение и выключение звука
  toggleSound() {
    this.audio.muted = !this.audio.muted;
    this.buttonSpeakerImg.src = this.audio.muted ? this.speakerIconMute : this.speakerIcon;
  }

  //функция для настройки громкости
  toggleVolume() { 
    this.audio.volume = this.volume.value / 10;
    if (this.volume.value == 0) {
      this.buttonSpeakerImg.src = this.speakerIconMute;
    } else {
      this.buttonSpeakerImg.src = this.speakerIcon;
    }
  }

  //функция вывода текущего времени воспроизведения
  getPlaybackTime() {
    const secNum = this.audio.currentTime;
    this.playTimeCurrent.textContent = this.getTimeCodeFromNum(secNum);
  }

  //функция вывода продолжительности трека
  getLongTime() {
    const secNum = this.audio.duration;
    if(secNum) {
      this.playTimeLong.textContent = this.getTimeCodeFromNum(secNum);
    } 
  }

  //пересчет секунд в минуты и секунды
  getTimeCodeFromNum(num) {
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
}







