// Dealing width Label Transition
let usernameInput = document.querySelector("#username");
let usernameLabel = document.querySelector("label");

usernameInput.addEventListener("focus", () => {
    usernameLabel.classList.add("active-label");
    usernameLabel.classList.remove("not-active-label");
});
usernameInput.addEventListener("blur", () => {
    if (usernameInput.value === "") {
        usernameLabel.classList.remove("active-label");
        usernameLabel.classList.add("not-active-label");
    }
});

// Creating New User Or Editing Existing One
let signupForm = document.querySelector(".main-form");
let formMessage = document.querySelector(".form-message");
signupForm.addEventListener("submit", handleData);
let userToEdit = null;
if (localStorage.isEditing != undefined) {
    if (localStorage.isEditing != "null") {
        userToEdit =localStorage.isEditing;
        document.title = "Writing Speed - Edit User"
        let headline = document.querySelector(".title");
        headline.textContent = "edit username";
        let submitButton = document.querySelector(".submit");
        submitButton.value = "edit";
    }
} else {
    localStorage.isEditing = null;
}
let existingUsernames = users.map(user => user.name);

function handleData(e) {
    e.preventDefault();
    if (usernameInput.value != "") {
        if (!existingUsernames.includes(usernameInput.value.toLowerCase())){
            if(!userToEdit) {
                createUser();
            } else {
                popupMessage(e);
            }
        } else {
            popMessage("this username exists already!");
        }
    } else {
        popMessage("please enter a username!");
    }
}

function createUser() {
    let newUser = {
        name: usernameInput.value.toLowerCase(),
        games: [],
        isActive: false,
        creationDate: new Date(),bestScore: 0,
        bestSpeedScore: 0,
        average: 0,
        averageSpeed: 0,
        level: "beginner",
    }
    users.push(newUser);
    localStorage.users = JSON.stringify(users);
    location.pathname = "/writing-speed/1.%20login/";
}

// Show Alert Message
function popMessage(message) {
    formMessage.classList.remove("hide");
    formMessage.classList.add("pop");
    setTimeout(() => {
        formMessage.classList.remove("pop");
        
    }, 500);
    formMessage.textContent = message;
}


// Redirect To Home If Connected
if (activeUsername != "") {
    location.pathname = "/writing-speed/3.%20home/";
}
