import '../css/style.css';

import Application from './classes/app';
import GameUtils from './utils/game-utils';

import enableMainMenuTransitions from './utils/main-menu-transitions';

import { enableRestoreMusicPlaying, enableButtonSounds } from './utils/sounds';

import {
  enableSoundsSettings,
  enableMusicSettings,
  enableTimerSettings,
} from './utils/settings-utils';

import {
  enableKeyboardGaming,
  enableKeyboardSettings,
} from './utils/keyboard-utils';

const app = new Application();
app.gameUtils = new GameUtils(app);

enableMainMenuTransitions(app);

enableRestoreMusicPlaying(app);
enableButtonSounds(app);

enableSoundsSettings(app);
enableMusicSettings(app);
enableTimerSettings(app);

enableKeyboardSettings(app);
enableKeyboardGaming(app);
