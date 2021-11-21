export default class {
  constructor(_quizType, levelNumber, gallery) {
    this.quizType = _quizType;
    this.levelNumber = levelNumber;
    this.questionNumber = 0;
    this.gallery = gallery;

    this.picObj = () => {
      const picNumber = _quizType * 120 + levelNumber * 10 + this.questionNumber;
      return gallery[picNumber];
    };

    this.picElement = () => {
      const pic = document.createElement('img');
      pic.src = `./assets/gallery/full/${this.picObj().imageNum}full.avif`
      pic.alt = `${this.picObj().name}`;
      return pic;
    };
  }

  nextQuestion() {
    this.questionNumber += 1;
  }

  getAnswers() {
    const newRandomPic = (slicedGallery) => {
      const picNumber = Math.floor(Math.random() * slicedGallery.length);
      return slicedGallery[picNumber];
    };

    let randomGallery = this.gallery.slice(this.quizType * 120, this.quizType * 120 + 120);
    randomGallery.splice(this.levelNumber * 10, 10);

    const falseAnswers = [];
    for (let i = 0; i < 3; i += 1) {
      const randomPic = newRandomPic(randomGallery);
      const randomAuthor = randomPic.author;
      falseAnswers.push(randomPic);
      randomGallery = randomGallery.filter((pic) => pic.author !== randomAuthor);
    }

    falseAnswers.push(this.picObj());
    const answers = falseAnswers;

    for (let i = answers.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    const trueAnswerNumber = answers.indexOf(this.picObj());
    return { trueAnswerNumber, answers };
  }

  getArtistQuizQuestion() {
    const question = document.createElement('div');

    const pic = this.picElement();

    const title = document.createElement('h2');
    title.textContent = 'Who is the author of the picture?';

    const answersList = document.createElement('ul');

    const answerSet = this.getAnswers();
    this.trueAnswerNumber = answerSet.trueAnswerNumber;

    answerSet.answers.forEach((answer) => {
      const answerString = document.createElement('li');
      answerString.classList.add('answer');
      answerString.classList.add('_btn', 'decorate-button');
      answerString.textContent = answer.author;
      answersList.append(answerString);
    });

    question.append(pic, title, answersList);
    return question.innerHTML;
  }

  getTrueAnswerPopup(trueness) {
    const popup = document.createElement('div');

    const answerIndicator = document.createElement('i');
    const answerClass = trueness
      ? ['fa-circle-check', 'trueBg']
      : ['fa-circle-xmark', 'falseBg'];
    answerIndicator.classList.add('fa-regular', 'fa-sizing', 'answer-indicator', ...answerClass);

    const pic = this.picElement();

    const description = document.createElement('div');
    description.innerHTML = `<h2>${this.picObj().name}</h2>
    <h2>${this.picObj().author}</h2>
    <h2>${this.picObj().year}</h2>`;

    const nextPicBtn = document.createElement('i');
    nextPicBtn.classList.add('fa-regular', 'fa-square-right', 'fa-sizing', '_btn', 'decorate-button', 'next-btn');

    popup.append(answerIndicator, pic, description, nextPicBtn);

    return popup.innerHTML;
  }
}
