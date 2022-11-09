'use strict';


import birdsData from './assets/modules/birds';
import './assets/modules/audio-player';

let audio = birdsData[0][3].audio;

//document.querySelector('.audio-player__audio').innerHTML = `'audio'`

let src = document.querySelector('.audio-player__audio').currentSrc;

src = audio;

console.log(src);

document.querySelector('.audio-player__audio').innerHTML = `<source src="${src}" type="audio/mp3"></source>`;

let audioTrack = src;

