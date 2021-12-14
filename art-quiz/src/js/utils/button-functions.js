import { HTMLElements, staticModules, gameModules } from './html-elements';
import {
  smoothChangePage,
  renderSettings,
  togglePopup,
} from './render-functions';
import { quizTypeNumbers } from './definitions';
import preloadImages from './images-preload-function';

export const enableMainMenuTransitions = (app) => {
  HTMLElements.controlsBtn.addEventListener('click', () =>
    smoothChangePage(HTMLElements.controlsModule, ...staticModules)
  );

  HTMLElements.settingsBtn.addEventListener('click', () => {
    renderSettings(app);
    smoothChangePage(HTMLElements.settingsModule, ...staticModules);
  });

  HTMLElements.backBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      app.leaveGame();
      smoothChangePage(HTMLElements.startModule, ...staticModules);
    });
  });
};

const questionLaunch = (app) => {
  if (app.isTimerOn) setTimeout(app.startTimer, 100);

  enableAnswerChoose();
  enableReturnToLevels();
  setTimeout(app.questionLaunch, 1000);
};

const displayQuestionPage = (app) => {
  questionLaunch();
  smoothChangePage(gameModules[app.quizType], ...staticModules);
  togglePopup(HTMLElements.picInfoPopupContainer, false);
};

export const renderArtistQuizQuestion = (app) => {
  HTMLElements.artistQuizModule.innerHTML =
    app.question.getArtistQuizQuestion();
  preloadImages([app.question.artistQuizImageLink], displayQuestionPage);
};

export const renderPictureQuizQuestion = (app) => {
  HTMLElements.picQuizModule.innerHTML = app.question.getPictureQuizQuestion();
  preloadImages(app.question.pictureQuizImageLinks, displayQuestionPage);
};

export const renderQuizQuestion = (app) => {
  if (app.quizType === quizTypeNumbers.artistQuiz) renderArtistQuizQuestion();
  else if (app.quizType === quizTypeNumbers.pictureQuiz)
    renderPictureQuizQuestion();
};

const levelStart = (levelNumber, app) => {
  app.startGame(levelNumber);
  renderQuizQuestion();
};

export const enableLevelStart = () => {
  HTMLElements.levelCards().forEach((card, cardNumber) => {
    card.addEventListener('click', () => levelStart(cardNumber));
  });
};
