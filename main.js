// Getting Data From Local Storage
let users = [];

localStorage.getItem("users")? users = JSON.parse(localStorage.getItem("users")): users = [];

// Setting Active Username
let activeUsername = "";
users.forEach(user => {
    if (user.isActive) {
        activeUsername = user.name;
    }
});
let activeUser;

// Redirect
if (location.pathname == "/writing-speed/index.html" || location.pathname == "/writing-speed/" ) {
    if (activeUsername == "") {
        location.pathname = "/writing-speed/1.%20login/";
    } else {
        location.pathname = "/writing-speed/2.%20home/";
    }
}

// Showing Active User
let currentUsernameContainer = document.querySelector(".current-username");
currentUsernameContainer.textContent = activeUsername;

// Adding Main Data
let gameName = "<span>w</span>riting <span>s</span>peed"
let description = gameName +  " game is designed to calculate your writing speed, create a user if you don't have one and then start playing.<br>concept is easy, when the counter starts click the key shown on the screen and then it will change. keep clicking on letters until you finish so as to get your writing speed level.<br> keep playing and make your speed average smaller!!";
let copyright = "&copy copyright 2024/" + new Date().getFullYear() + " | <strong>" + gameName + "</strong> | designed by <strong>ilyass zah</strong>"

document.querySelector(".headline").innerHTML = gameName;
document.querySelector(".description").innerHTML = description;
document.querySelector(".copyright").innerHTML = copyright;
document.body.classList.add('flex-item', "flex-col", "flex-space");
document.querySelector("footer").classList.add("flex-item", "flex-col");

// Set Game Not Running If Not In Game Page
if (location.pathname != "/writing-speed/4.%20game/") {
    localStorage.gameIsRunning = false;
}
let gameIsRunning = JSON.parse(localStorage.gameIsRunning);

// Game Settings
let lettersLeftContainer = document.querySelector(".letters-left span");
let maxLetters = 2;

// Toggling Mood (light/dark)
let toggleModeButton = document.querySelector(".toggle-mode-btn");
let currentMode = localStorage.mode;

toggleModeButton.addEventListener("click", toggleMode);
function toggleMode() {
    if (currentMode === "dark") {
        currentMode = "light";
        toggleModeTo("light");
    } else {
        currentMode = "dark";
        toggleModeTo("dark");
    }
    localStorage.mode = currentMode;
}

function toggleModeTo(mode){
    switch (mode) {
        case "light":
            document.body.classList.add("light");
            toggleModeButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
            break;
        case "dark":
            document.body.classList.remove("light");
            toggleModeButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
            break;
    }
}
toggleModeTo(currentMode);

// Popup Message
let messageBox = document.querySelector(".popup");
let popupBg = document.querySelector(".popup-bg");

function popupMessage(e) {

    messageBox.classList.remove("hide");
    popupBg.classList.remove("hide");

    let popupHeading = document.createElement("h2");
    popupHeading.classList.add("title");
    popupHeading.textContent = "alert";
    
    let popupMessage = document.createElement("p"); 
    popupMessage.classList.add("content");

    let alertButtons = document.createElement("div"); 
    alertButtons.classList.add("alert-buttons", "flex-item", "flex-space");
    
        let cancelButton = document.createElement("button");
        cancelButton.classList.add("cancel", "primary-btn");
        cancelButton.addEventListener("click", popupHide);
        cancelButton.textContent = "cancel";

        let executeButton = document.createElement("button");
        executeButton.classList.add("execute", "primary-btn");
        if (e.target.textContent == "❌") {
            popupMessage.innerHTML = `all data related to this user will be deleted!!<br>are you sure that you want to delete <strong>${e.target.parentElement.parentElement.children[0].textContent}</strong>?`;
            executeButton.addEventListener("click", deleteUser);
            executeButton.textContent = "delete";
        } else if (e.target.classList.contains("logout") || e.target.parentElement.classList.contains("logout") || e.target.parentElement.parentElement.classList.contains("logout")) {
            pauseMenu.classList.add("hide");
            popupMessage.innerHTML = `are you sure that you want to quit game?`;
            executeButton.addEventListener("click", () => {
                quitGame(e.target.textContent);
            });
            cancelButton.addEventListener("click", () => {
                popupHide();
                resumeGame();
            });
            executeButton.textContent = "quit";
        } else if (e.submitter.value == "edit") {
            popupMessage.innerHTML = `are you sure that you want to edit <strong>${userToEdit}</strong>?`;
            executeButton.addEventListener("click", editUser);
            executeButton.textContent = "edit";
        }
    
    alertButtons.appendChild(cancelButton);
    alertButtons.appendChild(executeButton);

    messageBox.appendChild(popupHeading);
    messageBox.appendChild(popupMessage);
    messageBox.appendChild(alertButtons);
}

// Deleting User From Local Storage And Refresh Page
function deleteUser(e) {
    if (activeUsername == document.querySelector(".popup .content strong")) {
        activeUsername = "";
    }
    let newUsers = users.filter(user => {
        let userToDelete = document.querySelector(".popup .content strong");
        return userToDelete.textContent != user.name? true: false;
    });
    localStorage.setItem("users", JSON.stringify(newUsers));
    location.reload();
};

// Editing User
function editUser() {
    users.forEach((user, index, arr) => {
        if (user.name === userToEdit) {
            arr[index].name = usernameInput.value;
        }
    });
    localStorage.users = JSON.stringify(users);
    localStorage.isEditing = null;
    location.pathname = "/writing-speed/1.login/";
}

// Hiding Popup Box
function popupHide() {
    messageBox.classList.add("hide");
    popupBg.classList.add("hide");
    messageBox.innerHTML = "";
}

// Logout (Redirect To Login Page + Deactivate Active User)
let logoutButtons = document.querySelectorAll(".logout");
logoutButtons.forEach(logoutButton => {
    logoutButton.addEventListener("click", logout);
});

function logout(e) {
    if (gameIsRunning) {
        pauseGame(false);
        popupMessage(e);
    } else {
        disconnectUser();
    }
}

// Logout Function
function disconnectUser() {
    users.forEach((user, index, arr) => {
        if (user.name === activeUsername) {
            arr[index].isActive = false;
        }
    });
    localStorage.users = JSON.stringify(users);
    location.pathname = "/writing-speed/1.%20login/";
}

// Formatting Time (ms => min:sec:ms)
function formatTime(milliSeconds) {
    let minutes = Math.floor(milliSeconds / 60000);
    let seconds = Math.floor((milliSeconds % 60000) / 1000);
    let milliSecondsLeft = milliSeconds % 1000;

    let formattedTime =  ((minutes < 10? "0" + minutes: minutes) + ":" + (seconds < 10? "0" + seconds: seconds) + ":" + (milliSecondsLeft < 100? "0" + (milliSecondsLeft < 10? "0" + milliSecondsLeft: milliSecondsLeft): milliSecondsLeft)).slice(0, 8);
    return formattedTime;
}
