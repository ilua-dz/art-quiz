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
const categoriesModule = document.querySelector('.categories-module');

const header = document.querySelector('.header');
const miniHeader = document.querySelector('.mini-header');
const footer = document.querySelector('.footer');
const quizMenu = document.querySelectorAll('.quiz-type-general');

const volumeToggleBtn = document.querySelector('.volume-toggle');
const volumeInput = document.querySelector('.settings-volume-range');
const musicToggleBtn = document.querySelector('.music-toggle');
const musicVolumeInput = document.querySelector('.settings-music-range');
const timerToggleBtn = document.querySelector('.timer-toggle');
const timerInput = document.querySelector('.settings-timer-range');
const allButtons = document.querySelectorAll('._btn');
const allInputsTypeRange = document.querySelectorAll('input');

const staticModules = [startModule, settingsModule, controlsModule, categoriesModule];

const toggleClasses = (node, classes, dir = undefined) => {
  classes.forEach((cssClass) => node.classList.toggle(cssClass, dir));
};

const toggleClassOfNodes = (cssClass, nodes, dir = undefined) => {
  nodes.forEach((node) => node.classList.toggle(cssClass, dir));
};

const offClass = 'display-off';
const onClass = 'display-on';
const hideClass = 'opacity-off';

const smoothChangeModule = (onModule, ...allModules) => {
  [...allModules, footer].forEach((module) => module.classList.add(hideClass));
  setTimeout(() => {
    allModules.forEach((module) => {
      toggleClasses(module, [onClass, offClass], false);
      footer.classList.toggle(offClass);
      if (module !== onModule) module.classList.toggle(offClass);
      else module.classList.toggle(onClass);
    });
  }, 300);
  setTimeout(() => {
    [...allModules, footer].forEach((module) => module.classList.remove(hideClass));
  }, 400);
};

controlsBtn.addEventListener('click', () => smoothChangeModule(controlsModule, ...staticModules));
settingsBtn.addEventListener('click', () => smoothChangeModule(settingsModule, ...staticModules));
backBtns.forEach((btn) => {
  btn.addEventListener('click', () => smoothChangeModule(startModule, ...staticModules));
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
  toggleClasses(volumeToggleBtn, ['fa-volume-slash', 'fa-volume']);
  isVolumeMute = !isVolumeMute;
  volumeInput.value = isVolumeMute ? 0 : soundVolume * 100;
};

const changeVolume = () => {
  soundVolume = volumeInput.value / 100;
  audio.volume = soundVolume;
  if (!soundVolume) {
    toggleClasses(volumeToggleBtn, ['fa-volume', 'fa-volume-slash']);
  }
  // volumeToggleBtn.className = soundVolume
  //   ? 'fa-thin fa-volume decorate-button fa-sizing volume-toggle _btn'
  //   : 'fa-thin fa-volume-slash decorate-button fa-sizing volume-toggle _btn';
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

window.addEventListener('keyup', (e) => {
  playSound('click');
  switch (e.code) {
    case 'Digit1' || 'Numpad1':
      break;
    case 'KeyQ':
      smoothChangeModule(startModule, ...staticModules);
      break;
    case 'KeyM': toggleMusic(); break;
    case 'KeyS': toggleVolume(); break;
    default: break;
  }
});

//! -----getGallery

let galleryArr;

const getGallery = async () => {
  const res = await fetch('./assets/gallery/gallery_data.json');
  const data = await res.json();
  galleryArr = data;
};

//! -----categories

const randomImage = (levelNumber, quizType) => {
  const levelStartNumber = levelNumber * 10 - 10 + quizType * 120;
  const levelPics = galleryArr.slice(levelStartNumber, levelStartNumber + 10);
  const image = levelPics[Math.floor(Math.random() * levelPics.length)];
  return image;
};

class CategoryCard {
  constructor(levelNumber, quizType) {
    const picture = randomImage(levelNumber, quizType);
    this.levelNumber = levelNumber;
    this.imageLink = `./assets/gallery/img/${picture.imageNum}.avif`;
  }

  create() {
    const card = document.createElement('div');
    const cardTitle = document.createElement('div');
    card.addEventListener('click', () => playSound('click'));
    card.style.backgroundImage = `url("${this.imageLink}")`;
    card.className = 'category-card quiz-type-btn';
    cardTitle.className = 'category-title';
    cardTitle.innerHTML = `<i class="fa-regular">${this.levelNumber}</i>`;
    card.append(cardTitle);
    return card;
  }
}

const categoriesContainer = document.querySelector('.categories-container');

//! ------mini header and footer

let inGame = false;

const toggleHeader = () => {
  if (!inGame) {
    toggleClassOfNodes(offClass, [header, miniHeader]);
  } else {
    toggleClassOfNodes(offClass, [header, miniHeader]);
  }
  inGame = !inGame;
};

quizMenu.forEach((btn, quizType) => {
  btn.addEventListener('click', () => {
    categoriesContainer.innerHTML = '';
    getGallery().then(() => {
      for (let i = 1; i <= 12; i += 1) {
        const card = new CategoryCard(i, quizType);
        categoriesContainer.append(card.create());
      }
    });
    // toggleHeader();
    smoothChangeModule(categoriesModule, ...staticModules);
  });
});

//! ----------------------------
