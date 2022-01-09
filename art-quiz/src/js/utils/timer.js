import { HTMLElements } from './html-elements';

import { timeGameMusicToggle } from './sounds';
import cssUtils from './css-utils';

export const oneSecond = 1000;
export const timerStartDelayTime = oneSecond * 0.8;

const timerStart = (app) => {
  timeGameMusicToggle(true, app);
  HTMLElements.timerBlock().classList.add(cssUtils.color);
  HTMLElements.timeLeftBlock().classList.add(`trans-width-${app.timerTime}`);
  setTimeout(() => {
    HTMLElements.timeLeftBlock().classList.add('width-0');
  }, timerStartDelayTime);
};

export default timerStart;
