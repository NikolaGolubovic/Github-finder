const search = document.querySelector(".search-controller input");
const confirmSearch = document.querySelector(".search-controller button");

const themeField = document.querySelector(".theme-change");
const themeDesc = document.querySelector(".theme-change p");
const themeImg = document.querySelector(".theme-change img");

const errorMsg = document.querySelector(".error-msg");

const userOutsideAvatar = document.querySelector(
  ".user-basic-avatar.outside img"
);
const userInsideAvatar = document.querySelector(
  ".user-basic-avatar.inside img"
);
const userName = document.querySelector(".user-basic__name");
const userLogin = document.querySelector(".user-basic__login");
const userDateJoin = document.querySelector(".user-date-join span");
const userBio = document.querySelector(".user-bio p");
const reposNum = document.querySelector(
  ".user-stats__repo .user-stats__number p"
);
const followersNum = document.querySelector(
  ".user-stats__followers .user-stats__number p"
);
const followingNum = document.querySelector(
  ".user-stats__following .user-stats__number p"
);
const locationText = document.querySelector(
  ".social-tab-location .social-tab-text"
);
const websiteText = document.querySelector(
  ".social-tab-website .social-tab-text"
);
const twitterText = document.querySelector(
  ".social-tab-twitter .social-tab-text"
);
const companyText = document.querySelector(
  ".social-tab-company .social-tab-text"
);

function toggleTheme() {
  document.documentElement.setAttribute("data-theme", "dark");
}

function updateTextAndNode(
  node,
  data,
  setHref = false,
  text = "Not Available"
) {
  if (node.parentElement.classList.contains("empty")) {
    node.parentElement.classList.remove("empty");
  }
  if (data) {
    if (setHref) {
      if (data.startsWith("@")) {
        node.href = "https://github.com/" + data.slice(1);
      } else {
        node.href = data;
      }
    }
    node.textContent = data;
    return;
  } else {
    node.textContent = text;
    node.parentElement.classList.add("empty");
  }
}

function dateFormat(node, created_at) {
  var dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  node.textContent = new Date(created_at)
    .toLocaleDateString("en-US", dateOptions)
    .split("")
    .filter((char) => char !== ",")
    .join("");
}

function createTextFromFetch(data) {
  if (data.message == "Not Found") {
    search.placeholder = "";
    errorMsg.textContent = "No results";
    const timer = setTimeout(function () {
      errorMsg.textContent = "";
      search.placeholder = "Search Github username...";
      clearInterval(timer);
    }, 1500);
    return;
  }
  userOutsideAvatar.src = data.avatar_url;
  userInsideAvatar.src = data.avatar_url;
  userName.textContent = data.name || data.login;
  userLogin.textContent = "@" + data.login;
  reposNum.textContent = data.public_repos;
  followersNum.textContent = data.followers;
  followingNum.textContent = data.following;
  dateFormat(userDateJoin, data.created_at);
  updateTextAndNode(userBio, data.bio, false, "This profile has no bio");
  updateTextAndNode(locationText, data.location);
  updateTextAndNode(websiteText, data.blog, true);
  updateTextAndNode(twitterText, data.twitter_username, true);
  updateTextAndNode(companyText, data.company, true);
}

fetch(`https://api.github.com/users/octocat`)
  .then((res) => res.json())
  .then((data) => createTextFromFetch(data));

confirmSearch.addEventListener("click", function () {
  fetch(`https://api.github.com/users/${search.value}`)
    .then((res) => res.json())
    .then((data) => createTextFromFetch(data));
});

themeField.addEventListener("click", function () {
  if (document.documentElement.dataset.theme === "light") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeDesc.textContent = "Light";
    themeImg.src = "assets/icon-sun.svg";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeDesc.textContent = "Dark";
    themeImg.src = "assets/icon-moon.svg";
  }
});
