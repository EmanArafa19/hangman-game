var gameWords = {
    animals: [
        "ELEPHANT", "GIRAFFE", "KANGAROO", "DOLPHIN", "PENGUIN",
        "BUTTERFLY", "ALLIGATOR", "CROCODILE", "HIPPOPOTAMUS", "RHINOCEROS",
        "CHEETAH", "LEOPARD", "KANGAROO", "PLATYPUS", "ARMADILLO",
        "CHAMELEON", "SCORPION", "TARANTULA", "HEDGEHOG", "PORCUPINE",
        "FLAMINGO", "PEACOCK", "OSTRICH", "EAGLE", "HUMMINGBIRD",
        "DOLPHIN", "WHALE", "SHARK", "OCTOPUS", "SEAHORSE",
        "GORILLA", "CHIMPANZEE", "ORANGUTAN", "PANDA", "KOALA"
    ],

    countries: [
        "EGYPT", "BRAZIL", "CANADA", "JAPAN", "AUSTRALIA",
        "GERMANY", "FRANCE", "ITALY", "SPAIN", "ENGLAND",
        "ARGENTINA", "CHILE", "COLOMBIA", "MEXICO", "PERU",
        "CHINA", "INDIA", "RUSSIA", "TURKEY", "GREECE",
        "NORWAY", "SWEDEN", "FINLAND", "DENMARK", "ICELAND",
        "KENYA", "NIGERIA", "SOUTHAFRICA", "MOROCCO", "ETHIOPIA"
    ],

    sports: [
        "FOOTBALL", "BASKETBALL", "SWIMMING", "TENNIS", "VOLLEYBALL",
        "BASEBALL", "HOCKEY", "CRICKET", "RUGBY", "BOXING",
        "JUDO", "KARATE", "WRESTLING", "FENCING", "ARCHERY",
        "GYMNASTICS", "DIVING", "SURFING", "SKIING", "SNOWBOARDING",
        "CYCLING", "RUNNING", "JUMPING", "THROWING", "WEIGHTLIFTING",
        "BADMINTON", "TABLE TENNIS", "GOLF", "BOWLING", "DARTS"
    ],

    professions: [
        "TEACHER", "DOCTOR", "ENGINEER", "ARTIST", "CHEF",
        "SCIENTIST", "LAWYER", "JUDGE", "POLICE", "FIREFIGHTER",
        "SOLDIER", "SAILOR", "PILOT", "ASTRONAUT", "PROGRAMMER",
        "DESIGNER", "ARCHITECT", "BUILDER", "CARPENTER",
        "ELECTRICIAN", "PLUMBER", "MECHANIC", "DRIVER", "FARMER",
        "NURSE", "DENTIST", "PHARMACIST", "VETERINARIAN", "PSYCHOLOGIST",
        "ACCOUNTANT", "BANKER", "MANAGER", "DIRECTOR", "PRESIDENT"
    ],
};

var currentCategory = "animals";
var secretWord = "";
var correctLetters = [];
var wrongLetters = [];
var maxMistakes = 6;
var gameOver = false;

var wordElement = document.getElementById("word-display");
var wrongElement = document.getElementById("wrong-letters");
var categoryElement = document.getElementById("category");
var heartsElement = document.getElementById("lives");
var keyboardElement = document.getElementById("keyboard");
var messageBox = document.getElementById("message");
var messageText = document.getElementById("message-text");
var playAgainButton = document.getElementById("message-play-again");

var bodyParts = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];

function startGame() {
    var savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        currentCategory = savedCategory;
    }

    categoryElement.textContent = currentCategory.toUpperCase();

    var wordList = gameWords[currentCategory];
    var randomIndex = Math.floor(Math.random() * wordList.length);
    secretWord = wordList[randomIndex];

    correctLetters = [];
    wrongLetters = [];
    gameOver = false;

    hideMessage();

    for (var i = 0; i < bodyParts.length; i++) {
        var part = document.getElementById(bodyParts[i]);
        if (part) {
            part.style.display = "none";
        }
    }

    var allButtons = document.getElementsByClassName("alp");
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].disabled = false;
        allButtons[i].className = "alp";
    }

    updateWord();
    updateWrong();
    updateHearts();

    if (keyboardElement.children.length === 0) {
        makeKeyboard();
    }
}

function makeKeyboard() {
    keyboardElement.innerHTML = "";
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < letters.length; i++) {
        var button = document.createElement("button");
        button.className = "alp";
        button.textContent = letters[i];

        button.onclick = function() {
            checkLetter(this.textContent);
        };
        keyboardElement.appendChild(button);
    }
}

function checkLetter(letter) {
    if (gameOver) {
        return;
    }

    if (isInArray(correctLetters, letter) || isInArray(wrongLetters, letter)) {
        return;
    }

    if (secretWord.indexOf(letter) !== -1) {
        correctLetters.push(letter);
        updateButton(letter, "correct");
    } else {
        wrongLetters.push(letter);
        updateButton(letter, "wrong");
        showBodyPart();
    }

    updateWord();
    updateWrong();
    updateHearts();
    checkResult();
}

function updateButton(letter, status) {
    var allButtons = document.getElementsByClassName("alp");

    for (var i = 0; i < allButtons.length; i++) {
        if (allButtons[i].textContent === letter) {
            if (status === "correct") {
                allButtons[i].className = "alp correct";
            } else {
                allButtons[i].className = "alp wrong";
            }
            allButtons[i].disabled = true;
            break;
        }
    }
}

function isInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === item) {
            return true;
        }
    }
    return false;
}

function updateWord() {
    var display = "";

    for (var i = 0; i < secretWord.length; i++) {
        var letter = secretWord.charAt(i);

        if (isInArray(correctLetters, letter)) {
            display += letter + " ";
        } else {
            display += "_ ";
        }
    }

    wordElement.textContent = display.trim();
}

function updateWrong() {
    wrongElement.textContent = wrongLetters.join(", ");
}

function updateHearts() {
    var remaining = maxMistakes - wrongLetters.length;
    var hearts = "";

    for (var i = 0; i < maxMistakes; i++) {
        if (i < remaining) {
            hearts += "❤️";
        } else {
            hearts += "💔";
        }
    }

    heartsElement.textContent = hearts;
}

function showBodyPart() {
    var mistakes = wrongLetters.length;

    if (mistakes > 0 && mistakes <= bodyParts.length) {
        var partId = bodyParts[mistakes - 1];
        var partElement = document.getElementById(partId);

        if (partElement) {
            partElement.style.display = "block";
        }
    }
}

function checkResult() {
    var win = true;

    for (var i = 0; i < secretWord.length; i++) {
        var letter = secretWord.charAt(i);

        if (!isInArray(correctLetters, letter)) {
            win = false;
            break;
        }
    }

    if (win) {
        gameOver = true;
        showMessage("🎉 Congratulations! You won 🎉", "win");
        return;
    }

    if (wrongLetters.length >= maxMistakes) {
        gameOver = true;
        showMessage("Game Over!😫 The word was: " + secretWord, "lose");
        return;
    }
}

function showMessage(text, type) {
    if (messageText) {
        messageText.textContent = text;
    } else {
        messageBox.textContent = text;
    }

    messageBox.className = "message " + type;
    messageBox.style.display = "block";

    if (playAgainButton) {
        playAgainButton.style.display = "block";

        if (type === "win") {
            playAgainButton.textContent = "Play Again";
        } else {
            playAgainButton.textContent = "Try Again";
        }
    }

    disableKeyboard();
}


function hideMessage() {
    messageBox.style.display = "none";
    if (playAgainButton) {
        playAgainButton.style.display = "none";
    }
}

function disableKeyboard() {
    var allButtons = document.getElementsByClassName("alp");

    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].disabled = true;
    }
}

function restartGame() {
    startGame();
}

function setupCategoryPage() {
    var playButton = document.querySelector('.play-btn');
    if (playButton) {
        playButton.disabled = true;
    }

    var categoryDivs = document.querySelectorAll(".hangman11");
    var categoryNames = ["animals", "countries", "sports", "professions"];

    for (var i = 0; i < categoryDivs.length; i++) {
        (function(index) {
            categoryDivs[index].onclick = function() {
                selectCategory(index, categoryNames[index], this);
            };
        })(i);
    }

    if (playButton) {
        playButton.onclick = function(event) {
            var savedCategory = localStorage.getItem("selectedCategory");

            if (!savedCategory) {
                event.preventDefault();
            } else {
                window.location.href = "play.html";
            }
        };
    }
}

function selectCategory(index, categoryName, element) {
    localStorage.setItem("selectedCategory", categoryName);

    var playButton = document.querySelector('.play-btn');
    if (playButton) {
        playButton.disabled = false;
    }

    var allCategories = document.querySelectorAll(".hangman11");

    for (var i = 0; i < allCategories.length; i++) {
        allCategories[i].className = "hangman11";
    }

    element.className = "hangman11 selected";

    var categoryTitle = element.querySelector('h2');
    if (categoryTitle) {
        showSimpleMessage(" Selected: " + categoryTitle.textContent);
    }
}

function showSimpleMessage(text) {
    var messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        position: absolute;
        top: 220px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #061545db;
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 22px;
        font-weight: bold;
        z-index: 100;
    `;

    var container = document.querySelector('.hangman0');
    if (container) {
        container.appendChild(messageDiv);
    }

    setTimeout(function() {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 800);
}

window.onload = function() {
    var currentPage = window.location.pathname;

    if (currentPage.indexOf("play.html") !== -1) {
        startGame();

        if (playAgainButton) {
            playAgainButton.onclick = function() {
                restartGame();
            };
        }
    }

    if (currentPage.indexOf("hangman.html") !== -1) {
        setupCategoryPage();
    }
};