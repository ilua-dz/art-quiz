/* eslint-disable no-param-reassign */
//! ------------settings

let isTimerOn;
let timerTime;
let isVolumeMute;
let soundVolume;
let isMusicPlaying;

const settingsBtn = document.querySelector('.settings-btn');
const controlsBtn = document.querySelector('.controls-btn');
const backBtns = document.querySelectorAll('.back-btn');
const settingsModule = document.querySelector('.settings-module');
const startModule = document.querySelector('.start-module');
const controlsModule = document.querySelector('.controls-module');

const volumeToggleBtn = document.querySelector('.volume-toggle');
const volumeInput = document.querySelector('.settings-volume-range');
const musicToggleBtn = document.querySelector('.music-toggle');
const musicVolumeInput = document.querySelector('.settings-music-range');
const timerToggleBtn = document.querySelector('.timer-toggle');
const timerInput = document.querySelector('.settings-timer-range');
const allButtons = document.querySelectorAll('._btn');
const allInputsTypeRange = document.querySelectorAll('input');

const allModules = [startModule, settingsModule, controlsModule];

const smoothChange = (menu) => {
  allModules.forEach((module) => { module.style.opacity = '0'; });
  setTimeout(() => {
    allModules.forEach((module) => { module.style.display = 'none'; });
    menu.style.display = 'block';
  }, 300);
  setTimeout(() => {
    allModules.forEach((module) => { module.style.opacity = '1'; });
  }, 400);
};
controlsBtn.addEventListener('click', () => smoothChange(controlsModule));
settingsBtn.addEventListener('click', () => smoothChange(settingsModule));
backBtns.forEach((btn) => {
  btn.addEventListener('click', () => smoothChange(startModule));
});

const audioObj = {
  click: './assets/sounds/click.mp3',
  bgMusic: './assets/sounds/playback.weba',
};

const audio = document.createElement('audio');

const bgAudio = document.createElement('audio');
bgAudio.src = audioObj.bgMusic;

const playSound = (src) => {
  if (!isVolumeMute) {
    audio.src = audioObj[src];
    audio.play();
  }
};

allButtons.forEach((btn) => {
  btn.addEventListener('click', () => playSound('click'));
});
allInputsTypeRange.forEach((input) => {
  input.addEventListener('change', () => playSound('click'));
});

const toggleVolume = () => {
  volumeToggleBtn.classList.toggle('fa-volume-slash');
  volumeToggleBtn.classList.toggle('fa-volume');
  isVolumeMute = !isVolumeMute;
  volumeInput.value = isVolumeMute ? 0 : soundVolume * 100;
};

const changeVolume = () => {
  soundVolume = volumeInput.value / 100;
  audio.volume = soundVolume;
  volumeToggleBtn.className = soundVolume
    ? 'fa-thin fa-volume decorate-button fa-sizing volume-toggle _btn'
    : 'fa-thin fa-volume-slash decorate-button fa-sizing volume-toggle _btn';
  if (soundVolume) isVolumeMute = false;
};
changeVolume();

const toggleTimer = () => {
  timerTime = timerInput.value;
  timerToggleBtn.classList.toggle('fa-hourglass-clock');
  timerToggleBtn.textContent = isTimerOn ? '' : timerTime;
  isTimerOn = !isTimerOn;
  timerInput.disabled = !isTimerOn;
};

const changeTimer = () => {
  timerTime = timerInput.value;
  if (isTimerOn) timerToggleBtn.textContent = timerTime;
};

const toggleMusic = () => {
  musicToggleBtn.classList.toggle('fa-music');
  musicToggleBtn.classList.toggle('fa-music-slash');
  if (isMusicPlaying) bgAudio.pause();
  else bgAudio.play();
  isMusicPlaying = !isMusicPlaying;
};

const changeMusicVolume = () => {
  bgAudio.volume = musicVolumeInput.value / 100;
};

volumeToggleBtn.addEventListener('click', toggleVolume);
volumeInput.addEventListener('input', changeVolume);

musicToggleBtn.addEventListener('click', toggleMusic);
musicVolumeInput.addEventListener('input', changeMusicVolume);

timerToggleBtn.addEventListener('click', toggleTimer);
timerInput.addEventListener('input', changeTimer);

const LSsetBooleanItem = (item, storageItem) => {
  if (item) localStorage.setItem(storageItem, '1');
  else localStorage.removeItem(storageItem);
};

const saveSettings = () => {
  localStorage.setItem('volume', audio.volume);
  localStorage.setItem('musicVolume', bgAudio.volume);
  LSsetBooleanItem(isVolumeMute, 'isVolumeMute');
  LSsetBooleanItem(isMusicPlaying, 'isMusicPlaying');
  LSsetBooleanItem(isTimerOn, 'isTimerOn');
  localStorage.setItem('timerTime', timerInput.value);
};

const restoreSettings = () => {
  if (localStorage.getItem('volume')) {
    soundVolume = localStorage.getItem('volume');
  } else {
    soundVolume = 0.6;
  }
  audio.volume = soundVolume;
  volumeInput.value = audio.volume * 100;
  if (localStorage.getItem('isVolumeMute')) toggleVolume();

  if (localStorage.getItem('musicVolume')) {
    bgAudio.volume = localStorage.getItem('musicVolume');
  } else {
    bgAudio.volume = 0.6;
  }
  musicVolumeInput.value = bgAudio.volume * 100;

  if (localStorage.getItem('timerTime')) {
    timerInput.value = localStorage.getItem('timerTime');
    changeTimer();
  }
  if (localStorage.getItem('isTimerOn')) {
    toggleTimer();
  } else timerInput.disabled = true;
};

const restorePlayingMusic = () => {
  const track = new Audio(audioObj.bgMusic);
  track.onloadeddata = () => {
    if (localStorage.getItem('isMusicPlaying')) {
      bgAudio.src = track.src;
      toggleMusic();
    }
  };
  window.removeEventListener('mousedown', restorePlayingMusic);
};

window.addEventListener('mousedown', restorePlayingMusic);

window.addEventListener('beforeunload', saveSettings);
window.addEventListener('load', () => {
  restoreSettings();
});

//! -----getGallery

// async function getGallery() {
//   const res = await fetch('./assets/gallery/gallery_data.json');
//   const data = await res.json();
//   const category = [];
//   for (let i = 0; i < data.length; i += 1) {
//     const item = data[i].category;
//     if (!category.some((el) => el === item)) category.push(item);
//   }
//   console.log(category);
//   category.forEach((cat) => {
//     console.log(data.filter((item) => item.category === cat));
//   });
// }

// getGallery();
