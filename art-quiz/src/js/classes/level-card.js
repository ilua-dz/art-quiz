class LevelCard {
  constructor(levelNumber, _quizType, gallery) {
    const randomLevelPicture = () => {
      const levelImgStartNumber = levelNumber * 10 - 10 + _quizType * 120;
      const levelPics = gallery.slice(
        levelImgStartNumber,
        levelImgStartNumber + 10
      );
      return levelPics[Math.floor(Math.random() * levelPics.length)];
    };

    const picture = randomLevelPicture();
    this.levelNumber = levelNumber;
    this.imageLink = `https://raw.githubusercontent.com/ilua-dz/art-quiz-gallery/main/img/${picture.imageNum}.avif`;
  }

  getCard(levelResult) {
    const card = document.createElement('div');
    const cardTitle = document.createElement('div');

    this.image = new Image();
    this.image.src = this.imageLink;
    card.style.backgroundImage = `url("${this.image.src}")`;

    card.className = 'category-card pic-btn _btn';

    cardTitle.className = 'category-title';
    cardTitle.innerHTML = `<i class="fa-regular">${this.levelNumber}</i>`;

    if (levelResult) {
      card.classList.add('grayscale-0');
      const levelIndicator = document.createElement('div');
      levelIndicator.classList.add('category-card-indicator', '_btn');
      const levelResultParsed = levelResult
        .split('')
        .reduce((sum, i) => sum + +i, 0);
      levelIndicator.textContent = `${levelResultParsed}/10`;
      card.append(levelIndicator);
    }
    card.append(cardTitle);
    return card;
  }
}

export default LevelCard;
