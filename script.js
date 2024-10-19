window.onload = function() {
    const storedTheme = localStorage.getItem('theme');
    const checkbox = document.getElementById('checkbox');
    const quizSection = document.querySelector('.quizSection');
    
    // Theme persistence
    if (storedTheme === 'dark-mode') {
        document.body.classList.add('dark-mode');
        checkbox.checked = true;
    } else {
        document.body.classList.add('light-mode');
        checkbox.checked = false;
    }

    // Ensure quiz section is hidden initially
    quizSection.classList.remove('active');
};

// Event listeners for buttons
const starbtn = document.querySelector('.starbtn');
const popupinfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const bodyContent = document.querySelector('.home');
const mainContent = document.querySelector('.main'); 
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quizSection');
const quizbox = document.querySelector('.quizbox');

starbtn.onclick = () => {
    popupinfo.classList.add('active');
    mainContent.classList.add('blur'); 
};

exitBtn.onclick = () => {
    popupinfo.classList.remove('active');
    mainContent.classList.remove('blur'); 
};

continueBtn.onclick = () => {
    popupinfo.classList.remove('active');
    bodyContent.classList.add('hide');
    quizSection.classList.add('active');
    mainContent.classList.remove('blur');
    quizbox.classList.add('active');
    showQuestions(0);
};
// Handle theme change
function handleThemeChange() {
    const checkbox = document.getElementById('checkbox');
    if (checkbox.checked) {
        document.body.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        document.body.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
}
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = {}; // Object to track answered questions

// Function to load the current question
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];

        // Update the question number in the footer
        document.querySelector(".questiontotal").innerText = `${currentQuestion.numb} of ${questions.length} Questions`;

        // Update question and options in the UI
        document.querySelector(".questiontext").innerText = currentQuestion.question;
        const optionsContainer = document.querySelector(".optionlist");
        optionsContainer.innerHTML = ""; // Clear previous options

        currentQuestion.options.forEach(option => {
            const optionElement = document.createElement("div");
            optionElement.classList.add("option");
            optionElement.innerHTML = `<span>${option}</span>`;
            optionElement.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(optionElement);
        });
    } else {
        showResults();  
    }
}

// Function to check the selected answer
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];

    // Check if the question has already been answered
    if (!answeredQuestions[currentQuestionIndex]) {
        if (selectedOption === currentQuestion.answer) {
            score++;
        }

        // Mark the current question as answered
        answeredQuestions[currentQuestionIndex] = true;

        // Update the score in the header
        document.querySelector(".headerscore").innerText = `Score: ${score} / ${questions.length}`;
    }
}

// Function to handle the "Next" button click
document.querySelector(".nextbtn").addEventListener("click", () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Event listener for the "Start Quiz" button
document.querySelector(".starbtn").addEventListener("click", () => {
    document.querySelector(".home"); // Hide the home section
    document.querySelector(".quizSection"); // Show the quiz section
    loadQuestion(); // Load the first question
});

// Initial call to load the first question
loadQuestion();
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option'); // Get all options
    
    // Check if the question has already been answered
    if (!answeredQuestions[currentQuestionIndex]) {
        // Loop through options and highlight correct and incorrect
        options.forEach(option => {
            const optionText = option.querySelector('span').innerText;

            if (optionText === currentQuestion.answer) {
                // Mark the correct answer as green
                option.classList.add('correct');
            }

            if (optionText === selectedOption && optionText !== currentQuestion.answer) {
                // Mark the selected wrong answer as red
                option.classList.add('incorrect');
            }

            // Disable further clicks after selecting an answer
            option.style.pointerEvents = 'none';
        });

        // Update the score if the answer is correct
        if (selectedOption === currentQuestion.answer) {
            score++;
        }

        // Mark the question as answered
        answeredQuestions[currentQuestionIndex] = true;

        // Update score in the header
        document.querySelector(".headerscore").innerText = `Score: ${score} / ${questions.length}`;
    }
}

function showResults() {
    quizbox.style.display = 'none'; // Hide the quiz box
    const resultBox = document.querySelector(".resultbox");
    resultBox.style.display = 'block'; // Show result box
    resultBox.classList.add('active'); // Add active class to show it

    const scoreText = resultBox.querySelector(".scoretext");
    scoreText.innerText = `Your Score: ${score} out of ${questions.length}`;

    const progressvalue = document.querySelector(".progressvalue");
    const circularProgress = document.querySelector('.circularprogress');
    let progressStartValue = 0;
    let progressEndValue = Math.round((score / questions.length) * 100); // Calculate the percentage
    let speed = 20;

    // Animate the progress bar
    let progress = setInterval(() => {
        progressStartValue++;

        // Update the percentage text
        progressvalue.textContent = `${progressStartValue}%`;

        // Update the circular progress background
        circularProgress.style.background = `conic-gradient(
            #8B008B ${progressStartValue * 3.6}deg, 
            rgba(255, 255, 255, 0.1) 0deg
        )`;

        if (progressStartValue === progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    document.querySelector(".resultbox").style.display = 'none'; // Hide result box
    document.querySelector(".resultbox").classList.remove('active'); // Remove active class
    quizbox.style.display = 'block'; // Show quizbox
    loadQuestion(); // Load the first question again
}
// Event listener for "Try Again" button
document.querySelector('.tryagainbtn').addEventListener('click', () => {
    restartQuiz(); // Call the function to restart the quiz
});

// Event listener for "Go To Home" button
document.querySelector('.gohomebtn').addEventListener('click', () => {
    goToHome(); // Call the function to go back to the home screen
});

// Function to restart the quiz
function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    answeredQuestions = {}; // Reset answered questions
    document.querySelector(".resultbox").style.display = 'none'; // Hide result box
    document.querySelector(".quizbox").style.display = 'block'; // Show quiz box again
    loadQuestion(); // Load the first question again
}

// Function to go to home
function goToHome() {
    document.querySelector('.resultbox').style.display = 'none'; // Hide result box
    document.querySelector('.quizSection').classList.remove('active'); // Hide the quiz section
    document.querySelector('.home').classList.remove('hide'); // Show home section
}