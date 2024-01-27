// Showing Users

let usersList = document.querySelector(".users-list");
let noUserAlert = document.querySelector(".no-user-alert");

function showUsers() {
    if (users != null && users.length != 0) {
        noUserAlert.classList.add("hide");
        users.forEach(user => {
            let userBox = document.createElement("div");
            userBox.classList.add("user", "flex-item");
            
                let usernameBox = document.createElement("div");
                usernameBox.classList.add("username", "flex-item");
                usernameBox.textContent = user.name;
                usernameBox.addEventListener("click", toggleActiveClass);
        
                let buttonsBox = document.createElement("div");
                buttonsBox.classList.add("buttons", "flex-item");
        
                    let editButton = document.createElement("button");
                    editButton.classList.add("edit", "primary-btn");
                    editButton.addEventListener("click", (e) => {
                        localStorage.isEditing = e.target.parentElement.parentElement.children[0].textContent;
                        location.pathname = "/writing-speed/2.%20datadealer/";
                    });
                    editButton.textContent = "🖊️";
        
                    let deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete", "primary-btn");
                    deleteButton.addEventListener("click", popupMessage);
                    deleteButton.textContent = "❌";
        
                buttonsBox.appendChild(editButton);
                buttonsBox.appendChild(deleteButton);
        
            userBox.appendChild(usernameBox);
            userBox.appendChild(buttonsBox);
        
            usersList.appendChild(userBox);
        });
    } else {
        usersList.classList.add("hide");
    }
};
showUsers();


// Toggling Active Class
let usernameBoxes = document.querySelectorAll(".username");
function toggleActiveClass(e) {
    usernameBoxes.forEach(usernameField => {
        usernameField === e.target? usernameField.classList.toggle("active"): usernameField.classList.remove("active");
    });
    setActiveUsername();
}

// Setting The Active Class To Be Selected After
function setActiveUsername() {
    activeUsername = "";
    usernameBoxes.forEach(usernameField => {
        if (usernameField.classList.contains("active")) {
            activeUsername = usernameField.textContent;
            return true;
        }
    });
    return false;
}

// Redirect User To Home Page And Activate Account
let select = document.querySelector(".select");
select.addEventListener("click", () => {
    if (activeUsername != "") {
        users.forEach((user, index, arr) =>{
            if (user.name === activeUsername) {
                arr[index].isActive = true;
            }
        });
        console.log(users);
        localStorage.users = JSON.stringify(users);
        location.pathname = "/writing-speed/3.%20home/";
    }
});

// Redirect To Home If Connected
if (activeUsername != "") {
    location.pathname = "/writing-speed/3.%20home/";
}
