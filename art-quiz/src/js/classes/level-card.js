import cssUtils from '../utils/css-utils';
import { getImageURL, getLevelResultKey } from '../utils/definitions';
import { quizOptions } from './quiz-question';

const parseLevelResult = (levelResult) =>
  levelResult.split('').reduce((sum, i) => sum + +i, 0);

const appendLevelIndicator = (card, levelResult) => {
  if (levelResult) {
    card.classList.add(cssUtils.color);
    const levelIndicator = document.createElement('div');
    levelIndicator.classList.add('category-card-indicator', '_btn');

    const levelResultParsed = parseLevelResult(levelResult);

    levelIndicator.textContent = `${levelResultParsed}/10`;
    card.append(levelIndicator);
  }
};

const getLevelRandomPicDescription = (levelNumber, app) => {
  const levelImgStartNumber =
    app.quizType * quizOptions.questionsAmountInQuizType +
    (levelNumber - 1) * quizOptions.questionsAmountInLevel;
  const levelPics = app.galleryArr.slice(
    levelImgStartNumber,
    levelImgStartNumber + quizOptions.questionsAmountInLevel
  );

  return levelPics[Math.floor(Math.random() * levelPics.length)];
};

class LevelCard {
  constructor(levelNumber, app) {
    this.app = app;
    this.levelResultKey = getLevelResultKey(app.quizType, levelNumber);
    this.levelNumber = levelNumber;
  }

  getCard(levelResult) {
    const card = document.createElement('div');
    card.className = 'category-card pic-btn _btn';

    const cardTitle = document.createElement('div');
    cardTitle.className = 'category-title';
    cardTitle.innerHTML = `<i class="fa-regular">${this.levelNumber}</i>`;

    const picture = getLevelRandomPicDescription(this.levelNumber, this.app);
    this.imageLink = getImageURL(picture.imageNum, 'small');
    card.style.backgroundImage = `url("${this.imageLink}")`;

    appendLevelIndicator(card, levelResult);

    card.append(cardTitle);
    return card;
  }
}

export default LevelCard;
