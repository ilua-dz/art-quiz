/* eslint-disable import/extensions */
import QuizQuestion from './QuizQuestion.js';
import FinishLevelPopup from './finishLevelPopup.js';
import Scores from './Scores.js';

//! ------------settings

let isTimerOn;
let timerTime;
let isVolumeMute;
let soundVolume;
let isMusicPlaying;
let inGame = false;
let isAnswerChoised = false;

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

const scoresModule = document.querySelector('.scores-module');
const scoresContainer = document.querySelector('.scores-container');

const artistQuizModule = document.querySelector('.artist-quiz-module');
const picQuizModule = document.querySelector('.pic-quiz-module');
const picInfoPopup = document.querySelector('.pic-info-popup');
const picInfoPopupContainer = document.querySelector('.pic-info-popup-container');
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
  scoresModule,
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

const leaveGame = () => {
  inGame = false;
  artistQuizModule.innerHTML = '';
  picQuizModule.innerHTML = '';
};

backBtns.forEach((btn) => {
  leaveGame();
  btn.addEventListener('click', () => smoothChangeModule(startModule, ...staticModules));
});

const audioObj = {
  click: './assets/sounds/click.mp3',
  bgMusic: './assets/sounds/playback.weba',
  trueAnswer: './assets/sounds/true-answer.mp3',
  falseAnswer: './assets/sounds/wrong-answer.mp3',
  endLevel: './assets/sounds/end-round.mp3',
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
    toggleClasses(volumeToggleBtn, ['fa-volume-slash'], true);
    toggleClasses(volumeToggleBtn, ['fa-volume'], false);
  } else {
    toggleClasses(volumeToggleBtn, ['fa-volume-slash'], false);
    toggleClasses(volumeToggleBtn, ['fa-volume'], true);
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
    if (soundVolume < 0.05) {
      toggleClasses(volumeToggleBtn, ['fa-volume', 'fa-volume-slash']);
    }
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
    timerTime = localStorage.getItem('timerTime');
    timerInput.value = timerTime;
    if (isTimerOn) timerToggleBtn.textContent = timerTime;
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
    case 'KeyQ':
      smoothChangeModule(startModule, ...staticModules);
      break;
    case 'KeyM': toggleMusic(); break;
    case 'KeyS': toggleVolume(); break;
    default: break;
  }
});

//! -----getGallery------------

let galleryArr;

const getGallery = async () => {
  const res = await fetch('./assets/gallery/gallery_data_en.json');
  const data = await res.json();
  galleryArr = data;
};

//! -------------------------

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
      levelIndicator.addEventListener('click', (event) => {
        goToScores(this.levelNumber - 1);
        event.stopPropagation();
      });
      levelIndicator.classList.add('category-card-indicator');
      const levelResultParsed = levelResult.split('').reduce((sum, i) => sum + +i, 0);
      levelIndicator.textContent = `${levelResultParsed}/10`;
      card.append(levelIndicator);
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
  leaveGame();
  quizTypeString.textContent = quizTypeNames[quizType];
  categoriesContainer.innerHTML = '';
  getGallery().then(() => {
    for (let level = 1; level <= 12; level += 1) {
      const card = new LevelCard(level, quizType);
      const levelResultKey = `quizType_${quizType}_level_${level - 1}_result`;
      const levelResult = localStorage.getItem(levelResultKey)
        ? localStorage.getItem(levelResultKey)
        : false;
      categoriesContainer.append(card.getCard(levelResult));
    }
    smoothChangeModule(categoriesModule, ...staticModules);
    levelCards = document.querySelectorAll('.category-card');
    levelCards.forEach((card, cardNumber) => {
      card.addEventListener('click', () => levelStart(cardNumber));
    });
  });
};

const showPicInfo = (picNumber, _scores) => {
  picInfoPopup.innerHTML = _scores.getInfoPopup(_scores.firstPicNumber + picNumber);
  togglePopup(picInfoPopupContainer, true);
  const backBtn = document.querySelector('.popup-close-btn');
  backBtn.addEventListener('click', () => {
    togglePopup(picInfoPopupContainer, false);
  });
};

const scoresTitle = document.querySelector('.level-string');

const goToScores = (levelNumber) => {
  const scores = new Scores(quizType, levelNumber, galleryArr);
  scoresContainer.innerHTML = scores.node.innerHTML;
  scoresTitle.textContent = scores.titleString;
  smoothChangeModule(scoresModule, ...staticModules);
  const picBtns = document.querySelectorAll('.scores-pic-btn');
  picBtns.forEach((btn, number) => {
    if (btn.classList.contains('resolved-pic')) {
      btn.addEventListener('click', () => {
        showPicInfo(number, scores);
      });
    }
  });
  const backToLevelsBtn = document.querySelector('.back-levels');
  backToLevelsBtn.addEventListener('click', goToLevels);
};

const answerChoise = (_question, inputAnswerNumber) => {
  isAnswerChoised = true;
  const trueness = _question.trueAnswerNumber === inputAnswerNumber;
  picInfoPopup.innerHTML = _question.getTrueAnswerPopup(trueness);

  if (trueness) {
    playSound('trueAnswer');
    trueAnswersCounter += 1;
  } else playSound('falseAnswer');

  levelResultString += trueness ? '1' : '0';
  togglePopup(picInfoPopupContainer, true);

  const nextPicBtn = document.querySelector('.next-btn');
  nextPicBtn.addEventListener('click', () => goToNextPic(_question));
};

window.addEventListener('keyup', (e) => {
  if (inGame && !isAnswerChoised) {
    for (let i = 0; i < 4; i += 1) {
      if (e.code === `Digit${i + 1}` || e.code === `Numpad${i + 1}`) {
        if (!quizType) document.querySelectorAll('.artist-answer')[i].click();
        else document.querySelectorAll('.pic-answer')[i].click();
      }
    }
  } else if (e.code === 'Space' && inGame && isAnswerChoised) {
    document.querySelector('.next-btn').click();
  } else if (e.code === 'Space' && !inGame && !isAnswerChoised) {
    document.querySelector('.popup-back-levels').click();
  }
});

const defineAnswerButtons = (_question, _quizType) => {
  const btnsSet = !_quizType
    ? document.querySelectorAll('.artist-answer')
    : document.querySelectorAll('.pic-answer');

  const backToLevelsBtns = document.querySelectorAll('.back-levels');
  backToLevelsBtns.forEach((btn) => btn.addEventListener('click', goToLevels));

  btnsSet.forEach((btn, inputAnswerNumber) => {
    btn.addEventListener('click', () => {
      answerChoise(_question, inputAnswerNumber);
    });
  });
};

const goToNextPic = (_question) => {
  isAnswerChoised = false;
  answersCounter += 1;
  if (answersCounter < 10) {
    _question.nextQuestion();

    if (!quizType) artistQuizModule.innerHTML = _question.getArtistQuizQuestion();
    else picQuizModule.innerHTML = _question.getPictureQuizQuestion();

    defineAnswerButtons(_question, quizType);
    togglePopup(picInfoPopupContainer, false);
  } else {
    playSound('endLevel');
    const popup = new FinishLevelPopup(trueAnswersCounter);
    finishLevelPopupContainer.append(popup.popup);
    togglePopup(finishLevelPopupContainer, true);
    inGame = false;
    popup.backBtn.addEventListener('click', () => {
      saveResultToLS(_question, !levelResultString.includes('1'));
      togglePopup(picInfoPopupContainer, false);
      togglePopup(finishLevelPopupContainer, false);
      goToLevels();
      finishLevelPopupContainer.innerHTML = '';
    });
  }
};

const levelStart = (levelNumber) => {
  let quizModule;
  levelResultString = '';
  answersCounter = 0;
  trueAnswersCounter = 0;
  inGame = true;
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

// let width = 100;

// const timerStart = (timer) => {
//   setTimeout(() => {
//     width -= 0.1;
//     timer -= timer / 2500;
//     console.log(width.toFixed(2));
//     if (width > 0.1) timerStart(timer);
//   }, timer);
// };

// setTimeout(() => {
//   console.log('last ' + timerTime);
//   timerStart(20);
// }, 100);

// timerStart(10);
