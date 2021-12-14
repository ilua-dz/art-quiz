import { audioLib, timeGameMusicToggle } from '../utils/sounds';
import { HTMLElements } from '../utils/html-elements';
import QuizQuestion from './quiz-question';
import timerStart from '../utils/timer';

const saveSwitch = (switchName, localStorageKey) => {
  if (switchName) {
    localStorage.setItem(localStorageKey, '1');
  } else localStorage.removeItem(localStorageKey);
};
class Application {
  constructor() {
    this.#appInit();
  }

  #appInit() {
    this.#getGallery();

    this.inGame = false;
    this.isAnswerChosen = false;
    this.quizType = undefined;
    this.answersCounter = undefined;
    this.trueAnswersCounter = undefined;
    this.levelResultString = undefined;
    this.question = undefined;
    this.timerId = undefined;

    this.soundVolume = localStorage.getItem('soundVolume')
      ? +localStorage.getItem('soundVolume')
      : 0.6;

    this.musicVolume = localStorage.getItem('musicVolume')
      ? +localStorage.getItem('musicVolume')
      : 0.8;

    this.timerTime = localStorage.getItem('timerTime')
      ? +localStorage.getItem('timerTime')
      : 20;

    this.isSoundVolumeMute = !!localStorage.getItem('isSoundVolumeMute');
    this.isMusicPlaying = !!localStorage.getItem('isMusicPlaying');
    this.isTimerOn = !!localStorage.getItem('isTimerOn');

    this.bgAudio = new Audio(audioLib.bgMusic);
    this.timeGameBg = new Audio(audioLib.timeGameBg);

    this.setMusicVolume();
  }

  async #getGallery() {
    const res = await fetch('./assets/gallery/gallery_data_en.json');
    const data = await res.json();
    this.galleryArr = data;
  }

  finishTimeGame() {
    this.timeGameBg.currentTime = 0;
  }

  startGame(levelNumber) {
    this.levelResultString = '';
    this.answersCounter = 0;
    this.trueAnswersCounter = 0;
    this.inGame = true;
    this.isAnswerChosen = false;
    this.question = new QuizQuestion(levelNumber, this);
  }

  startTimer(chooseWrongAnswer) {
    this.timerId = setTimeout(() => {
      if (!this.isAnswerChosen) chooseWrongAnswer();
    }, this.timerTime * 1000 + 800);
    timerStart(this);
  }

  questionLaunch() {
    this.isAnswerChosen = false;
  }

  leaveGame() {
    clearTimeout(this.timerId);
    timeGameMusicToggle(false, this);
    this.inGame = false;
    this.isAnswerChosen = false;
    HTMLElements.artistQuizModule.innerHTML = '';
    HTMLElements.picQuizModule.innerHTML = '';
  }

  switchSounds(direction = undefined) {
    if (direction === false) this.isSoundVolumeMute = false;
    else this.isSoundVolumeMute = !this.isSoundVolumeMute;
    this.#saveSoundSwitch();
  }

  switchMusic() {
    this.isMusicPlaying = !this.isMusicPlaying;
    this.#saveMusicSwitch();
  }

  switchTimer() {
    this.isTimerOn = !this.isTimerOn;
    this.#saveTimerSwitch();
  }

  changeSoundVolume(volume) {
    this.soundVolume = volume;
    this.#saveSoundVolume();
  }

  setMusicVolume() {
    this.bgAudio.volume = this.musicVolume;
    this.timeGameBg.volume = this.musicVolume;
  }

  changeMusicVolume(volume) {
    this.musicVolume = volume;
    this.setMusicVolume();
    this.#saveMusicVolume();
  }

  changeTimerTime(time) {
    this.timerTime = time;
    this.#saveTimerTime();
  }

  #saveSoundVolume() {
    localStorage.setItem('soundVolume', this.soundVolume);
  }

  #saveSoundSwitch() {
    saveSwitch(this.isSoundVolumeMute, 'isSoundVolumeMute');
  }

  #saveMusicVolume() {
    localStorage.setItem('musicVolume', this.musicVolume);
  }

  #saveMusicSwitch() {
    saveSwitch(this.isMusicPlaying, 'isMusicPlaying');
  }

  #saveTimerTime() {
    localStorage.setItem('timerTime', this.timerTime);
  }

  #saveTimerSwitch() {
    saveSwitch(this.isTimerOn, 'isTimerOn');
  }
}

export default Application;
