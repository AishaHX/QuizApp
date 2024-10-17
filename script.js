// HTML Elements
const container = document.querySelector('.container') // Intro  container
const quizSection = document.querySelector('.quiz')
const resultSection = document.querySelector('.result')
const quizCategoryElement = document.querySelector('.quiz__category')
const questionContainer = document.getElementById('question__container')
const nextButton = document.querySelector('.next__button') // Next button
const correctAnswersElement = document.getElementById('correct-answers') // Correct answers display
const totalQuestionsElement = document.getElementById('total-questions') // Total questions display
const timeTakenElement = document.getElementById('time-taken') // Time taken display

// Quiz State
let questions = []
let currentQuestionIndex = 0
let correctAnswers = 0
let selectedCategory = ''
let startTime
let totalTime = 0
let timerInterval

// API URLs
const apiUrls = {
  Film: 'https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple',
  Celebrities:
    'https://opentdb.com/api.php?amount=10&category=26&difficulty=easy&type=multiple'
}

// Add event listener for the next button

// Handle start button click
const startButtons = document.querySelectorAll('.start__btn')
startButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedCategory = button.getAttribute('data-category')
    startQuiz(selectedCategory)
  })
})

// Start the quiz
function startQuiz (category) {
  // Hide intro and show quiz section
  container.classList.add('hidden')
  quizSection.classList.remove('hidden') // Show the quiz section
  resultSection.classList.add('hidden') // Hide the result section (in case it was shown earlier)

  // Set category title
  quizCategoryElement.textContent = category

  // Set the start time for the quiz
  startTime = new Date()

  // Fetch questions
  fetchQuestions(category)
}

// Fetch questions from API based on category

function fetchQuestions (category) {
  console.log('Fetching questions for category:', category) // Lägg till denna rad
  console.log('Using URL:', apiUrls[category]) // Lägg till denna rad
  fetch(apiUrls[category])
    .then(response => response.json())
    .then(data => {
      questions = data.results
      console.log('Questions fetched:', questions) // Lägg till denna rad
      displayQuestion()
    })
    .catch(error => {
      console.error('Error fetching questions:', error)
    })
}

function displayQuestion () {
  startTimer() // Start the timer for each question

  // Check if there are more questions to display
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex]
    questionContainer.innerHTML = `
      <h3>${currentQuestionIndex + 1}. ${question.question}</h3>
      <ul>
        ${[...question.incorrect_answers, question.correct_answer]
          .sort(() => Math.random() - 0.5)
          .map(answer => `<li class="answer">${answer}</li>`)
          .join('')}
      </ul>
    `

    // Attach click listeners to answers
    document.querySelectorAll('.answer').forEach(answerElement => {
      answerElement.addEventListener('click', e => {
        handleAnswerClick(e, question.correct_answer)
      })
    })

    // Show the "Next" button
    //nextButton.classList.remove('hidden')
  } else {
    // When no more questions, show results and hide quiz
    showResults()
  }
}

// Handle answer click

function handleAnswerClick (event, correctAnswer) {
  const userAnswer = event.target.textContent
  const answerElements = document.querySelectorAll('.answer')

  // Markera alla svar som felaktiga till en början
  answerElements.forEach(answerElement => {
    if (answerElement.textContent === correctAnswer) {
      event.target.style.backgroundColor = 'green'
    } else {
      event.target.style.backgroundColor = 'red'
    }
  })

  // Kontrollera om svaret är korrekt
  if (userAnswer === correctAnswer) {
    correctAnswers++
  }

  // Flytta till nästa fråga efter en kort fördröjning
  setTimeout(() => {
    currentQuestionIndex++

    // Om det finns fler frågor, visa nästa fråga
    if (currentQuestionIndex < questions.length) {
      displayQuestion()
    } else {
      // Om inga fler frågor finns, visa resultat
      showResults()
    }
  }, 1000) //1 sekund i
}

/*

function showResults () {
  console.log('Showing results') // Debugging log
  clearInterval(timerInterval)

  // Calculate total time taken
  const endTime = new Date()
  totalTime = Math.floor((endTime - startTime) / 1000)

  // Hide the quiz section and show the result section

  quizSection.classList.add('hidden')
  resultSection.classList.remove('hidden')

  // Display correct answers, total questions, and time taken
  correctAnswersElement.textContent = correctAnswers
  totalQuestionsElement.textContent = questions.length
  timeTakenElement.textContent = `${totalTime} seconds`
}
*/
// Timer logic for each question

function startTimer () {
  const timerElement = document.getElementById('time-left')
  let timeLeft = 20

  clearInterval(timerInterval) // Clear any existing timer
  timerInterval = setInterval(() => {
    timeLeft--
    timerElement.textContent = timeLeft

    // If time runs out, move to the next question
    if (timeLeft === 0) {
      clearInterval(timerInterval)
      currentQuestionIndex++

      // If there are more questions, display the next question
      if (currentQuestionIndex < questions.length) {
        displayQuestion()
      } else {
        // If quiz is over, show results
        showResults()
      }
    }
  }, 1000)
}

function showResults () {
  console.log('Showing results')
  clearInterval(timerInterval)

  // Calculate total time taken
  const endTime = new Date()
  totalTime = Math.floor((endTime - startTime) / 1000)

  // Hide the quiz section and show the result section
  quizSection.classList.add('hidden')
  resultSection.classList.remove('hidden')

  // Display correct answers, total questions, and time taken
  correctAnswersElement.textContent = correctAnswers
  totalQuestionsElement.textContent = questions.length
  timeTakenElement.textContent = `${totalTime} seconds`
}
