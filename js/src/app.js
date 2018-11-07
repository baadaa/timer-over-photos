// FIXME:
// 'imgOptions' object contains a method to hid preloader upon initial 'ready' event, which has the DOM element hardcoded in it and thus might break should HTML changes. This is a quick fix for a z-index issue in which preloader remains visible on mobile browsers.

import { getTimeString } from './modules/timeStringFormatter';
import { shuffle } from './modules/shuffle';
import './modules/flickity.min.css';
import './modules/style.scss';
import Flickity from 'flickity-bg-lazyload';
import { imgOptions } from './modules/flkOptions';

let isTimer = false;
let flkty;

// DOM Elements
const progress = document.querySelector('.progress'),
      timer = document.querySelector('.timer'),
      playBtn = document.querySelector('.btn.go'),
      replayBtn = document.querySelector('.btn.replay'),
      resetBtn = document.querySelector('.btn.halt'),
      toggleAppBtn = document.querySelector('.toggle-apps'),
      resumeAutoplay = document.querySelector('.auto-play');

// Timer Elements 
const totalSeconds = 1500;
let currentSecond = totalSeconds,
    interval,
    isPaused = true;

const timerApp = () => {
  const countDown = () => {
    currentSecond -= 1;
    const widthRatio = 1 - (currentSecond / totalSeconds);
    progress.style.width = `${widthRatio * window.innerWidth}px`;
    timer.textContent = currentSecond <= 0 ? "DONE" : getTimeString(currentSecond);
    if (currentSecond <= 0) {
      clearInterval(interval);
      progress.style.opacity = 0;
      toggleReplayBtn();
    } else {
      progress.style.opacity = 1;
    }
  }
  const toggleTimer = (e) => {
    isPaused = !isPaused;
    if (!isPaused) {
      interval = setInterval(countDown, 1000);
    } else {
      clearInterval(interval);
    }
    togglePlayBtn('pause');
  }
  const resetForReplay = () => {
    resetTimer();
    toggleReplayBtn('reset');
    toggleTimer();
  }
  const init = () => {
    timer.textContent = getTimeString(totalSeconds);
    playBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    replayBtn.addEventListener('click', resetForReplay);
  }
  init();
};
const toggleReplayBtn = (mode) => {
  if (mode==='reset') {
    replayBtn.classList.add('isHidden');
    playBtn.classList.remove('isHidden');
  } else {
    replayBtn.classList.toggle('isHidden');
    playBtn.classList.toggle('isHidden');
  }
}
const togglePlayBtn = (mode) => {
  if (mode === 'reset') {
    playBtn.querySelector('.playSvg').classList.remove('isHidden');
    playBtn.querySelector('.pauseSvg').classList.add('isHidden');
  } else {
    playBtn.querySelector('.playSvg').classList.toggle("isHidden");
    playBtn.querySelector('.pauseSvg').classList.toggle("isHidden");
  }
  if (isPaused) {
    playBtn.querySelector('.txt').textContent = mode === "pause" ? "Resume" : "Start";
  } else {
    playBtn.querySelector('.txt').textContent = "Pause"
  }
}
const resetTimer = () => {
  if (currentSecond === totalSeconds) return;
  if (currentSecond <= 0) toggleReplayBtn();
  currentSecond = totalSeconds;
  isPaused = true;
  progress.style.width = '0px';
  clearInterval(interval);
  togglePlayBtn('reset');
  timer.textContent = getTimeString(currentSecond);
}

const photoViewerApp = () => {
  const assetString = (filename) => {
    return `<div class="carousel-cell" data-flickity-bg-lazyload='${filename}'></div>`;
  }
  const createFlktyString = (fileArray) => {
    const viewer = document.querySelector('.photo-app .main-carousel');
    viewer.innerHTML = fileArray.map(filename => assetString(filename)).join('');
  }
  const launchFlkty = () => {
    const viewer = document.querySelector('.photo-app');
    const carousel = viewer.querySelector('.main-carousel');
    viewer.style.display = "flex";
    flkty = new Flickity(carousel, imgOptions);
    flkty.resize();
    flkty.on('pointerDown', function() {
      resumeAutoplay.style.opacity = .1;
    })
    toggleAppBtn.style.opacity = '.3';
  }
  const init = async () => {
    document.querySelector('.auto-play').addEventListener('click', unpauseFlkty);
    try {
      const imgList = await fetch(`data/images.json`);
      const json = await imgList.json();
      await createFlktyString(shuffle(Array.from(json)));
      await launchFlkty();
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  init();
}

const unpauseFlkty = () => {
  flkty.playPlayer();
  flkty.next(true);
  resumeAutoplay.style.opacity = 0;
}
const stopFlkty = () => {
  flkty.stopPlayer();
}
const toggleApps = () => {
  isTimer = !isTimer;
  document.querySelector('.photo-app').classList.toggle('isHidden');
  document.querySelector('.timer-app').classList.toggle('isHidden');
  document.querySelectorAll('.toggle-apps > svg').forEach(svg => {
    svg.classList.toggle('isHidden');
  })
  if (isTimer) {
    stopFlkty();
  } else {
    unpauseFlkty();
    resetTimer();
  }
}
window.onload = function() {
  photoViewerApp();
  timerApp();
  toggleAppBtn.addEventListener('click', toggleApps);
}