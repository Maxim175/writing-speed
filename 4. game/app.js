let display = document.querySelector("section .display");
let endMenu = document.querySelectorAll(".menu")[0];
lettersLeftContainer.textContent = maxLetters;

//  Check If Game Is Running And If Is Connected
if (activeUsername != "") {
    if (!gameIsRunning) {
        location.pathname = "/writing-speed/3.%20home/";
    }
} else {
    location.pathname = "/writing-speed/1.%20login/";
}

// Game Settings
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n" ,"o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

// Helpers
let gamePaused = true;
let currentLetter = "";
let currentLetterOrder = 0;
let countDownIntervalID, countingIntervaleID;

// Game Counter Settings
let startingDate = 0, elapsedTime = 0, currentDate = 0; pausingDate = 0;

// Start Game When Page Is Loaded
function startGame() {
    countDown();
    setTimeout(() => {
        gamePaused = false;
        startCounter();
        generateLetter();
    }, 3000);
}
startGame();

// Pause Game
function pauseGame(showPauseMenu = true) {
    pausingDate = new Date();
    pauseCounter();
    if (showPauseMenu) {
        popupBg.classList.remove("hide");
        pauseMenu.classList.remove("hide");
    }

};

// resume Game
function resumeGame() {
    popupBg.classList.add("hide");
    pauseMenu.classList.add("hide");
    countDown();
    
    setTimeout(() => {
        gamePaused = false;
        resumeCounter();
    }, 3000);
}

// Count From 3 To 1 Before Starting Or Resuming Game
function countDown() {
    messageBox.classList.remove("hide");
    popupBg.classList.remove("hide");
        let numberContainer = document.createElement("span");
        numberContainer.classList.add("count-down-number");
        numberContainer.textContent = 3;

    messageBox.appendChild(numberContainer);
    let count = 2;
    countDownIntervalID = setInterval(() => {
        numberContainer.textContent = count--;
        count == 0? clearInterval(): null;
        if (count == -1) {
            clearInterval(countDownIntervalID);
            popupHide();
        }
    }, 1000);
}

let counter = document.querySelector(".counter");
// Game Counter Start
function startCounter() {
    startingDate = new Date();
    countingIntervaleID = setInterval(updateCounter, 10);
}

// Resume Counter
function resumeCounter() {
    let resumingDate = new Date();
    startingDate = +startingDate + (resumingDate - pausingDate);
    countingIntervaleID = setInterval(updateCounter, 10);
}

// Pause Counter
function pauseCounter() {
    clearInterval(countingIntervaleID);
}

// Updating Time Of Counter
function updateCounter() {
    currentDate = new Date();
    elapsedTime = currentDate - startingDate;
    counter.textContent = formatTime(elapsedTime);
}

// Game Logic
addEventListener("keydown", (e) => {
    if (!gamePaused && gameIsRunning) {
        if (e.key.toLocaleLowerCase() === currentLetter) {
            generateLetter();
            lettersLeftContainer.textContent--;
        } else {
            display.classList.add("wrong");
            setTimeout(() => {
                display.classList.remove("wrong");
            }, 300);
        }
    }
})

// Generating Letter And Show It
function generateLetter() {
    if (currentLetterOrder != maxLetters) {
        currentLetter = letters[Math.floor(Math.random() * 26)];
        display.textContent = currentLetter;
        currentLetterOrder++;
    } else {
        endGame();
    }
}

// End The Game (Stop Counter + Show Results + Update Data)
let recordContainer = document.querySelector(".record");
let timeContainer = document.querySelector("#time");
let speedContainer = document.querySelector("#speed");

function endGame() {
    pauseCounter();
    localStorage.gameIsRunning = false;
    popupBg.classList.remove("hide");
    endMenu.classList.remove("hide");
    timeContainer.textContent = formatTime(elapsedTime);
    let newSpeed = parseFloat((maxLetters / (elapsedTime / 1000)).toFixed(2));
    speedContainer.textContent = newSpeed;

    users.forEach(user => {
        if (user.name === activeUsername) {
            if (user.bestScore > elapsedTime || user.bestScore === 0) {
                recordContainer.children[0].textContent = "new record";
                recordContainer.children[1].textContent = formatTime(elapsedTime);
                user.bestScore = elapsedTime;
                user.bestSpeedScore = newSpeed;
            } else {
                recordContainer.children[0].textContent = "record";
                recordContainer.children[1].textContent = formatTime(user.bestScore);
            }
        }
        user.games.push({seconds: elapsedTime, date: new Date()});

        let newAverage = user.games.reduce((prevNumber, currentGame) => prevNumber + currentGame.seconds, 0) / user.games.length;
        let newAverageSpeed = parseFloat((maxLetters / (newAverage / 1000)).toFixed(2));
        let newLevel = "";
        if (newAverageSpeed > 4) {
            newLevel = "expert";
        } else if (newAverageSpeed > 1.5) {
            newLevel = "normal";
        } else {
            newLevel = "beginner";
        }
        
        // Updating Data
        user.average = parseFloat(newAverage.toFixed(2));
        user.averageSpeed = newAverageSpeed;
        user.level = newLevel
    });

    localStorage.users = JSON.stringify(users);
}

// Replay Game
let replayButton = document.querySelector(".replay");

replayButton.addEventListener("click", () => {
    localStorage.gameIsRunning = true;
    location.reload();
});

// Pause The Game When Pause Button Is Clicked
let pauseMenu = document.querySelectorAll(".menu")[1];
let pauseButton = document.querySelector(".pause");
pauseButton.addEventListener("click", pauseGame);

// resume The Game When resume Button Is Clicked
let resumeButton = document.querySelector(".resume");
resumeButton.addEventListener("click",resumeGame);

// Quit Game To Home Or To Login Page
function quitGame(targetTextContent) {
    localStorage.gameIsRunning = false;
    if (targetTextContent == "quit") {
        location.pathname = "/writing-speed/3.%20home/";
    } else {
        disconnectUser();
    }
};
