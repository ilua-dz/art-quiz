export const HTMLElements = {
  settingsBtn: document.querySelector('.settings-btn'),
  controlsBtn: document.querySelector('.controls-btn'),
  backBtns: document.querySelectorAll('.back-btn'),

  header: document.querySelector('.header'),
  miniHeader: document.querySelector('.mini-header'),
  footer: document.querySelector('.footer'),

  settingsModule: document.querySelector('.settings-module'),
  startModule: document.querySelector('.start-module'),
  controlsModule: document.querySelector('.controls-module'),

  categoriesModule: document.querySelector('.categories-module'),
  quizTypeString: document.querySelector('.quiz-type-string'),
  categoriesContainer: document.querySelector('.categories-container'),

  scoresModule: document.querySelector('.scores-module'),
  scoresContainer: document.querySelector('.scores-container'),
  scoresTitle: document.querySelector('.level-string'),

  artistQuizModule: document.querySelector('.artist-quiz-module'),
  picQuizModule: document.querySelector('.pic-quiz-module'),
  picInfoPopup: document.querySelector('.pic-info-popup'),
  picInfoPopupContainer: document.querySelector('.pic-info-popup-container'),
  finishLevelPopupContainer: document.querySelector(
    '.level-finish-popup-container'
  ),

  quizTypeMenu: document.querySelectorAll('.quiz-type-general'),

  volumeToggleBtn: document.querySelector('.volume-toggle'),
  volumeInput: document.querySelector('.settings-volume-range'),
  musicToggleBtn: document.querySelector('.music-toggle'),
  musicVolumeInput: document.querySelector('.settings-music-range'),
  timerToggleBtn: document.querySelector('.timer-toggle'),
  timerInput: document.querySelector('.settings-timer-range'),
  allInputsTypeRange: document.querySelectorAll('input'),

  levelCards: () => document.querySelectorAll('.category-card'),
  levelCardIndicator: (card) => card.querySelector('.category-card-indicator'),
  backBtn: () => document.querySelector('.popup-close-btn'),
  picBtns: () => document.querySelectorAll('.scores-pic-btn'),
  backToLevelsBtn: () => document.querySelector('.back-levels'),
  backToLevelsBtns: () => document.querySelectorAll('.back-levels'),
  nextPicBtn: () => document.querySelector('.next-btn'),
  artistQuizAnswerBtns: () => document.querySelectorAll('.artist-answer'),
  pictureQuizAnswerBtns: () => document.querySelectorAll('.pic-answer'),
  timerBlock: () => document.querySelector('.timer-block'),
  timeLeftBlock: () => document.querySelector('.time-left-block'),
};

export const gameModules = [
  HTMLElements.artistQuizModule,
  HTMLElements.picQuizModule,
];

export const staticModules = [
  HTMLElements.startModule,
  HTMLElements.settingsModule,
  HTMLElements.controlsModule,
  HTMLElements.categoriesModule,
  HTMLElements.artistQuizModule,
  HTMLElements.picQuizModule,
  HTMLElements.scoresModule,
  HTMLElements.footer,
];
