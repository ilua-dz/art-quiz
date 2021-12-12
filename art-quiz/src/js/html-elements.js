const HTMLElements = {
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
};

export default HTMLElements;
