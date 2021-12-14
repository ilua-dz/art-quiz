import { HTMLElements } from './html-elements';

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

export const restorePlayingMusic = (app) => {
  if (app.isMusicPlaying) app.bgAudio.play();
};

export const enableRestoreMusicPlaying = (app) => {
  window.addEventListener('mouseup', () => restorePlayingMusic(app), {
    once: true,
  });
};

export const enableButtonSounds = (app) => {
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
};
