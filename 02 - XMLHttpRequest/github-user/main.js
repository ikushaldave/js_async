// Your code goes here
const input = document.querySelector(".search");
const card = document.querySelector(".card");

function searchHandler(e) {
	let search = e.target.value;
	card.innerText = "Loading...";
	console.log(search);
	const url = `https://api.github.com/users/${search}`;
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send();

	xhr.onload = function () {
		card.innerText = "";
		const data = JSON.parse(xhr.response);
		if (data.login) {
			createUI(data);
		} else {
			alert("user not found");
		}
		e.target.value = "";
	};

	xhr.onerror = function () {
		card.innerText = "";
		alert("Error in Connection");
	};
}

function createUI(data) {
	card.innerHTML = "";

	const div = document.createElement("div");
	const img = document.createElement("img");
	const h3 = document.createElement("h3");
	const publicRepo = document.createElement("div");
	const following = document.createElement("div");
	const followers = document.createElement("div");
	const githubProfileURL = document.createElement("a");

	img.src = data.avatar_url;
	img.alt = data.name + " Profile";
	h3.innerText = data.name;
	h3.insertAdjacentHTML("beforeend", `<span>(@${data.login})</span>`);
	githubProfileURL.href = data.html_url;
	githubProfileURL.innerText = "Github Profile URL";
	publicRepo.innerText = "Public Repo: " + data.public_repos;
	following.innerText = "Following: " + data.following;
	followers.innerText = "Followers: " + data.followers;

	div.append(h3, publicRepo, following, followers, githubProfileURL);
	card.append(img, div);
}

input.addEventListener("search", searchHandler);
