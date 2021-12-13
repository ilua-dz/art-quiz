import { audioLib } from '../utils/sounds';

class Application {
  constructor() {
    this.inGame = false;
    this.isAnswerChoised = false;

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

  finishTimeGame() {
    this.timeGameBg.currentTime = 0;
  }

  switchSounds(direction = undefined) {
    if (direction === false) this.isSoundVolumeMute = false;
    else this.isSoundVolumeMute = !this.isSoundVolumeMute;
    this.saveSoundSwitch();
  }

  switchMusicVolume() {
    this.isMusicPlaying = !this.isMusicPlaying;
    this.saveMusicSwitch();
  }

  switchTimer() {
    this.isTimerOn = !this.isTimerOn;
    this.saveTimerSwitch();
  }

  changeSoundVolume(volume) {
    this.soundVolume = volume;
    this.saveSoundVolume();
  }

  setMusicVolume() {
    this.bgAudio.volume = this.musicVolume;
    this.timeGameBg.volume = this.musicVolume;
  }

  changeMusicVolume(volume) {
    this.musicVolume = volume;
    this.setMusicVolume();
    this.saveMusicVolume();
  }

  changeTimerTime(time) {
    this.timerTime = time;
    this.saveTimerTime();
  }

  saveSoundVolume() {
    localStorage.setItem('soundVolume', this.soundVolume);
  }

  saveSoundSwitch() {
    if (this.isSoundVolumeMute) {
      localStorage.setItem('isSoundVolumeMute', '1');
    } else localStorage.removeItem('isSoundVolumeMute');
  }

  saveMusicVolume() {
    localStorage.setItem('musicVolume', this.musicVolume);
  }

  saveMusicSwitch() {
    if (this.isMusicPlaying) {
      localStorage.setItem('isMusicPlaying', '1');
    } else localStorage.removeItem('isMusicPlaying');
  }

  saveTimerTime() {
    localStorage.setItem('timerTime', this.timerTime);
  }

  saveTimerSwitch() {
    if (this.isTimerOn) {
      localStorage.setItem('isTimerOn', '1');
    } else localStorage.removeItem('isTimerOn');
  }
}

export default Application;
