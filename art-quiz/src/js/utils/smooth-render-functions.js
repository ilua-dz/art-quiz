import cssUtils from './css-utils';
import HTMLElements from './html-elements';

const gameModules = [HTMLElements.artistQuizModule, HTMLElements.picQuizModule];

const toggleHeader = (size) => {
  if (!size) {
    HTMLElements.header.classList.add(cssUtils.offClass);
    HTMLElements.miniHeader.classList.remove(cssUtils.offClass);
  } else {
    HTMLElements.header.classList.remove(cssUtils.offClass);
    HTMLElements.miniHeader.classList.add(cssUtils.offClass);
  }
};

const smoothChangePage = (onModule, ...allModules) => {
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

const togglePopup = (popup, direction) => {
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

export { togglePopup, smoothChangePage };
