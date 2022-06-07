import { HTMLElements } from './html-elements';

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

export const switchMusic = (app) => {
  HTMLElements.musicToggleBtn.classList.toggle('fa-music');
  HTMLElements.musicToggleBtn.classList.toggle('fa-music-slash');
  if (app.isMusicPlaying) {
    app.bgAudio.pause();
    app.timeGameBg.pause();
    app.finishTimeGame();
  } else if (app.inGame && !app.isAnswerChoised && app.isTimerOn) {
    app.timeGameBg.play();
  } else app.bgAudio.play();
  app.switchMusic();
};

export const changeMusicVolume = (app) => {
  app.changeMusicVolume(HTMLElements.musicVolumeInput.value / 100);
};

const switchTimer = (app) => {
  HTMLElements.timerToggleBtn.classList.toggle('fa-hourglass-clock');
  HTMLElements.timerToggleBtn.textContent = app.isTimerOn ? '' : app.timerTime;
  app.switchTimer();
  HTMLElements.timerInput.disabled = !app.isTimerOn;
};

const changeTimerTime = (app) => {
  app.changeTimerTime(HTMLElements.timerInput.value);
  if (app.isTimerOn) HTMLElements.timerToggleBtn.textContent = app.timerTime;
};

export const enableTimerSettings = (app) => {
  HTMLElements.timerToggleBtn.addEventListener('click', () => switchTimer(app));
  HTMLElements.timerInput.addEventListener('input', () => changeTimerTime(app));
};

export const enableSoundsSettings = (app) => {
  HTMLElements.volumeToggleBtn.addEventListener('click', () =>
    switchSounds(app)
  );

  HTMLElements.volumeInput.addEventListener('input', () => {
    changeSoundsVolume(app);
  });
};

export const enableMusicSettings = (app) => {
  HTMLElements.musicToggleBtn.addEventListener('click', () => switchMusic(app));

  HTMLElements.musicVolumeInput.addEventListener('input', () =>
    changeMusicVolume(app)
  );
};
