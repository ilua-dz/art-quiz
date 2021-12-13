import '../css/style.css';

import Application from './classes/app';
import HTMLElements from './utils/html-elements';
import {
  togglePopup,
  smoothChangeModule,
} from './utils/smooth-render-functions';

import {
  playSound,
  switchSounds,
  switchMusicVolume,
  changeSoundsVolume,
  changeMusicVolume,
  restorePlayingMusic,
  timeGameMusicToggle,
} from './utils/sounds';

import preloadImages from './utils/images-preload-function';

import LevelCard from './classes/level-card';
import QuizQuestion from './classes/quiz-question';
import FinishLevelPopup from './classes/finish-level-popup';
import Scores from './classes/scores';

let timerId;

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

const app = new Application();

//! --------------- Render utility functions ----------------

HTMLElements.controlsBtn.addEventListener('click', () =>
  smoothChangeModule(HTMLElements.controlsModule, ...staticModules)
);

const renderSettings = () => {
  if (app.isSoundVolumeMute) {
    HTMLElements.volumeToggleBtn.classList.add('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume');
    HTMLElements.volumeInput.value = 0;
  } else {
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.add('fa-volume');
    HTMLElements.volumeInput.value = app.soundVolume * 100;
  }
  if (app.isMusicPlaying) {
    HTMLElements.musicToggleBtn.classList.add('fa-music');
    HTMLElements.musicToggleBtn.classList.remove('fa-music-slash');
  } else {
    HTMLElements.musicToggleBtn.classList.remove('fa-music');
    HTMLElements.musicToggleBtn.classList.add('fa-music-slash');
  }
  HTMLElements.musicVolumeInput.value = app.musicVolume * 100;

  HTMLElements.timerInput.value = app.timerTime;
  HTMLElements.timerInput.disabled = !app.isTimerOn;
  if (app.isTimerOn) {
    HTMLElements.timerToggleBtn.classList.remove('fa-hourglass-clock');
    HTMLElements.timerToggleBtn.textContent = app.timerTime;
  }
};

HTMLElements.settingsBtn.addEventListener('click', () => {
  renderSettings();
  smoothChangeModule(HTMLElements.settingsModule, ...staticModules);
});

//! --------- Sounds and music -------------

document.body.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('_btn') ||
    e.target.parentNode.classList.contains('_btn')
  ) {
    playSound('click', app);
  }
});

HTMLElements.allInputsTypeRange.forEach((input) => {
  input.addEventListener('change', () => playSound('click', app));
});

HTMLElements.volumeToggleBtn.addEventListener('click', () => switchSounds(app));
HTMLElements.volumeInput.addEventListener('input', () => {
  changeSoundsVolume(app);
});

HTMLElements.musicToggleBtn.addEventListener('click', () =>
  switchMusicVolume(app)
);
HTMLElements.musicVolumeInput.addEventListener('input', () =>
  changeMusicVolume(app)
);

window.addEventListener('mouseup', () => restorePlayingMusic(app), {
  once: true,
});

//! -------------- Leave game function-------------------

const leaveGame = () => {
  clearTimeout(timerId);
  timeGameMusicToggle(false, app);
  app.inGame = false;
  HTMLElements.artistQuizModule.innerHTML = '';
  HTMLElements.picQuizModule.innerHTML = '';
};

HTMLElements.backBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    leaveGame();
    smoothChangeModule(HTMLElements.startModule, ...staticModules);
  });
});

//! -------------- Game timer -------------------

const toggleTimer = () => {
  app.timerTime = HTMLElements.timerInput.value;
  HTMLElements.timerToggleBtn.classList.toggle('fa-hourglass-clock');
  HTMLElements.timerToggleBtn.textContent = app.isTimerOn ? '' : app.timerTime;
  app.switchTimer();
  HTMLElements.timerInput.disabled = !app.isTimerOn;
};

const changeTimer = () => {
  app.changeTimerTime(HTMLElements.timerInput.value);
  if (app.isTimerOn) HTMLElements.timerToggleBtn.textContent = app.timerTime;
};

const timerStart = (time, timerIndicator, _question) => {
  timerIndicator.classList.add(`trans-width-${time}`);
  setTimeout(() => {
    timerIndicator.classList.add('width-0');
  }, 800);
  timerId = setTimeout(() => {
    if (!app.isAnswerChoised) answerChoise(_question, 4);
  }, time * 1000 + 800);
};

HTMLElements.timerToggleBtn.addEventListener('click', toggleTimer);
HTMLElements.timerInput.addEventListener('input', changeTimer);

//! ------------ Save and restore settings -------------------

// const LSsetBooleanItem = (item, storageItem) => {
//   if (item) localStorage.setItem(storageItem, '1');
//   else localStorage.removeItem(storageItem);
// };

// const saveSettings = () => {
//   localStorage.setItem('volume', app.soundVolume);
//   localStorage.setItem('musicVolume', app.bgAudio.volume);
//   LSsetBooleanItem(app.isSoundVolumeMute, 'isVolumeMute');
//   LSsetBooleanItem(app.isMusicPlaying, 'isMusicPlaying');
//   LSsetBooleanItem(app.isTimerOn, 'isTimerOn');
//   localStorage.setItem('timerTime', HTMLElements.timerInput.value);
// };

// const restoreSettings = () => {
//   if (localStorage.getItem('volume')) {
//     app.soundVolume = +localStorage.getItem('volume');
//     if (app.soundVolume < 0.05) {
//       HTMLElements.volumeToggleBtn.classList.add(
//         'fa-volume',
//         'fa-volume-slash'
//       );
//     }
//   } else {
//     app.soundVolume = 0.1;
//   }
//   app.audio.volume = soundVolume;
//   HTMLElements.volumeInput.value = app.soundVolume * 100;
//   if (localStorage.getItem('isVolumeMute')) switchSounds(app);

//   if (localStorage.getItem('musicVolume')) {
//     app.changeMusicVolume(+localStorage.getItem('musicVolume'));
//   } else {
//     app.changeMusicVolume(app.defaultSoundsVolume);
//   }
//   HTMLElements.musicVolumeInput.value = app.bgAudio.volume * 100;

//   if (localStorage.getItem('timerTime')) {
//     app.timerTime = localStorage.getItem('timerTime');
//     HTMLElements.timerInput.value = app.timerTime;
//     if (app.isTimerOn) HTMLElements.timerToggleBtn.textContent = app.timerTime;
//   }
//   if (localStorage.getItem('isTimerOn')) {
//     toggleTimer();
//   } else HTMLElements.timerInput.disabled = true;
// };

// window.addEventListener('beforeunload', saveSettings);
// window.addEventListener('load', () => {
//   restoreSettings();
// });

//! ------------- Keyboard controls ------------------------

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyQ':
      playSound('click', app);
      smoothChangeModule(HTMLElements.startModule, ...staticModules);
      break;
    case 'KeyM':
      playSound('click', app);
      switchMusicVolume(app);
      break;
    case 'KeyS':
      playSound('click', app);
      switchSounds(app);
      break;
    default:
      break;
  }
});

window.addEventListener('keyup', (e) => {
  if (app.inGame && !app.isAnswerChoised) {
    for (let i = 0; i < 4; i += 1) {
      if (e.code === `Digit${i + 1}` || e.code === `Numpad${i + 1}`) {
        if (!quizType) document.querySelectorAll('.artist-answer')[i].click();
        else document.querySelectorAll('.pic-answer')[i].click();
      }
    }
  } else if (e.code === 'Space' && app.inGame && app.isAnswerChoised) {
    document.querySelector('.next-btn').click();
  } else if (e.code === 'Space' && !app.inGame && !app.isAnswerChoised) {
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
  app.isAnswerChoised = true;
  timeGameMusicToggle(false, app);

  const trueness = _question.trueAnswerNumber === inputAnswerNumber;
  HTMLElements.picInfoPopup.innerHTML = _question.getTrueAnswerPopup(trueness);

  if (trueness) {
    playSound('trueAnswer', app);
    trueAnswersCounter += 1;
  } else playSound('falseAnswer', app);

  levelResultString += trueness ? '1' : '0';
  togglePopup(HTMLElements.picInfoPopupContainer, true);

  const nextPicBtn = document.querySelector('.next-btn');
  nextPicBtn.addEventListener('click', () => renderNextQuestion(_question));
};

const defineQuestionButtons = (_question, _quizType) => {
  if (app.isTimerOn) {
    timeGameMusicToggle(true, app);
    document.querySelector('.timer-block').classList.add('grayscale-0');
    const timeLeftElement = document.querySelector('.time-left-block');
    setTimeout(() => {
      timerStart(app.timerTime, timeLeftElement, _question);
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
        app.isAnswerChoised = false;
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
    app.inGame = false;
    app.isAnswerChoised = false;
    playSound('endLevel', app);
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
  app.inGame = true;
  app.isAnswerChoised = false;
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
