import { getTimeString } from './modules/timeStringFormatter';
import { shuffle } from './modules/shuffle';
import './modules/flickity.min.css';
import './modules/style.scss';
import Flickity from 'flickity-bg-lazyload';
import { imgOptions } from './modules/flkOptions';


let isTimer = false;

const photoViewer = document.querySelector('.photo-app');

// DOM Elements
const progress = document.querySelector('.progress'),
      timer = document.querySelector('.timer');
// Timer Elements 
const totalSeconds = 1500;
let currentSecond = totalSeconds,
    interval,
    isPaused = true;
const playBtn = document.querySelector('.btn.go'),
      replayBtn = document.querySelector('.btn.replay'),
      resetBtn = document.querySelector('.btn.halt');

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
  const toggleTimer = (e) => {
    isPaused = !isPaused;
    if (!isPaused) {
      interval = setInterval(countDown, 1000);
    } else {
      clearInterval(interval);
    }
    togglePlayBtn('pause');
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

const photoViewerApp = () => {
  const fetchList = () => {
    fetch(`data/images.json`)
      .then(res => res.json())
      .then(resString => {
        hidePreloader();
        createFlktyString(shuffle(Array.from(resString)));
      })
      .catch(err => console.log(err));
  };

  const assetString = (filename) => {
    return `<div class="carousel-cell" data-flickity-bg-lazyload='${filename}'></div>`;
  }
  const createFlktyString = (fileArray) => {
    const viewer = document.querySelector('.photo-app .main-carousel');
    viewer.innerHTML = fileArray.map(filename => assetString(filename)).join('');
    console.log(viewer);
  }
  const launchFlkty = () => {
    const viewer = photoViewer;
    const carousel = viewer.querySelector('.main-carousel');
    const loadOption = imgOptions;
    viewer.style.display = "flex";
    // setTimeout(() => { viewer.style.opacity = 1 }, 0);
    // setTimeout(() => { toggleFullscreen("on") }, 500);
    const flkty = new Flickity(carousel, loadOption);
    flkty.resize();
  }
  const init = async () => {
    // fetchList("images");
    const imgList = await fetch(`data/images.json`);
    const json = await imgList.json();
    await createFlktyString(shuffle(Array.from(json)));
    await launchFlkty();
    // resourceType => {
    //   fetch(`data/${resourceType}.json`)
    //     .then(res => res.json())
    //     .then(resString => {
    //       hidePreloader();
    //       createFlktyString(shuffle(Array.from(resString)), resourceType);
    //     })
    //     .catch(err => console.log(err));
    // };
  }
  init();
}

window.onload = function() {
  photoViewerApp();
  timerApp();
  const toggleApps = () => {
    document.querySelector('.photo-app').classList.toggle('isHidden');
    document.querySelector('.timer-app').classList.toggle('isHidden');
  }
  document.querySelector('.toggle-apps').addEventListener('click', toggleApps);

}