import '../css/style.css';

import Application from './classes/app';

import { HTMLElements, staticModules } from './utils/html-elements';

import { togglePopup, smoothChangePage } from './utils/render-functions';

import { enableMainMenuTransitions } from './utils/button-functions';

import {
  timeGameMusicToggle,
  playSound,
  enableRestoreMusicPlaying,
  enableButtonSounds,
} from './utils/sounds';

import {
  enableSoundsSettings,
  enableMusicSettings,
  enableTimerSettings,
} from './utils/settings-utils';

import {
  enableKeyboardGaming,
  enableKeyboardSettings,
} from './utils/keyboard-utils';

import preloadImages from './utils/images-preload-function';

import LevelCard from './classes/level-card';
import FinishLevelPopup from './classes/finish-level-popup';
import Scores from './classes/scores';

import { quizTypeNames } from './utils/definitions';

const app = new Application();

enableMainMenuTransitions(app);

//! --------- Sounds and music -------------

enableRestoreMusicPlaying(app);
enableButtonSounds(app);

//! -------------- Game timer -------------------

//! ------------- Settings ------------------------

enableSoundsSettings(app);
enableMusicSettings(app);
enableTimerSettings(app);

//! ------------- Keyboard controls ------------------------

enableKeyboardSettings(app);
enableKeyboardGaming(app);

//! ----------------- Render functions ----------------------

export const saveLevelResult = (failed = false) => {
  const levelNumber = `quizType_${app.question.quizType}_level_${app.question.levelNumber}`;
  if (!failed) {
    localStorage.setItem(`${levelNumber}_result`, app.levelResultString);
  } else {
    localStorage.removeItem(`${levelNumber}_result`);
  }
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

  preloadImages(renderLevelCards(), displayLevelsPage);
  enableLevelStart();
  enableShowLevelScores();
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
  const scoresPage = new Scores(app.quizType, levelNumber, app.galleryArr);
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
      clearTimeout(app.timerId);
      chooseAnswer(inputAnswerNumber);
    });
  });
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
    app.leaveGame();
    playSound('endLevel', app);

    renderFinishPopup();
    enableReturnToLevels(true);
  }
};

const displayLevelsPage = () => {
  smoothChangePage(HTMLElements.categoriesModule, ...staticModules);
  app.leaveGame();
  togglePopup(HTMLElements.picInfoPopupContainer, false);
  togglePopup(HTMLElements.finishLevelPopupContainer, false);
};

const renderLevelCards = () => {
  const allLevelCardsImageLinks = [];
  for (let level = 1; level <= 12; level += 1) {
    const card = new LevelCard(level, app.quizType, app.galleryArr);
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
