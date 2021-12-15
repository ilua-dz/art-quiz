import { quizTypeNames, getLevelResultKey } from '../utils/definitions';
import { getImageHTML, getBackButtonHTML } from './quiz-question';
import cssUtils from '../utils/css-utils';

class Scores {
  constructor(levelNumber, app) {
    this.app = app;
    this.firstPictureNumber = app.quizType * 120 + levelNumber * 10 - 10;

    this.bodyHTML = document.createElement('div');

    const levelResultKey = getLevelResultKey(app.quizType, levelNumber);
    const levelResult = localStorage.getItem(levelResultKey)
      ? localStorage.getItem(levelResultKey)
      : false;

    this.titleString = `${
      quizTypeNames[app.quizType]
    } - Level ${levelNumber} - Pictures`;

    this.scoresImageLinks = []; // for preload images

    for (let i = 0; i < 10; i += 1) {
      const pic = getImageHTML(
        this.app.galleryArr[this.firstPictureNumber + i],
        false
      );
      pic.classList.add('scores-pic-btn');

      if (levelResult) {
        if (levelResult[i] === '1') {
          pic.classList.add(cssUtils.color, 'pic-btn', 'resolved-pic');
        } else {
          pic.classList.add('secret-pic');
        }
      }

      this.scoresImageLinks.push(pic.src); // for preload images

      this.bodyHTML.append(pic);
    }
  }

  getInfoPopup(imageNumber) {
    const popup = document.createElement('div');

    const imageHTML = getImageHTML(this.app.galleryArr[imageNumber]);
    const imageDescriptionObject = this.app.galleryArr[imageNumber];

    this.imageLink = imageHTML.src; // for preload image

    const description = document.createElement('div');
    description.innerHTML = `<h2>${imageDescriptionObject.name}</h2><h2>${imageDescriptionObject.author}</h2><h2>${imageDescriptionObject.year}</h2>`;

    const backBtn = getBackButtonHTML(
      'popup-close-btn',
      'back-btn',
      'fa-regular'
    );

    popup.append(imageHTML, description, backBtn);

    return popup.innerHTML;
  }
}

export default Scores;
