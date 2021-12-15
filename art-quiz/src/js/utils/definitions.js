export const quizTypeNumbers = {
  artistQuiz: 0,
  pictureQuiz: 1,
};

export const quizTypeNames = ['Artist quiz', 'Picture quiz'];

export const wrongAnswerNumber = 4;

const imageSizes = {
  full: {
    dirName: 'full',
    prefix: 'full',
  },
  small: {
    dirName: 'img',
    prefix: '',
  },
};

export const getImageURL = (imageNum, size) =>
  `https://raw.githubusercontent.com/ilua-dz/art-quiz-gallery/main/${imageSizes[size].dirName}/${imageNum}${imageSizes[size].prefix}.avif`;

export const getLevelResultKey = (quizType, levelNumber) =>
  `quizType_${quizType}_level_${levelNumber}_result`;
