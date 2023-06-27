const searchBar = document.querySelector('.searchbar-container ');
const profilecontainer = document.querySelector('.profile-container');
const loading = document.querySelector('.loading');
const notFound = document.querySelector('.not-found');

const get = (param) => document.getElementById(`${param}`)
const searchInput = get("input");

const modeText = get("mode-text");
const btnMode = get('btn-mode');
const modeIcon = get('mode-icon');
const root = document.documentElement.style;
const input = get('input');
const btnSubmit = get('submit');

const url = "https://api.github.com/users/";

const avatar = get("avatar");
const userName = get("name");
const user = get("user");
const date = get("date");
// array of string
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const bio = get("bio");
const repos = get("repos");
const followers = get("followers");
const following = get("following");
const user_location = get("location");
const page = get("page");
const twitter = get("twitter");
const company = get("company");


let darkMode = false;
init();

// dark mode light mode Event Listner 
btnMode.addEventListener('click', () => {
    if(darkMode == false) {
        darkModeProperties();
    }
    else {
        lightModeProperties();
    }
});

function darkModeProperties() {
    modeText.innerText = 'LIGHT';
    modeIcon.src = "./assets/images/sun-icon.svg";
    root.setProperty("--lm-bg", "#141D2F");
    root.setProperty("--lm-bg-content", "#1E2A47");
    root.setProperty("--lm-text", "white");
    root.setProperty("--lm-text-alt", "white");
    root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
    root.setProperty("--lm-icon-bg", "brightness(1000%)");

    darkMode = true;
    localStorage.setItem('dark-mode', true);
}

function lightModeProperties() {
    modeText.innerText = "DARK";
    modeIcon.src = "./assets/images/moon-icon.svg";
    root.setProperty("--lm-bg", "#F6F8FF");
    root.setProperty("--lm-bg-content", "#FEFEFE");
    root.setProperty("--lm-text", "#4B6A9B");
    root.setProperty("--lm-text-alt", "#2B3442");
    root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
    root.setProperty("--lm-icon-bg", "brightness(100%)");

    darkMode = false;
    localStorage.setItem("dark-mode", false);
}

function init() {
    darkMode = false;

    const value = localStorage.getItem("dark-mode");

    if(value == "null") {
        localStorage.setItem("dark-mode", darkMode);
        lightModeProperties();
    }
    else if(value == "false") {
        lightModeProperties();
    }
    else if(value == "true") {
        darkModeProperties();
    }
}

// Events and Api
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    let userName = input.value;
    if(userName != "") {
        getUserData(url+userName);
    }
})

input.addEventListener('keypress', (e) => {
    if(e.key == "Enter" && input.value != "") {
        e.preventDefault();
        getUserData(url+input.value);
    }
} )


// function getUserData(userName) {
//     try {
//         const response = fetch(url+userName);
//         const data =  response.json();
//         console.log(data);
//         console.log(typeof(data))
        
//     }
//     catch(error) {
//         console.log(error);
//     }
// }

async function getUserData(gitUrl) {
    notFound.classList.remove('active');
    profilecontainer.classList.remove('active');
    loading.classList.add('active');
    await fetch(gitUrl)
    .then((response) => response.json())
    .then((data) => {
    updateProfile(data);
    })
    .catch((error) => {
        throw error;
    });
}

function updateProfile(data) {
    if(data.message !== "Not Found") {
        function checkNull(param1, param2) {
            if(param1 == "" || param1 == null) {
                param2.style.opacity = 0.5;
                param2.previousElementSibling.style.opacity = 0.5;
                return false;
            }
            else {
                return true;
            }
        }
    
        avatar.src = `${data.avatar_url}`;
        userName.innerText = data.name === null ? data.login : data.name;
        user.innerText = `@${data.login}`;
        user.href = `${data.html_url}`;
        datesegments = data.created_at.split("T").shift().split("-");
        date.innerText = `Joined ${datesegments[2]} ${months[datesegments[1] - 1]} ${datesegments[0]}`;
        bio.innerText = data.bio == null ? "This profile has no bio" : `${data.bio}`;
        repos.innerText = `${data.public_repos}`;
        followers.innerText = `${data.followers}`;
        following.innerText = `${data.following}`;
        user_location.innerText = checkNull(data.location, user_location) ? data.location : "Not Available";
        page.innerText = checkNull(data.blog, page) ? data.blog : "Not Available";
        page.href = checkNull(data.blog, page) ? data.blog : "#";
        twitter.innerText = checkNull(data.twitter_username, twitter) ? data.twitter_username : "Not Available";
        twitter.href = checkNull(data.twitter_username, twitter) ? `https://twitter.com/${data.twitter_username}` : "%";
        company.innerText = checkNull(data.company, company) ? data.company : "Not Available";

        profilecontainer.classList.add('active');
    }
    else {
        notFound.classList.add('active');
    }
    loading.classList.remove('active');
}
