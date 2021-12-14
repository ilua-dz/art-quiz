import { HTMLElements } from './html-elements';

import { timeGameMusicToggle } from './sounds';
import cssUtils from './css-utils';

const timerStart = (app) => {
  timeGameMusicToggle(true, app);
  HTMLElements.timerBlock().classList.add(cssUtils.timerOn);
  HTMLElements.timeLeftBlock().classList.add(`trans-width-${app.timerTime}`);
  setTimeout(() => {
    HTMLElements.timeLeftBlock().classList.add('width-0');
  }, 800);
};

export default timerStart;
