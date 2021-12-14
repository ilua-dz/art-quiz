import { HTMLElements, staticModules } from './html-elements';
import { playSound } from './sounds';
import { smoothChangePage } from './render-functions';
import { switchSounds, switchMusic } from './settings-utils';
import { quizTypeNumbers } from './definitions';

export const enableKeyboardSettings = (app) => {
  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyQ':
        playSound('click', app);
        smoothChangePage(HTMLElements.startModule, ...staticModules);
        break;
      case 'KeyM':
        playSound('click', app);
        switchMusic(app);
        break;
      case 'KeyS':
        playSound('click', app);
        switchSounds(app);
        break;
      default:
        break;
    }
  });
};

export const enableKeyboardGaming = (app) => {
  window.addEventListener('keyup', (e) => {
    if (app.inGame && !app.isAnswerChosen) {
      for (let i = 0; i < 4; i += 1) {
        if (e.code === `Digit${i + 1}` || e.code === `Numpad${i + 1}`) {
          if (app.quizType === quizTypeNumbers.artistQuiz) {
            HTMLElements.artistQuizAnswerBtns()[i].click();
          } else if (app.quizType === quizTypeNumbers.pictureQuiz)
            HTMLElements.pictureQuizAnswerBtns()[i].click();
        }
      }
    } else if (e.code === 'Space' && app.inGame && app.isAnswerChosen) {
      document.querySelector('.next-btn').click();
    } else if (e.code === 'Space' && !app.inGame && !app.isAnswerChosen) {
      document.querySelector('.popup-back-levels').click();
    }
  });
};
