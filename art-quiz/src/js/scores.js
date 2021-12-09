export default class {
  constructor(quizType, levelNumber, gallery) {
    this.gallery = [...gallery];

    this.firstPicNumber = quizType * 120 + levelNumber * 10;
    let picNumber = this.firstPicNumber;

    this.node = document.createElement('div');

    const levelResultKey = `quizType_${quizType}_level_${levelNumber}_result`;
    const levelResult = localStorage.getItem(levelResultKey)
      ? localStorage.getItem(levelResultKey)
      : false;

    const quizTypeNames = ['Artist quiz', 'Picture quiz'];
    this.titleString = `${quizTypeNames[quizType]} - Level ${
      levelNumber + 1
    } - Pictures`;

    this.getPic = (picNum, full = false) => {
      const pic = document.createElement('img');
      pic.src = full
        ? `https://raw.githubusercontent.com/ilua-dz/art-quiz-gallery/main/full/${picNum}full.avif`
        : `https://raw.githubusercontent.com/ilua-dz/art-quiz-gallery/main/img/${picNum}.avif`;
      pic.alt = `${gallery[picNumber].name}`;
      return pic;
    };

    this.picsSrc = []; // for preload images

    for (let i = 0; i < 10; i += 1) {
      const pic = this.getPic(picNumber);
      this.picsSrc.push(pic.src);
      pic.classList.add('scores-pic-btn');
      if (levelResult) {
        if (levelResult[i] === '1') {
          pic.classList.add('grayscale-0', 'pic-btn', 'resolved-pic');
        } else {
          pic.classList.add('secret-pic');
        }
      }
      this.node.append(pic);
      picNumber += 1;
    }
  }

  getInfoPopup(picNumber) {
    const popup = document.createElement('div');

    const picElement = this.getPic(picNumber, 1);
    const pic = this.gallery[picNumber];
    this.picSrc = picElement.src;

    const description = document.createElement('div');
    description.innerHTML = `<h2>${pic.name}</h2><h2>${pic.author}</h2><h2>${pic.year}</h2>`;

    const backBtn = document.createElement('i');
    backBtn.classList.add(
      'fa-regular',
      'fa-square-left',
      'fa-sizing',
      '_btn',
      'decorate-button',
      'back-btn',
      'popup-close-btn'
    );

    popup.append(picElement, description, backBtn);

    return popup.innerHTML;
  }
}
