import { getImageURL } from '../utils/definitions';

export const getImageHTML = (imageDescriptionObject, getFullImage = true) => {
  const imageHTML = document.createElement('img');
  imageHTML.src = getFullImage
    ? getImageURL(imageDescriptionObject.imageNum, 'full')
    : getImageURL(imageDescriptionObject.imageNum, 'small');
  imageHTML.alt = `${imageDescriptionObject.name}`;
  return imageHTML;
};

export const quizOptions = {
  questionsAmountInLevel: 10,
  levelsAmountInQuizType: 12,
  questionsAmountInQuizType: 10 * 12,
  wrongAnswersAmountInQuestion: 3,
};

const getRandomPicture = (gallery) => {
  const picNumber = Math.floor(Math.random() * gallery.length);
  return gallery[picNumber];
};

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const getTimerHTML = () => {
  const timerBlock = document.createElement('div');
  timerBlock.classList.add('timer-block');

  const leftTimeBlock = document.createElement('div');
  leftTimeBlock.classList.add('time-left-block');

  timerBlock.append(leftTimeBlock);

  return timerBlock;
};

export const getBackButtonHTML = (...addClasses) => {
  const backBtn = document.createElement('i');
  backBtn.classList.add(
    'fa-square-left',
    'fa-sizing',
    '_btn',
    'decorate-button',
    ...addClasses
  );
  return backBtn;
};

class QuizQuestion {
  constructor(levelNumber, app) {
    this.quizType = app.quizType;
    this.levelNumber = levelNumber;
    this.questionNumber = 0;
    this.gallery = app.galleryArr;
    this.app = app;

    this.quizTypeFirstQuestionNumber =
      this.quizType * quizOptions.questionsAmountInQuizType;
    this.levelFirstQuestionNumber =
      this.levelNumber * quizOptions.questionsAmountInLevel;
  }

  #rightAnswerDescriptionObject() {
    const picNumber =
      this.quizTypeFirstQuestionNumber +
      this.levelFirstQuestionNumber -
      quizOptions.questionsAmountInLevel +
      this.questionNumber;
    return this.app.galleryArr[picNumber];
  }

  nextQuestion() {
    this.questionNumber += 1;
  }

  #getLevelGallery() {
    this.levelGallery = this.gallery.slice(
      this.quizTypeFirstQuestionNumber,
      this.quizTypeFirstQuestionNumber + quizOptions.questionsAmountInQuizType
    );
    this.levelGallery.splice(
      this.levelFirstQuestionNumber,
      quizOptions.questionsAmountInLevel
    );
  }

  #filterLevelGallery(author) {
    this.levelGallery = this.levelGallery.filter(
      (pic) => pic.author.toUpperCase() !== author.toUpperCase()
    );
  }

  #getWrongAnswers() {
    const falseAnswers = [];
    for (let i = 0; i < quizOptions.wrongAnswersAmountInQuestion; i += 1) {
      const randomPic = getRandomPicture(this.levelGallery);
      falseAnswers.push(randomPic);
      this.#filterLevelGallery(randomPic.author);
    }
    return falseAnswers;
  }

  #getAnswerSet() {
    const answerSet = this.#getWrongAnswers();
    answerSet.push(this.#rightAnswerDescriptionObject());
    return shuffleArray(answerSet);
  }

  #getQuestionAnswers() {
    this.#getLevelGallery();
    this.#filterLevelGallery(this.#rightAnswerDescriptionObject().author);

    const answers = this.#getAnswerSet();
    const trueAnswerNumber = answers.indexOf(
      this.#rightAnswerDescriptionObject()
    );

    return { trueAnswerNumber, answers };
  }

  #getQuestion() {
    const answerSet = this.#getQuestionAnswers();
    this.trueAnswerNumber = answerSet.trueAnswerNumber;

    const questionBodyHTML = document.createElement('div');
    const backButton = getBackButtonHTML('fa-thin', 'back-levels');
    questionBodyHTML.append(backButton);

    const questionTitleHTML = document.createElement('h2');

    const qustionTimerHTML = getTimerHTML();

    return {
      answerSet,
      questionBodyHTML,
      questionTitleHTML,
      qustionTimerHTML,
    };
  }

  getArtistQuizQuestion() {
    const question = this.#getQuestion();

    const questionSubject = getImageHTML(this.#rightAnswerDescriptionObject());
    this.artistQuizImageLink = questionSubject.src; // for preload image

    question.questionTitleHTML.textContent =
      'Who is the author of the picture?';

    const answersList = document.createElement('ul');
    answersList.append(question.qustionTimerHTML);

    question.answerSet.answers.forEach((answer) => {
      const answerString = document.createElement('li');
      answerString.classList.add('artist-answer', '_btn', 'decorate-button');
      answerString.textContent = answer.author;
      answersList.append(answerString);
    });

    question.questionBodyHTML.append(
      questionSubject,
      question.questionTitleHTML,
      answersList
    );
    return question.questionBodyHTML.innerHTML;
  }

  getPictureQuizQuestion() {
    const question = this.#getQuestion();

    this.pictureQuizImageLinks = []; // for preload images

    question.questionTitleHTML.textContent = `Choose a picture by ${
      this.#rightAnswerDescriptionObject().author
    }`;
    question.questionTitleHTML.append(question.qustionTimerHTML);

    question.answerSet.answers.forEach(
      (pictureDescriptionObject, answerNumber) => {
        const answerImageHTML = getImageHTML(pictureDescriptionObject);
        answerImageHTML.classList.add('pic-answer', 'pic-btn', '_btn');
        question.questionBodyHTML.append(answerImageHTML);
        if (answerNumber === 1)
          question.questionBodyHTML.append(question.questionTitleHTML);
        this.pictureQuizImageLinks.push(answerImageHTML.src); // for preload images
      }
    );

    return question.questionBodyHTML.innerHTML;
  }

  getTrueAnswerPopup(isAnswerRight) {
    const popup = document.createElement('div');

    const answerIndicator = document.createElement('i');
    const answerClass = isAnswerRight
      ? ['fa-circle-check', 'trueBg']
      : ['fa-circle-xmark', 'falseBg'];
    answerIndicator.classList.add(
      'fa-regular',
      'fa-sizing',
      'answer-indicator',
      ...answerClass
    );

    const rightAnswerPicture = getImageHTML(
      this.#rightAnswerDescriptionObject()
    );

    const description = document.createElement('div');
    description.innerHTML = `<h2>${
      this.#rightAnswerDescriptionObject().name
    }</h2>
    <h2>${this.#rightAnswerDescriptionObject().author}</h2>
    <h2>${this.#rightAnswerDescriptionObject().year}</h2>`;

    const nextPicBtn = document.createElement('i');
    nextPicBtn.classList.add(
      'fa-regular',
      'fa-square-right',
      'fa-sizing',
      '_btn',
      'decorate-button',
      'next-btn'
    );

    popup.append(answerIndicator, rightAnswerPicture, description, nextPicBtn);

    return popup.innerHTML;
  }
}

export default QuizQuestion;
