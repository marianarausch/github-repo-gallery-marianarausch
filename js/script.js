// Global variable to select the div with a class of "overview" - main > section "intro" > div

const overview = document.querySelector(".overview");
const username = "marianarausch";
const repoList = document.querySelector(".repo-list");
const allReposContainer = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const viewReposButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

//Fetch API JSON Data
const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
  <figure>
  <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
  <p><strong>Name:</strong>${data.name}</p>
  <p><strong>Bio:</strong>${data.bio}</p>
  <p><strong>Location:</strong>${data.location}</p>
  <p><Number of public repos:</strong>${data.public_repos}</p>
  `;
  overview.append(div);
  fetchRepos();
};

// Fetch repos
const fetchRepos = async function () {
  const listFetch = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  const repoData = await listFetch.json();
  displayRepos(repoData);
};

const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

const getRepoInfo = async function (repoName) {
  const fetchInfo = await fetch(
    `https://api.github.com/repos/${username}/${repoName}`
  );
  const repoInfo = await fetchInfo.json();
  console.log(repoInfo);
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();

  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }

  displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
  viewReposButton.classList.remove("hide");
  repoData.innerHTML = "";
  repoData.classList.remove("hide");
  allReposContainer.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML = `
  <h3>Name: ${repoInfo.name}</h3>
  <p>Description: ${repoInfo.description}</p>
  <p>Default Branch: ${repoInfo.default_brach}</p>
  <p>Languages: ${languages.join(", ")}</p>
  <a class="visit" href="${
    repoInfo.html_url
  }" target="_black" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repoData.append(div);
};

viewReposButton.addEventListener("click", function () {
  allReposContainer.classList.remove("hide");
  repoData.classList.remove("hide");
  viewReposButton.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const searchLowerText = searchText.toLowerCase();
  for (const repo of repos) {
    const repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(searchLowerText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});
