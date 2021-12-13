import HTMLElements from './html-elements';

export const audioLib = {
  click: './assets/sounds/click.mp3',
  bgMusic: './assets/sounds/playback.weba',
  trueAnswer: './assets/sounds/true-answer.mp3',
  falseAnswer: './assets/sounds/wrong-answer.mp3',
  endLevel: './assets/sounds/end-round.mp3',
  timeGameBg: './assets/sounds/time-game-bg.mp3',
};

export const playSound = (soundSrc, app) => {
  if (!app.isSoundVolumeMute) {
    const audio = new Audio(audioLib[soundSrc]);
    audio.volume = app.soundVolume * 0.1;
    audio.play();
  }
};

export const timeGameMusicToggle = (direction, app) => {
  if (app.isMusicPlaying) {
    if (direction) {
      app.bgAudio.pause();
      app.timeGameBg.play();
    } else {
      app.bgAudio.play();
      app.timeGameBg.pause();
      app.finishTimeGame();
    }
  }
};

export const switchSounds = (app) => {
  HTMLElements.volumeToggleBtn.classList.toggle('fa-volume');
  HTMLElements.volumeToggleBtn.classList.toggle('fa-volume-slash');
  app.switchSounds();
  HTMLElements.volumeInput.value = app.isSoundVolumeMute
    ? 0
    : app.soundVolume * 100;
};

export const changeSoundsVolume = (app) => {
  app.changeSoundVolume(HTMLElements.volumeInput.value / 100);
  if (!app.soundVolume) {
    HTMLElements.volumeToggleBtn.classList.add('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume');
  } else {
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.add('fa-volume');
  }
  if (app.soundVolume) app.switchSounds(false);
};

export const switchMusicVolume = (app) => {
  HTMLElements.musicToggleBtn.classList.toggle('fa-music');
  HTMLElements.musicToggleBtn.classList.toggle('fa-music-slash');
  if (app.isMusicPlaying) {
    app.bgAudio.pause();
    app.timeGameBg.pause();
    app.finishTimeGame();
  } else if (app.inGame && !app.isAnswerChoised && app.isTimerOn) {
    app.timeGameBg.play();
  } else app.bgAudio.play();
  app.switchMusicVolume();
};

export const changeMusicVolume = (app) => {
  app.changeMusicVolume(HTMLElements.musicVolumeInput.value / 100);
};

export const restorePlayingMusic = (app) => {
  if (app.isMusicPlaying) app.bgAudio.play();
};
