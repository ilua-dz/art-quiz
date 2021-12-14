import {
  HTMLElements,
  staticModules,
  gameModules,
} from '../utils/html-elements';

import { togglePopup, smoothChangePage } from '../utils/render-functions';

import preloadImages from '../utils/images-preload-function';

import LevelCard from './level-card';
import FinishLevelPopup from './finish-level-popup';
import Scores from './scores';

import {
  quizTypeNames,
  wrongAnswerNumber,
  quizTypeNumbers,
} from '../utils/definitions';

import { timeGameMusicToggle, playSound } from '../utils/sounds';

const saveLevelResult = (app, failed = false) => {
  const levelNumber = `quizType_${app.question.quizType}_level_${app.question.levelNumber}`;
  if (!failed) {
    localStorage.setItem(`${levelNumber}_result`, app.levelResultString);
  } else {
    localStorage.removeItem(`${levelNumber}_result`);
  }
};

const enableHidePicInfo = () => {
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

const enableShowPicInfo = (scoresPage) => {
  HTMLElements.picBtns().forEach((btn, number) => {
    if (btn.classList.contains('resolved-pic')) {
      btn.addEventListener('click', () => {
        showPicInfo(number, scoresPage);
      });
    }
  });
};

const displayAnswerChosenPopup = (isAnswerRight) => {
  HTMLElements.picInfoPopup.innerHTML =
    this.app.question.getTrueAnswerPopup(isAnswerRight);
  togglePopup(HTMLElements.picInfoPopupContainer, true);
};

const renderFinishPopup = (app) => {
  const popup = new FinishLevelPopup(app.trueAnswersCounter);
  HTMLElements.finishLevelPopupContainer.append(popup.popup);
  togglePopup(HTMLElements.finishLevelPopupContainer, true);
};

const displayLevelsPage = (app) => {
  smoothChangePage(HTMLElements.categoriesModule, ...staticModules);
  app.leaveGame();
  togglePopup(HTMLElements.picInfoPopupContainer, false);
  togglePopup(HTMLElements.finishLevelPopupContainer, false);
};

const renderLevelCards = (app) => {
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

class GameUtils {
  constructor(app) {
    this.app = app;
    this.enableQuizTypeChoose();
  }

  enableShowLevelScores() {
    HTMLElements.levelCards().forEach((card, cardNumber) => {
      HTMLElements.levelCardIndicator(card)?.addEventListener(
        'click',
        (event) => {
          this.renderScores(cardNumber);
          event.stopPropagation();
        }
      );
    });
  }

  renderLevels() {
    HTMLElements.categoriesContainer.innerHTML = '';
    HTMLElements.quizTypeString.textContent = quizTypeNames[this.app.quizType];

    preloadImages(renderLevelCards(this.app), () =>
      displayLevelsPage(this.app)
    );
    this.enableLevelStart();
    this.enableShowLevelScores();
  }

  enableReturnToLevels(levelFinished = false) {
    HTMLElements.backToLevelsBtns().forEach((btn) =>
      btn.addEventListener('click', () => {
        if (levelFinished)
          saveLevelResult(this.app, !this.app.levelResultString.includes('1'));
        this.renderLevels();
        HTMLElements.finishLevelPopupContainer.innerHTML = '';
      })
    );
  }

  renderScores(levelNumber) {
    const scoresPage = new Scores(
      this.app.quizType,
      levelNumber,
      this.app.galleryArr
    );
    HTMLElements.scoresContainer.innerHTML = scoresPage.node.innerHTML;
    HTMLElements.scoresTitle.textContent = scoresPage.titleString;

    preloadImages(scoresPage.picsSrc, () =>
      smoothChangePage(HTMLElements.scoresModule, ...staticModules)
    );

    enableShowPicInfo(scoresPage);
    this.enableReturnToLevels();
  }

  enableMoveToNextQuestion() {
    HTMLElements.nextPicBtn().addEventListener('click', () =>
      this.moveToNextQuestion()
    );
  }

  chooseAnswer(inputAnswerNumber) {
    this.app.isAnswerChosen = true;
    timeGameMusicToggle(false, this.app);

    const isAnswerRight =
      this.app.question.trueAnswerNumber === inputAnswerNumber;

    if (isAnswerRight) {
      playSound('trueAnswer', this.app);
      this.app.trueAnswersCounter += 1;
    } else playSound('falseAnswer', this.app);

    this.app.levelResultString += isAnswerRight ? '1' : '0';

    displayAnswerChosenPopup(isAnswerRight);
    this.enableMoveToNextQuestion();
  }

  enableAnswerChoose() {
    const btnsSet = !this.app.quizType
      ? HTMLElements.artistQuizAnswerBtns()
      : HTMLElements.pictureQuizAnswerBtns();

    btnsSet.forEach((btn, inputAnswerNumber) => {
      btn.addEventListener('click', () => {
        clearTimeout(this.app.timerId);
        this.chooseAnswer(inputAnswerNumber);
      });
    });
  }

  moveToNextQuestion() {
    this.app.isAnswerChosen = false;
    this.app.answersCounter += 1;
    if (this.app.answersCounter < 10) {
      this.app.question.nextQuestion();
      this.renderQuizQuestion();
    } else {
      this.app.leaveGame();
      playSound('endLevel', this.app);

      renderFinishPopup(this.app);
      this.enableReturnToLevels(true);
    }
  }

  enableQuizTypeChoose() {
    HTMLElements.quizTypeMenu.forEach((quizTypebtn, quizTypeNumber) => {
      quizTypebtn.addEventListener('click', () => {
        this.app.quizType = quizTypeNumber;
        this.renderLevels();
      });
    });
  }

  questionLaunch() {
    if (this.app.isTimerOn)
      setTimeout(
        () =>
          this.app.startTimer(() => {
            this.chooseAnswer(wrongAnswerNumber);
          }),
        100
      );

    this.enableAnswerChoose();
    this.enableReturnToLevels();
    setTimeout(() => {
      this.app.questionLaunch();
    }, 1000);
  }

  displayQuestionPage() {
    this.questionLaunch();
    smoothChangePage(gameModules[this.app.quizType], ...staticModules);
    togglePopup(HTMLElements.picInfoPopupContainer, false);
  }

  renderArtistQuizQuestion() {
    HTMLElements.artistQuizModule.innerHTML =
      this.app.question.getArtistQuizQuestion();
    preloadImages([this.app.question.artistQuizImageLink], () =>
      this.displayQuestionPage()
    );
  }

  renderPictureQuizQuestion() {
    HTMLElements.picQuizModule.innerHTML =
      this.app.question.getPictureQuizQuestion();
    preloadImages(this.app.question.pictureQuizImageLinks, () =>
      this.displayQuestionPage()
    );
  }

  renderQuizQuestion() {
    if (this.app.quizType === quizTypeNumbers.artistQuiz)
      this.renderArtistQuizQuestion();
    else if (this.app.quizType === quizTypeNumbers.pictureQuiz)
      this.renderPictureQuizQuestion();
  }

  levelStart(levelNumber) {
    this.app.startGame(levelNumber);
    this.renderQuizQuestion();
  }

  enableLevelStart() {
    HTMLElements.levelCards().forEach((card, cardNumber) => {
      card.addEventListener('click', () => this.levelStart(cardNumber));
    });
  }
}

export default GameUtils;
