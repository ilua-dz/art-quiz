import cssUtils from './css-utils';
import { HTMLElements, gameModules } from './html-elements';

export const toggleHeader = (size) => {
  if (!size) {
    HTMLElements.header.classList.add(cssUtils.offClass);
    HTMLElements.miniHeader.classList.remove(cssUtils.offClass);
  } else {
    HTMLElements.header.classList.remove(cssUtils.offClass);
    HTMLElements.miniHeader.classList.add(cssUtils.offClass);
  }
};

export const smoothChangePage = (onModule, ...allModules) => {
  if (gameModules.includes(onModule))
    allModules.push(HTMLElements.header, HTMLElements.miniHeader);
  allModules.forEach((module) => module.classList.add(cssUtils.hideClass));
  setTimeout(() => {
    allModules.forEach((module) => {
      module.classList.remove(cssUtils.onClass, cssUtils.offClass);
      if (module !== onModule) module.classList.toggle(cssUtils.offClass);
      else module.classList.toggle(cssUtils.onClass);
    });
    HTMLElements.footer.classList.toggle(cssUtils.offClass);
    if (gameModules.includes(onModule)) toggleHeader();
    else toggleHeader(1);
  }, 300);
  setTimeout(() => {
    allModules.forEach((module) => module.classList.remove(cssUtils.hideClass));
  }, 400);
};

export const togglePopup = (popup, direction) => {
  if (direction) {
    popup.classList.toggle(cssUtils.offClass, !direction);
    setTimeout(
      () => popup.classList.toggle(cssUtils.hideClass, !direction),
      200
    );
  } else {
    popup.classList.toggle(cssUtils.hideClass, !direction);
    setTimeout(
      () => popup.classList.toggle(cssUtils.offClass, !direction),
      1000
    );
  }
};

export const renderSettings = (app) => {
  if (app.isSoundVolumeMute) {
    HTMLElements.volumeToggleBtn.classList.add('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume');
    HTMLElements.volumeInput.value = 0;
  } else {
    HTMLElements.volumeToggleBtn.classList.remove('fa-volume-slash');
    HTMLElements.volumeToggleBtn.classList.add('fa-volume');
    HTMLElements.volumeInput.value = app.soundVolume * 100;
  }
  if (app.isMusicPlaying) {
    HTMLElements.musicToggleBtn.classList.add('fa-music');
    HTMLElements.musicToggleBtn.classList.remove('fa-music-slash');
  } else {
    HTMLElements.musicToggleBtn.classList.remove('fa-music');
    HTMLElements.musicToggleBtn.classList.add('fa-music-slash');
  }
  HTMLElements.musicVolumeInput.value = app.musicVolume * 100;

  HTMLElements.timerInput.value = app.timerTime;
  HTMLElements.timerInput.disabled = !app.isTimerOn;
  if (app.isTimerOn) {
    HTMLElements.timerToggleBtn.classList.remove('fa-hourglass-clock');
    HTMLElements.timerToggleBtn.textContent = app.timerTime;
  }
};
