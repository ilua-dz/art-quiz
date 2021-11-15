//! ------------settings

let isTimerOn;
let timerTime;
let isVolumeMute;
let soundVolume;
let isMusicPlaying;

const settingsBtn = document.querySelector('.settings-btn');
const backBtn = document.querySelector('.back-btn');
const settingsModule = document.querySelector('.settings-module');
const startModule = document.querySelector('.start-module');
let inSettings = false;

const volumeToggleBtn = document.querySelector('.volume-toggle');
const volumeInput = document.querySelector('.settings-volume-range');
const musicToggleBtn = document.querySelector('.music-toggle');
const musicVolumeInput = document.querySelector('.settings-music-range');
const timerToggleBtn = document.querySelector('.timer-toggle');
const timerInput = document.querySelector('.settings-timer-range');
const allButtons = document.querySelectorAll('._btn');
const allInputsTypeRange = document.querySelectorAll('input');

const toggleSettings = () => {
  if (!inSettings) {
    startModule.style.display = 'none';
    settingsModule.style.display = 'block';
  } else {
    startModule.style.display = 'block';
    settingsModule.style.display = 'none';
  }
  inSettings = !inSettings;
};

const smoothChange = () => {
  startModule.style.opacity = 0;
  settingsModule.style.opacity = 0;
  setTimeout(() => {
    toggleSettings();
  }, 300);
  setTimeout(() => {
    startModule.style.opacity = 1;
    settingsModule.style.opacity = 1;
  }, 400);
};

settingsBtn.addEventListener('click', smoothChange);
backBtn.addEventListener('click', smoothChange);

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
  if (localStorage.getItem('isMusicPlaying')) toggleMusic();
};

window.addEventListener('beforeunload', saveSettings);
document.addEventListener('DOMContentLoaded', () => {
  restoreSettings();
  setTimeout(restorePlayingMusic, 200);
});
