import '../css/style.css';

import Application from './classes/app';
import HTMLElements from './utils/html-elements';
import { togglePopup, smoothChangePage } from './utils/smooth-render-functions';

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
import cssUtils from './utils/css-utils';

let timerId;

export const quizTypeNames = ['Artist quiz', 'Picture quiz'];

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

const gameModules = [HTMLElements.artistQuizModule, HTMLElements.picQuizModule];

export const quizTypeNumbers = {
  artistQuiz: 0,
  pictureQuiz: 1,
};

const wrongAnswerNumber = 4;

const app = new Application();

//! --------------- Render utility functions ----------------

HTMLElements.controlsBtn.addEventListener('click', () =>
  smoothChangePage(HTMLElements.controlsModule, ...staticModules)
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
  smoothChangePage(HTMLElements.settingsModule, ...staticModules);
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

export const leaveGame = () => {
  clearTimeout(timerId);
  timeGameMusicToggle(false, app);
  app.inGame = false;
  app.isAnswerChosen = false;
  HTMLElements.artistQuizModule.innerHTML = '';
  HTMLElements.picQuizModule.innerHTML = '';
};

HTMLElements.backBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    leaveGame();
    smoothChangePage(HTMLElements.startModule, ...staticModules);
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

const timerStart = () => {
  timeGameMusicToggle(true, app);
  HTMLElements.timerBlock().classList.add(cssUtils.timerOn);
  HTMLElements.timeLeftBlock().classList.add(`trans-width-${app.timerTime}`);
  setTimeout(() => {
    HTMLElements.timeLeftBlock().classList.add('width-0');
  }, 800);
  timerId = setTimeout(() => {
    if (!app.isAnswerChosen) chooseAnswer(wrongAnswerNumber);
  }, app.timerTime * 1000 + 800);
};

HTMLElements.timerToggleBtn.addEventListener('click', toggleTimer);
HTMLElements.timerInput.addEventListener('input', changeTimer);

//! ------------- Keyboard controls ------------------------

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyQ':
      playSound('click', app);
      smoothChangePage(HTMLElements.startModule, ...staticModules);
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
  if (app.inGame && !app.isAnswerChosen) {
    for (let i = 0; i < 4; i += 1) {
      if (e.code === `Digit${i + 1}` || e.code === `Numpad${i + 1}`) {
        if (app.quizType === quizTypeNumbers.artistQuiz) {
          HTMLElements.artistQuizAnswerBtns()[i].click();
        } else if (app.quizType === quizTypeNumbers.pictureQuiz)
          HTMLElements.pictureQuizAnswerBtns()[i].click();
      }
    }
  } else if (e.code === 'Space' && app.inGame && app.isAnswerChosen) {
    document.querySelector('.next-btn').click();
  } else if (e.code === 'Space' && !app.inGame && !app.isAnswerChosen) {
    document.querySelector('.popup-back-levels').click();
  }
});

//! ----- Asynchronous gallery retrieval function ------------

let galleryArr;

export const getGallery = async () => {
  const res = await fetch('./assets/gallery/gallery_data_en.json');
  const data = await res.json();
  galleryArr = data;
};

//! ----------------- Render functions ----------------------

export const saveLevelResult = (failed = false) => {
  const levelNumber = `quizType_${app.question.quizType}_level_${app.question.levelNumber}`;
  if (!failed) {
    localStorage.setItem(`${levelNumber}_result`, app.levelResultString);
  } else {
    localStorage.removeItem(`${levelNumber}_result`);
  }
};

export const enableLevelStart = () => {
  HTMLElements.levelCards().forEach((card, cardNumber) => {
    card.addEventListener('click', () => levelStart(cardNumber));
  });
};

export const enableShowLevelScores = () => {
  HTMLElements.levelCards().forEach((card, cardNumber) => {
    HTMLElements.levelCardIndicator(card)?.addEventListener(
      'click',
      (event) => {
        renderScores(cardNumber);
        event.stopPropagation();
      }
    );
  });
};

const renderLevels = () => {
  HTMLElements.categoriesContainer.innerHTML = '';
  HTMLElements.quizTypeString.textContent = quizTypeNames[app.quizType];

  getGallery().then(() => {
    preloadImages(renderLevelCards(), displayLevelsPage);
    enableLevelStart();
    enableShowLevelScores();
  });
};

export const enableReturnToLevels = (levelFinished = false) => {
  HTMLElements.backToLevelsBtns().forEach((btn) =>
    btn.addEventListener('click', () => {
      if (levelFinished) saveLevelResult(!app.levelResultString.includes('1'));
      renderLevels();
      HTMLElements.finishLevelPopupContainer.innerHTML = '';
    })
  );
};

export const enableHidePicInfo = () => {
  HTMLElements.backBtn().addEventListener('click', () => {
    togglePopup(HTMLElements.picInfoPopupContainer, false);
  });
};

const showPicInfo = (picNumber, scoresPage) => {
  HTMLElements.picInfoPopup.innerHTML = scoresPage.getInfoPopup(
    scoresPage.firstPicNumber + picNumber
  );

  preloadImages([scoresPage.picSrc], () =>
    togglePopup(HTMLElements.picInfoPopupContainer, true)
  );
  enableHidePicInfo();
};

export const enableShowPicInfo = (scoresPage) => {
  HTMLElements.picBtns().forEach((btn, number) => {
    if (btn.classList.contains('resolved-pic')) {
      btn.addEventListener('click', () => {
        showPicInfo(number, scoresPage);
      });
    }
  });
};

const renderScores = (levelNumber) => {
  const scoresPage = new Scores(app.quizType, levelNumber, galleryArr);
  HTMLElements.scoresContainer.innerHTML = scoresPage.node.innerHTML;
  HTMLElements.scoresTitle.textContent = scoresPage.titleString;

  preloadImages(scoresPage.picsSrc, () =>
    smoothChangePage(HTMLElements.scoresModule, ...staticModules)
  );

  enableShowPicInfo(scoresPage);
  enableReturnToLevels();
};

export const enableMoveToNextQuestion = () => {
  HTMLElements.nextPicBtn().addEventListener('click', moveToNextQuestion);
};

const displayAnswerChosenPopup = (isAnswerRight) => {
  HTMLElements.picInfoPopup.innerHTML =
    app.question.getTrueAnswerPopup(isAnswerRight);
  togglePopup(HTMLElements.picInfoPopupContainer, true);
};

const chooseAnswer = (inputAnswerNumber) => {
  app.isAnswerChosen = true;
  timeGameMusicToggle(false, app);

  const isAnswerRight = app.question.trueAnswerNumber === inputAnswerNumber;

  if (isAnswerRight) {
    playSound('trueAnswer', app);
    app.trueAnswersCounter += 1;
  } else playSound('falseAnswer', app);

  app.levelResultString += isAnswerRight ? '1' : '0';

  displayAnswerChosenPopup(isAnswerRight);
  enableMoveToNextQuestion();
};

export const enableAnswerChoose = () => {
  const btnsSet = !app.quizType
    ? HTMLElements.artistQuizAnswerBtns()
    : HTMLElements.pictureQuizAnswerBtns();

  btnsSet.forEach((btn, inputAnswerNumber) => {
    btn.addEventListener('click', () => {
      clearTimeout(timerId);
      chooseAnswer(inputAnswerNumber);
    });
  });
};

const questionLaunch = () => {
  if (app.isTimerOn) setTimeout(timerStart, 100);

  enableAnswerChoose();
  enableReturnToLevels();
  setTimeout(() => {
    app.isAnswerChosen = false;
  }, 1000);
};

const displayQuestionPage = () => {
  questionLaunch();
  smoothChangePage(gameModules[app.quizType], ...staticModules);
  togglePopup(HTMLElements.picInfoPopupContainer, false);
};

const renderArtistQuizQuestion = () => {
  HTMLElements.artistQuizModule.innerHTML =
    app.question.getArtistQuizQuestion();
  preloadImages([app.question.picture.src], displayQuestionPage);
};

const renderPictureQuizQuestion = () => {
  HTMLElements.picQuizModule.innerHTML = app.question.getPictureQuizQuestion();
  preloadImages(app.question.picQuizImagesSrc, displayQuestionPage);
};

const renderQuizQuestion = () => {
  if (app.quizType === quizTypeNumbers.artistQuiz) renderArtistQuizQuestion();
  else if (app.quizType === quizTypeNumbers.pictureQuiz)
    renderPictureQuizQuestion();
};

const renderFinishPopup = () => {
  const popup = new FinishLevelPopup(app.trueAnswersCounter);
  HTMLElements.finishLevelPopupContainer.append(popup.popup);
  togglePopup(HTMLElements.finishLevelPopupContainer, true);
};

const moveToNextQuestion = () => {
  app.answersCounter += 1;
  if (app.answersCounter < 10) {
    app.question.nextQuestion();
    renderQuizQuestion();
  } else {
    leaveGame();
    playSound('endLevel', app);

    renderFinishPopup();
    enableReturnToLevels(true);
  }
};

const levelStart = (levelNumber) => {
  app.startGame();

  getGallery().then(() => {
    app.question = new QuizQuestion(app.quizType, levelNumber, galleryArr);
    renderQuizQuestion();
  });
};

const displayLevelsPage = () => {
  smoothChangePage(HTMLElements.categoriesModule, ...staticModules);
  leaveGame();
  togglePopup(HTMLElements.picInfoPopupContainer, false);
  togglePopup(HTMLElements.finishLevelPopupContainer, false);
};

const renderLevelCards = () => {
  const allLevelCardsImageLinks = [];
  for (let level = 1; level <= 12; level += 1) {
    const card = new LevelCard(level, app.quizType, galleryArr);
    const levelResult = localStorage.getItem(card.levelResultKey)
      ? localStorage.getItem(card.levelResultKey)
      : false;
    HTMLElements.categoriesContainer.append(card.getCard(levelResult));
    allLevelCardsImageLinks.push(card.imageLink);
  }
  return allLevelCardsImageLinks;
};

HTMLElements.quizTypeMenu.forEach((quizTypebtn, quizTypeNumber) => {
  quizTypebtn.addEventListener('click', () => {
    app.quizType = quizTypeNumber;
    renderLevels();
  });
});

export { app };
