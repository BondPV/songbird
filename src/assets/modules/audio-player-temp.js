const playerButton = document.querySelector('.audio-player__play-btn');
const audio = document.querySelector('.audio-player__audio');
const playTime = document.querySelector('.audio-player__play-time');
const longTime = document.querySelector('.audio-player__long-time');
const timeline = document.querySelector('.audio-player__timeline');
const soundButton = document.querySelector('.audio-player__speaker-btn');
const volume = document.querySelector('.audio-player__volume');

const playIcon = '<img src="assets/icons/play.svg" alt="play" class="audio-player__play-btn-img">';
const pauseIcon = '<img src="assets/icons/pause.svg" alt="pause" class="audio-player__play-btn-img">';

const soundIcon = '<img src="assets/icons/speaker.svg" alt="Volume" class="audio-player__speaker">';
const muteIcon = '<img src="assets/icons/speaker-mute.svg" alt="Volume" class="audio-player__speaker">';

let isPlaying = false;

// Воспроизведение по кнопке
function toggleAudio () {
  if (audio.paused) {
    audio.play();
    playerButton.innerHTML = pauseIcon;
    isPlaying = false;
  } else {
    audio.pause();
    playerButton.innerHTML = playIcon;
    isPlaying = true;
  }
}

playerButton.addEventListener('click', toggleAudio);

//изменение цвета шкалы прогресса
function changeTimelinePosition () {
  const percentagePosition = (100 * audio.currentTime) / audio.duration;
  timeline.style.backgroundSize = `${percentagePosition}% 100%`;
  timeline.value = percentagePosition;
}

audio.ontimeupdate = changeTimelinePosition;

//изменение иконки в конце трека
function audioEnded () {
  playerButton.innerHTML = playIcon;
}

audio.onended = audioEnded;

//перемещение по шкале прогресса
function changeSeek () {
  const time = (timeline.value * audio.duration) / 100;
  audio.currentTime = time;
}

timeline.addEventListener('change', changeSeek);

// включение и выключение звука
function toggleSound () {
  audio.muted = !audio.muted;
  soundButton.innerHTML = audio.muted ? muteIcon : soundIcon;
}

soundButton.addEventListener('click', toggleSound);

//функция для настройки громкости
function toggleVolume() { 
  audio.volume = volume.value / 10;
  audio.muted = !audio.muted;
  soundButton.innerHTML = soundIcon;
}

volume.addEventListener('change', toggleVolume);

//пересчет секунд в минуты:секунды

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

//функция вывода текущего времени воспроизведения
function getPlaybackTime() {
  const secNum = audio.currentTime;
  playTime.innerHTML = getTimeCodeFromNum(secNum); 
}

audio.addEventListener('timeupdate', getPlaybackTime);

//функция вывода продолжительности трека
function getLongTime() {
  const secNum = audio.duration;
  if(secNum) {
  longTime.innerHTML = getTimeCodeFromNum(secNum);
  } 
}

audio.addEventListener('timeupdate', getLongTime);


export default audioPlayer;