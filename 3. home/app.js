// Getting Player Data From Local Storage And ShowThem
let usernameField = document.querySelector(".username");
let gameCountField = document.querySelector("#game-count");
let averageField = document.querySelector("#average");
let averageSpeedField = document.querySelector("#average-speed");
let levelField = document.querySelector("#level");
let createdAtField = document.querySelector("#created-at");
let bestScoreField = document.querySelector(".best-time-score");
let bestSpeedScoreField = document.querySelector(".best-speed-score span");

function getPlayerData () {
    if (activeUsername == "") {
        location.pathname = "/writing-speed/1.%20login/";
    } else {
        users.forEach(user => {
            if (user.name === activeUsername) {
                activeUser = user;
                usernameField.textContent = user.name;
                gameCountField.textContent = user.games.length;
                averageField.textContent = formatTime(user.average);
                averageSpeedField.textContent = user.averageSpeed;
                levelField.textContent = user.level;
                createdAtField.textContent = user.creationDate.slice(0,10);
                bestScoreField.textContent = formatTime(user.bestScore);
                bestSpeedScoreField.textContent = user.bestSpeedScore;
            }
        });
    }
};
getPlayerData();

// Redirect To Game Page
let startButton = document.querySelector(".play");
startButton.addEventListener("click", () => {
    localStorage.gameIsRunning = true;
});
