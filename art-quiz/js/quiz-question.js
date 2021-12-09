export default class {
  constructor(_quizType, levelNumber, gallery) {
    this.quizType = _quizType
    this.levelNumber = levelNumber
    this.questionNumber = 0
    this.gallery = gallery

    this.picObj = () => {
      const picNumber = _quizType * 120 + levelNumber * 10 + this.questionNumber
      return gallery[picNumber]
    }

    this.picElement = (picObj) => {
      this.picture = new Image()
      this.picture.src = `https://raw.githubusercontent.com/ilua-dz/art-quiz-gallery/main/full/${picObj.imageNum}full.avif`
      this.nextPicture = new Image()
      this.nextPicture.src = `https://raw.githubusercontent.com/ilua-dz/art-quiz-gallery/main/full/${
        +picObj.imageNum + 1
      }full.avif`

      const pic = document.createElement('img')
      pic.src = this.picture.src
      pic.alt = `${picObj.name}`
      return pic
    }
  }

  nextQuestion() {
    this.questionNumber += 1
  }

  getAnswers() {
    const newRandomPic = (slicedGallery) => {
      const picNumber = Math.floor(Math.random() * slicedGallery.length)
      return slicedGallery[picNumber]
    }

    let randomGallery = this.gallery.slice(
      this.quizType * 120,
      this.quizType * 120 + 120
    )
    randomGallery.splice(this.levelNumber * 10, 10)
    randomGallery = randomGallery.filter(
      (pic) => pic.author.toUpperCase() !== this.picObj().author.toUpperCase()
    )

    const falseAnswers = []
    for (let i = 0; i < 3; i += 1) {
      const randomPic = newRandomPic(randomGallery)
      const randomAuthor = randomPic.author
      falseAnswers.push(randomPic)
      randomGallery = randomGallery.filter(
        (pic) => pic.author.toUpperCase() !== randomAuthor.toUpperCase()
      )
    }

    falseAnswers.push(this.picObj())
    const answers = falseAnswers

    for (let i = answers.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[answers[i], answers[j]] = [answers[j], answers[i]]
    }

    const trueAnswerNumber = answers.indexOf(this.picObj())
    return { trueAnswerNumber, answers }
  }

  getQuestion() {
    const node = document.createElement('div')

    const answerSet = this.getAnswers()
    this.trueAnswerNumber = answerSet.trueAnswerNumber

    const title = document.createElement('h2')

    const timerEl = document.createElement('div')
    timerEl.classList.add('timer-block')

    const timeLeftEl = document.createElement('div')
    timeLeftEl.classList.add('time-left-block')

    timerEl.append(timeLeftEl)

    this.backBtn = document.createElement('i')
    this.backBtn.classList.add(
      'fa-thin',
      'fa-square-left',
      'decorate-button',
      'fa-sizing',
      '_btn',
      'back-levels'
    )
    node.append(this.backBtn)

    return {
      node,
      answerSet,
      title,
      timerEl,
    }
  }

  getArtistQuizQuestion() {
    const question = this.getQuestion()

    const pic = this.picElement(this.picObj())

    question.title.textContent = 'Who is the author of the picture?'

    const answersList = document.createElement('ul')
    answersList.append(question.timerEl)

    question.answerSet.answers.forEach((answer) => {
      const answerString = document.createElement('li')
      answerString.classList.add('artist-answer', '_btn', 'decorate-button')
      answerString.textContent = answer.author
      answersList.append(answerString)
    })

    question.node.append(pic, question.title, answersList)
    return question.node.innerHTML
  }

  getPictureQuizQuestion() {
    this.picQuizImagesSrc = [] // for preload images
    const question = this.getQuestion()

    question.title.textContent = `Choose a picture by ${this.picObj().author}`
    question.timerEl.classList.add('width-100')
    question.title.append(question.timerEl)

    question.answerSet.answers.forEach((picObj, answerNumber) => {
      const answerImg = this.picElement(picObj)
      answerImg.classList.add('pic-answer', 'pic-btn', '_btn')
      question.node.append(answerImg)
      if (answerNumber === 1) question.node.append(question.title)
      this.picQuizImagesSrc.push(answerImg.src) // for preload images
    })

    return question.node.innerHTML
  }

  getTrueAnswerPopup(trueness) {
    const popup = document.createElement('div')

    const answerIndicator = document.createElement('i')
    const answerClass = trueness
      ? ['fa-circle-check', 'trueBg']
      : ['fa-circle-xmark', 'falseBg']
    answerIndicator.classList.add(
      'fa-regular',
      'fa-sizing',
      'answer-indicator',
      ...answerClass
    )

    const pic = this.picElement(this.picObj())

    const description = document.createElement('div')
    description.innerHTML = `<h2>${this.picObj().name}</h2>
    <h2>${this.picObj().author}</h2>
    <h2>${this.picObj().year}</h2>`

    const nextPicBtn = document.createElement('i')
    nextPicBtn.classList.add(
      'fa-regular',
      'fa-square-right',
      'fa-sizing',
      '_btn',
      'decorate-button',
      'next-btn'
    )

    popup.append(answerIndicator, pic, description, nextPicBtn)

    return popup.innerHTML
  }
}
