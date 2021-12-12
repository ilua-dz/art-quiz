import '../css/style.css';

import HTMLElements from './html-elements';
import { togglePopup, smoothChangeModule } from './render-functions';

import LevelCard from './level-card';
import QuizQuestion from './quiz-question';
import FinishLevelPopup from './finish-level-popup';
import Scores from './scores';

let isTimerOn;
let timerTime;
let timerId;
let isVolumeMute;
let soundVolume;
let isMusicPlaying;
let inGame = false;
let isAnswerChoised = false;

let quizType;
let answersCounter;
let trueAnswersCounter;
let levelResultString;
let levelCards;

const quizTypeNames = ['Artist quiz', 'Picture quiz'];

const staticModules = [
  HTMLElements.startModule,
  HTMLElements.settingsModule,
  HTMLElements.controlsModule,
  HTMLElements.categoriesModule,
  HTMLElements.artistQuizModule,
  HTMLElements.picQuizModule,
  HTMLElements.scoresModule,
  HTMLElements.footer,
];

//! --------------- Render utility functions ----------------

HTMLElements.controlsBtn.addEventListener('click', () =>
  smoothChangeModule(HTMLElements.controlsModule, ...staticModules)
);

HTMLElements.settingsBtn.addEventListener('click', () =>
  smoothChangeModule(HTMLElements.settingsModule, ...staticModules)
);

//! --------- Sounds and music -------------

const audioLib = {
  click: './assets/sounds/click.mp3',
  bgMusic: './assets/sounds/playback.weba',
  trueAnswer: './assets/sounds/true-answer.mp3',
  falseAnswer: './assets/sounds/wrong-answer.mp3',
  endLevel: './assets/sounds/end-round.mp3',
  timeGameBg: './assets/sounds/time-game-bg.mp3',
};

let audio = new Audio();

const bgAudio = new Audio(audioLib.bgMusic);
const timeGameBg = new Audio(audioLib.timeGameBg);

const playSound = (src) => {
  if (!isVolumeMute) {
    audio = new Audio(audioLib[src]);
    audio.volume = soundVolume * 0.1;
    audio.play();
  }
};

const timeGameMusicToggle = (dir) => {
  if (isMusicPlaying) {
    if (dir) {
      bgAudio.pause();
      timeGameBg.play();
    } else {
      bgAudio.play();
      timeGameBg.pause();
      timeGameBg.currentTime = 0;
    }
  }
};

document.body.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('_btn') ||
    e.target.parentNode.classList.contains('_btn')
  ) {
    playSound('click');
  }
});

HTMLElements.allInputsTypeRange.forEach((input) => {
  input.addEventListener('change', () => playSound('click'));
});

const toggleSoundsVolume = () => {
  HTMLElements.volumeToggleBtn.classList.add('fa-volume-slash', 'fa-volume');
  isVolumeMute = !isVolumeMute;
  HTMLElements.volumeInput.value = isVolumeMute ? 0 : soundVolume * 100;
};

const changeSoundsVolume = () => {
  soundVolume = HTMLElements.volumeInput.value / 100;
  audio.volume = soundVolume;
  if (!soundVolume) {
    HTMLElements.volumeToggleBtn.classList.add('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume');
  } else {
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.add('fa-volume');
  }
  if (soundVolume) isVolumeMute = false;
};
changeSoundsVolume();

const toggleMusic = () => {
  HTMLElements.musicToggleBtn.classList.toggle('fa-music');
  HTMLElements.musicToggleBtn.classList.toggle('fa-music-slash');
  if (isMusicPlaying) {
    bgAudio.pause();
    timeGameBg.pause();
    timeGameBg.currentTime = 0;
  } else if (inGame && !isAnswerChoised && isTimerOn) {
    timeGameBg.play();
  } else bgAudio.play();
  isMusicPlaying = !isMusicPlaying;
};

const changeMusicVolume = () => {
  bgAudio.volume = HTMLElements.musicVolumeInput.value / 100;
  timeGameBg.volume = HTMLElements.musicVolumeInput.value / 100;
};

const restorePlayingMusic = () => {
  const track = new Audio(audioLib.bgMusic);
  track.onloadeddata = () => {
    if (localStorage.getItem('isMusicPlaying')) {
      bgAudio.src = track.src;
      toggleMusic();
    }
  };
  window.removeEventListener('mousedown', restorePlayingMusic);
};

HTMLElements.volumeToggleBtn.addEventListener('click', toggleSoundsVolume);
HTMLElements.volumeInput.addEventListener('input', changeSoundsVolume);

HTMLElements.musicToggleBtn.addEventListener('click', toggleMusic);
HTMLElements.musicVolumeInput.addEventListener('input', changeMusicVolume);

window.addEventListener('mousedown', restorePlayingMusic);

//! -------------- Leave game function-------------------

const leaveGame = () => {
  clearTimeout(timerId);
  timeGameMusicToggle(false);
  inGame = false;
  HTMLElements.artistQuizModule.innerHTML = '';
  HTMLElements.picQuizModule.innerHTML = '';
};

HTMLElements.backBtns.forEach((btn) => {
  leaveGame();
  btn.addEventListener('click', () =>
    smoothChangeModule(HTMLElements.startModule, ...staticModules)
  );
});

//! -------------- Game timer -------------------

const toggleTimer = () => {
  timerTime = HTMLElements.timerInput.value;
  HTMLElements.timerToggleBtn.classList.toggle('fa-hourglass-clock');
  HTMLElements.timerToggleBtn.textContent = isTimerOn ? '' : timerTime;
  isTimerOn = !isTimerOn;
  HTMLElements.timerInput.disabled = !isTimerOn;
};

const changeTimer = () => {
  timerTime = HTMLElements.timerInput.value;
  if (isTimerOn) HTMLElements.timerToggleBtn.textContent = timerTime;
};

const timerStart = (time, timerIndicator, _question) => {
  timerIndicator.classList.add(`trans-width-${time}`);
  setTimeout(() => {
    timerIndicator.classList.add('width-0');
  }, 800);
  timerId = setTimeout(() => {
    if (!isAnswerChoised) answerChoise(_question, 4);
  }, time * 1000 + 800);
};

HTMLElements.timerToggleBtn.addEventListener('click', toggleTimer);
HTMLElements.timerInput.addEventListener('input', changeTimer);

//! ------------ Save and restore settings -------------------

const LSsetBooleanItem = (item, storageItem) => {
  if (item) localStorage.setItem(storageItem, '1');
  else localStorage.removeItem(storageItem);
};

const saveSettings = () => {
  localStorage.setItem('volume', soundVolume);
  localStorage.setItem('musicVolume', bgAudio.volume);
  LSsetBooleanItem(isVolumeMute, 'isVolumeMute');
  LSsetBooleanItem(isMusicPlaying, 'isMusicPlaying');
  LSsetBooleanItem(isTimerOn, 'isTimerOn');
  localStorage.setItem('timerTime', HTMLElements.timerInput.value);
};

const restoreSettings = () => {
  if (localStorage.getItem('volume')) {
    soundVolume = +localStorage.getItem('volume');
    if (soundVolume < 0.05) {
      HTMLElements.volumeToggleBtn.classList.add(
        'fa-volume',
        'fa-volume-slash'
      );
    }
  } else {
    soundVolume = 0.1;
  }
  audio.volume = soundVolume;
  HTMLElements.volumeInput.value = audio.volume * 100;
  if (localStorage.getItem('isVolumeMute')) toggleSoundsVolume();

  if (localStorage.getItem('musicVolume')) {
    bgAudio.volume = localStorage.getItem('musicVolume');
    timeGameBg.volume = localStorage.getItem('musicVolume');
  } else {
    bgAudio.volume = 0.5;
    timeGameBg.volume = 0.5;
  }
  HTMLElements.musicVolumeInput.value = bgAudio.volume * 100;

  if (localStorage.getItem('timerTime')) {
    timerTime = localStorage.getItem('timerTime');
    HTMLElements.timerInput.value = timerTime;
    if (isTimerOn) HTMLElements.timerToggleBtn.textContent = timerTime;
  }
  if (localStorage.getItem('isTimerOn')) {
    toggleTimer();
  } else HTMLElements.timerInput.disabled = true;
};

window.addEventListener('beforeunload', saveSettings);
window.addEventListener('load', () => {
  restoreSettings();
});

//! ------------- Keyboard controls ------------------------

window.addEventListener('keyup', (e) => {
  playSound('click');
  switch (e.code) {
    case 'KeyQ':
      smoothChangeModule(HTMLElements.startModule, ...staticModules);
      break;
    case 'KeyM':
      toggleMusic();
      break;
    case 'KeyS':
      toggleSoundsVolume();
      break;
    default:
      break;
  }
});

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

//! ----- Asynchronous gallery retrieval function ------------

let galleryArr;

const getGallery = async () => {
  const res = await fetch('./assets/gallery/gallery_data_en.json');
  const data = await res.json();
  galleryArr = data;
};

//! ---------- Images preload function --------------------

const preloadImages = (sources, callback) => {
  let counter = 0;

  function onload() {
    counter += 1;
    if (counter === sources.length) callback();
  }

  sources.forEach((source) => {
    const img = document.createElement('img');
    img.onload = onload;
    img.src = source;
  });
};

//! ----------------- Render functions ----------------------

const showPicInfo = (picNumber, _scores) => {
  HTMLElements.picInfoPopup.innerHTML = _scores.getInfoPopup(
    _scores.firstPicNumber + picNumber
  );

  preloadImages([_scores.picSrc], () =>
    togglePopup(HTMLElements.picInfoPopupContainer, true)
  );

  const backBtn = document.querySelector('.popup-close-btn');
  backBtn.addEventListener('click', () => {
    togglePopup(HTMLElements.picInfoPopupContainer, false);
  });
};

const renderScores = (levelNumber) => {
  const scores = new Scores(quizType, levelNumber, galleryArr);
  HTMLElements.scoresContainer.innerHTML = scores.node.innerHTML;
  HTMLElements.scoresTitle.textContent = scores.titleString;
  preloadImages(scores.picsSrc, () =>
    smoothChangeModule(HTMLElements.scoresModule, ...staticModules)
  );

  const picBtns = document.querySelectorAll('.scores-pic-btn');
  picBtns.forEach((btn, number) => {
    if (btn.classList.contains('resolved-pic')) {
      btn.addEventListener('click', () => {
        showPicInfo(number, scores);
      });
    }
  });
  const backToLevelsBtn = document.querySelector('.back-levels');
  backToLevelsBtn.addEventListener('click', renderLevels);
};

const renderLevels = () => {
  HTMLElements.categoriesContainer.innerHTML = '';
  HTMLElements.quizTypeString.textContent = quizTypeNames[quizType];

  const categoriesPicSet = [];
  const picsOnloadCallback = () => {
    smoothChangeModule(HTMLElements.categoriesModule, ...staticModules);
    leaveGame();
    togglePopup(HTMLElements.picInfoPopupContainer, false);
    togglePopup(HTMLElements.finishLevelPopupContainer, false);
  };

  getGallery().then(() => {
    for (let level = 1; level <= 12; level += 1) {
      const card = new LevelCard(level, quizType, galleryArr);
      const levelResultKey = `quizType_${quizType}_level_${level - 1}_result`;
      const levelResult = localStorage.getItem(levelResultKey)
        ? localStorage.getItem(levelResultKey)
        : false;
      HTMLElements.categoriesContainer.append(card.getCard(levelResult));
      categoriesPicSet.push(card.image.src);
    }
    preloadImages(categoriesPicSet, picsOnloadCallback);
    levelCards = document.querySelectorAll('.category-card');
    levelCards.forEach((card, cardNumber) => {
      card.addEventListener('click', () => levelStart(cardNumber));
      card
        .querySelector('.category-card-indicator')
        ?.addEventListener('click', (event) => {
          renderScores(cardNumber);
          event.stopPropagation();
        });
    });
  });
};

const answerChoise = (_question, inputAnswerNumber) => {
  isAnswerChoised = true;
  timeGameMusicToggle(false);

  const trueness = _question.trueAnswerNumber === inputAnswerNumber;
  HTMLElements.picInfoPopup.innerHTML = _question.getTrueAnswerPopup(trueness);

  if (trueness) {
    playSound('trueAnswer');
    trueAnswersCounter += 1;
  } else playSound('falseAnswer');

  levelResultString += trueness ? '1' : '0';
  togglePopup(HTMLElements.picInfoPopupContainer, true);

  const nextPicBtn = document.querySelector('.next-btn');
  nextPicBtn.addEventListener('click', () => renderNextQuestion(_question));
};

const defineQuestionButtons = (_question, _quizType) => {
  if (isTimerOn) {
    timeGameMusicToggle(true);
    document.querySelector('.timer-block').classList.add('grayscale-0');
    const timeLeftElement = document.querySelector('.time-left-block');
    setTimeout(() => {
      timerStart(timerTime, timeLeftElement, _question);
    }, 100);
  }

  const btnsSet = !_quizType
    ? document.querySelectorAll('.artist-answer')
    : document.querySelectorAll('.pic-answer');

  const backToLevelsBtns = document.querySelectorAll('.back-levels');
  backToLevelsBtns.forEach((btn) =>
    btn.addEventListener('click', renderLevels)
  );

  btnsSet.forEach((btn, inputAnswerNumber) => {
    btn.addEventListener('click', () => {
      clearTimeout(timerId);
      answerChoise(_question, inputAnswerNumber);
    });
  });
};

const saveResultToLS = (_question, failed = false) => {
  const levelNumber = `quizType_${_question.quizType}_level_${_question.levelNumber}`;
  if (!failed) {
    localStorage.setItem(`${levelNumber}_result`, levelResultString);
  } else {
    localStorage.removeItem(`${levelNumber}_result`);
  }
};

const renderNextQuestion = (_question) => {
  answersCounter += 1;
  if (answersCounter < 10) {
    _question.nextQuestion();

    const picsOnloadCallback = () => {
      defineQuestionButtons(_question, quizType);
      togglePopup(HTMLElements.picInfoPopupContainer, false);
      setTimeout(() => {
        isAnswerChoised = false;
      }, 1000);
    };

    if (!quizType) {
      HTMLElements.artistQuizModule.innerHTML =
        _question.getArtistQuizQuestion();
      _question.nextPicture.addEventListener('load', picsOnloadCallback);
    } else {
      HTMLElements.picQuizModule.innerHTML = _question.getPictureQuizQuestion();
      preloadImages(_question.picQuizImagesSrc, picsOnloadCallback);
    }
  } else {
    inGame = false;
    isAnswerChoised = false;
    playSound('endLevel');
    const popup = new FinishLevelPopup(trueAnswersCounter);
    HTMLElements.finishLevelPopupContainer.append(popup.popup);
    togglePopup(HTMLElements.finishLevelPopupContainer, true);
    popup.backBtn.addEventListener('click', () => {
      saveResultToLS(_question, !levelResultString.includes('1'));
      renderLevels();
      HTMLElements.finishLevelPopupContainer.innerHTML = '';
    });
  }
};

const levelStart = (levelNumber) => {
  let quizModule;
  levelResultString = '';
  answersCounter = 0;
  trueAnswersCounter = 0;
  inGame = true;
  isAnswerChoised = false;
  switch (quizType) {
    case 0:
      quizModule = HTMLElements.artistQuizModule;
      break;
    case 1:
      quizModule = HTMLElements.picQuizModule;
      break;
    default:
      break;
  }

  getGallery().then(() => {
    const question = new QuizQuestion(quizType, levelNumber, galleryArr);

    const picsOnloadCallback = () => {
      smoothChangeModule(quizModule, ...staticModules);
      defineQuestionButtons(question, quizType);
    };

    if (!quizType) {
      HTMLElements.artistQuizModule.innerHTML =
        question.getArtistQuizQuestion();
      question.picture.onload = picsOnloadCallback;
    } else {
      HTMLElements.picQuizModule.innerHTML = question.getPictureQuizQuestion();
      preloadImages(question.picQuizImagesSrc, picsOnloadCallback);
    }
  });
};

HTMLElements.quizTypeMenu.forEach((quizTypebtn, _quizType) => {
  quizTypebtn.addEventListener('click', () => {
    quizType = _quizType;
    renderLevels();
  });
});
