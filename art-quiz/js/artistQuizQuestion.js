export default class {
  constructor(_quizType, levelNumber, gallery) {
    this.questionNumber = 0;

    this.picture = () => {
      const picNumber = _quizType * 120 + levelNumber * 10 + this.questionNumber;
      return gallery[picNumber];
    };

    this.picLink = () => `./assets/gallery/full/${this.picture().imageNum}full.avif`;

    const newRandomPic = (slicedGallery) => {
      const picNumber = Math.floor(Math.random() * slicedGallery.length);
      return slicedGallery[picNumber];
    };

    let randomGallery = gallery.slice(_quizType * 120, _quizType * 120 + 120);
    randomGallery.splice(levelNumber * 10, 10);

    const falseAnswers = [];
    for (let i = 0; i < 3; i += 1) {
      const randomPic = newRandomPic(randomGallery);
      const randomAuthor = randomPic.author;
      falseAnswers.push(randomPic);
      randomGallery = randomGallery.filter((pic) => pic.author !== randomAuthor);
    }
    console.log(falseAnswers)
    falseAnswers.push(this.picture());
    this.answers = falseAnswers;
  }

  nextQuestion() {
    this.questionNumber += 1;
  }

  getAnswers() {
    const temp = [...this.answers];
    for (let i = temp.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    const trueAnswerNumber = temp.indexOf(this.picture());
    return { trueAnswerNumber, answers: temp };
  }

  create() {
    const question = document.createElement('div');

    const pic = document.createElement('img');
    pic.src = `${this.picLink()}`;
    pic.alt = `${this.picture().name}`;

    const title = document.createElement('h2');
    title.textContent = 'Who is the author of the picture?';

    const answersList = document.createElement('ul');

    this.getAnswers().answers.forEach((answer) => {
      const answerString = document.createElement('li');
      answerString.classList.add('answer');
      answerString.classList.add('_btn', 'decorate-button');
      answerString.textContent = answer.author;
      answersList.append(answerString);
    });

    question.append(pic, title, answersList);
    return question.innerHTML;
  }
}
