import { getBackButtonHTML } from './quiz-question';

class FinishLevelPopup {
  constructor(trueAnswersCount) {
    this.popup = document.createElement('div');
    this.popup.classList.add('popup', 'level-finish-popup');

    const description = document.createElement('div');
    description.innerHTML = `<h2>Level passed</h2>
  <h2>Your result:</h2>
  <h2>${trueAnswersCount}/10</h2>`;

    this.backBtn = getBackButtonHTML(
      'fa-thin',
      'back-levels',
      'popup-back-levels'
    );

    this.popup.append(description, this.backBtn);
  }
}

export default FinishLevelPopup;
