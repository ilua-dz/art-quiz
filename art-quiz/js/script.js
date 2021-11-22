import QuizQuestion from './QuizQuestion.js';
import FinishLevelPopup from './finishLevelPopup.js';

//! ------------settings

let isTimerOn;
let timerTime;
let isVolumeMute;
let soundVolume;
let isMusicPlaying;

let quizType;
let answersCounter;
let trueAnswersCounter;
let levelResultString;

const settingsBtn = document.querySelector('.settings-btn');
const controlsBtn = document.querySelector('.controls-btn');
const backBtns = document.querySelectorAll('.back-btn');

const settingsModule = document.querySelector('.settings-module');
const startModule = document.querySelector('.start-module');
const controlsModule = document.querySelector('.controls-module');

const categoriesModule = document.querySelector('.categories-module');
const quizTypeString = document.querySelector('.quiz-type-string');
const categoriesContainer = document.querySelector('.categories-container');
let levelCards;

const artistQuizModule = document.querySelector('.artist-quiz-module');
const picQuizModule = document.querySelector('.pic-quiz-module');
const trueAnswerPopup = document.querySelector('.true-answer-popup');
const trueAnswerPopupContainer = document.querySelector('.true-answer-popup-container');
const finishLevelPopupContainer = document.querySelector('.level-finish-popup-container');

const header = document.querySelector('.header');
const miniHeader = document.querySelector('.mini-header');
const footer = document.querySelector('.footer');
const quizTypeMenu = document.querySelectorAll('.quiz-type-general');

const volumeToggleBtn = document.querySelector('.volume-toggle');
const volumeInput = document.querySelector('.settings-volume-range');
const musicToggleBtn = document.querySelector('.music-toggle');
const musicVolumeInput = document.querySelector('.settings-music-range');
const timerToggleBtn = document.querySelector('.timer-toggle');
const timerInput = document.querySelector('.settings-timer-range');
const allButtons = document.querySelectorAll('._btn');
const allInputsTypeRange = document.querySelectorAll('input');

const quizTypeNames = ['Artist quiz', 'Picture quiz'];

const staticModules = [
  startModule,
  settingsModule,
  controlsModule,
  categoriesModule,
  artistQuizModule,
  picQuizModule,
  footer,
];

const gameModules = [
  artistQuizModule,
  picQuizModule,
];

const toggleClasses = (node, classes, dir = undefined) => {
  classes.forEach((cssClass) => { node.classList.toggle(cssClass, dir); });
};

const toggleClassOfNodes = (cssClass, nodes, dir = undefined) => {
  nodes.forEach((node) => node.classList.toggle(cssClass, dir));
};

const offClass = 'display-off';
const onClass = 'display-on';
const hideClass = 'opacity-off';

const toggleHeader = (size) => {
  if (!size) {
    header.classList.add(offClass);
    miniHeader.classList.remove(offClass);
  } else {
    header.classList.remove(offClass);
    miniHeader.classList.add(offClass);
  }
};

const smoothChangeModule = (onModule, ...allModules) => {
  if (gameModules.includes(onModule)) allModules.push(header, miniHeader);
  toggleClassOfNodes(hideClass, allModules, true);
  setTimeout(() => {
    allModules.forEach((module) => {
      toggleClasses(module, [onClass, offClass], false);
      if (module !== onModule) module.classList.toggle(offClass);
      else module.classList.toggle(onClass);
    });
    footer.classList.toggle(offClass);
    if (gameModules.includes(onModule)) toggleHeader();
    else toggleHeader(1);
  }, 300);
  setTimeout(() => {
    toggleClassOfNodes(hideClass, allModules, false);
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
  console.log(e.code);
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
  const res = await fetch('./assets/gallery/gallery_data_en.json');
  const data = await res.json();
  galleryArr = data;
};

//! -----classes-------------

const randomLevelPicture = (levelNumber, _quizType) => {
  const levelImgStartNumber = levelNumber * 10 - 10 + _quizType * 120;
  const levelPics = galleryArr.slice(levelImgStartNumber, levelImgStartNumber + 10);
  const image = levelPics[Math.floor(Math.random() * levelPics.length)];
  return image;
};

class LevelCard {
  constructor(levelNumber, _quizType) {
    const picture = randomLevelPicture(levelNumber, _quizType);
    this.levelNumber = levelNumber;
    this.imageLink = `./assets/gallery/img/${picture.imageNum}.avif`;
  }

  getCard(levelResult) {
    const card = document.createElement('div');
    const cardTitle = document.createElement('div');

    card.addEventListener('click', () => playSound('click'));
    card.style.backgroundImage = `url("${this.imageLink}")`;
    card.className = 'category-card pic-btn';

    cardTitle.className = 'category-title';
    cardTitle.innerHTML = `<i class="fa-regular">${this.levelNumber}</i>`;

    if (levelResult) {
      card.classList.add('level-passed');
      const levelIndicator = document.createElement('div');
      levelIndicator.textContent = levelResult.split('').reduce((sum, i) => sum + i, 0);
    }
    card.append(cardTitle);
    return card;
  }
}

//! ------------------------------

const saveResultToLS = (_question, failed = false) => {
  const levelNumber = `quizType_${_question.quizType}_level_${_question.levelNumber}`;
  if (!failed) {
    localStorage.setItem(`${levelNumber}_result`, levelResultString);
  } else {
    localStorage.removeItem(`${levelNumber}_result`);
  }
};

const togglePopup = (popup, dir) => {
  if (dir) {
    popup.classList.toggle(offClass, !dir);
    setTimeout(() => popup.classList.toggle(hideClass, !dir), 1);
  } else {
    popup.classList.toggle(hideClass, !dir);
    setTimeout(() => popup.classList.toggle(offClass, !dir), 1000);
  }
};

const goToLevels = () => {
  quizTypeString.textContent = quizTypeNames[quizType];
  categoriesContainer.innerHTML = '';
  getGallery().then(() => {
    for (let level = 1; level <= 12; level += 1) {
      const card = new LevelCard(level, quizType);
      const levelResultKey = `quizType_${quizType}_level_${level - 1}_result`;
      const levelResult = localStorage.getItem(levelResultKey)
        ? localStorage.getItem(levelResultKey)
        : false;
      console.log(levelResult);
      categoriesContainer.append(card.getCard(levelResult));
    }
    smoothChangeModule(categoriesModule, ...staticModules);
    levelCards = document.querySelectorAll('.category-card');
    levelCards.forEach((card, cardNumber) => {
      card.addEventListener('click', () => levelStart(cardNumber));
    });
  });
};

const answerChoise = (_question, inputAnswerNumber) => {
  const trueness = _question.trueAnswerNumber === inputAnswerNumber;
  trueAnswerPopup.innerHTML = _question.getTrueAnswerPopup(trueness);

  if (trueness) trueAnswersCounter += 1;

  levelResultString += trueness ? '1' : '0';
  togglePopup(trueAnswerPopupContainer, true);

  const nextPicBtn = document.querySelector('.next-btn');
  nextPicBtn.addEventListener('click', () => goToNextPic(_question));
};

const defineAnswerButtons = (_question, _quizType) => {
  const btnsSet = !_quizType
    ? document.querySelectorAll('.artist-answer')
    : document.querySelectorAll('.pic-answer');

  btnsSet.forEach((btn, inputAnswerNumber) => {
    btn.addEventListener('click', () => {
      answerChoise(_question, inputAnswerNumber);
    });
  });
};

const goToNextPic = (_question) => {
  answersCounter += 1;
  if (answersCounter < 2) {
    _question.nextQuestion();

    if (!quizType) artistQuizModule.innerHTML = _question.getArtistQuizQuestion();
    else picQuizModule.innerHTML = _question.getPictureQuizQuestion();

    defineAnswerButtons(_question, quizType);
    togglePopup(trueAnswerPopupContainer, false);
  } else {
    const popup = new FinishLevelPopup(trueAnswersCounter);
    finishLevelPopupContainer.append(popup.popup);
    togglePopup(finishLevelPopupContainer, true);
    popup.backBtn.addEventListener('click', () => {
      saveResultToLS(_question, !levelResultString.includes('1'));
      togglePopup(trueAnswerPopupContainer, false);
      togglePopup(finishLevelPopupContainer, false);
      goToLevels();
    });
  }
};

const levelStart = (levelNumber) => {
  let quizModule;
  levelResultString = '';
  answersCounter = 0;
  trueAnswersCounter = 0;
  switch (quizType) {
    case 0: quizModule = artistQuizModule; break;
    case 1: quizModule = picQuizModule; break;
    default: break;
  }
  smoothChangeModule(quizModule, ...staticModules);

  getGallery().then(() => {
    const question = new QuizQuestion(quizType, levelNumber, galleryArr);

    if (!quizType) artistQuizModule.innerHTML = question.getArtistQuizQuestion();
    else picQuizModule.innerHTML = question.getPictureQuizQuestion();

    defineAnswerButtons(question, quizType);
  });
};

quizTypeMenu.forEach((quizTypebtn, _quizType) => {
  quizTypebtn.addEventListener('click', () => {
    quizType = _quizType;
    goToLevels();
  });
});
