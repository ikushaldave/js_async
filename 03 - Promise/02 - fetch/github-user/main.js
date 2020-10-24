const input = document.querySelector(".user-search input");
const profileElement = document.querySelector(".profile");
const reposElement = document.querySelector(".repos");
const followersElement = document.querySelector(".followers");

class Fetch {
	constructor(respond) {
		this.response = respond.response;
		this.url = respond.responseURL;
	}

	get json() {
		return JSON.parse(this.response);
	}

	static fetchAPI(url, type = "GET") {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(type, url);

			xhr.onload = () => {
				resolve(xhr);
			};

			xhr.onerror = () => {
				reject("SOMETHING WENT WRONG ☠");
			};

			xhr.send();
		});
	}
}

class Profile extends Fetch {
	constructor(xhr) {
		super(xhr);
	}

	createUI() {
		profileElement.innerHTML = "";
		const filteredObj = filterUtil(this.json, ["bio", "company", "location", "twitter_username", "blog"]);
		const img = document.createElement("img");
		const div = document.createElement("div");
		const a = document.createElement("a");
		const h1 = document.createElement("h1");
		const user = document.createElement("div");
		const userStat = document.createElement("div");
		const userInfo = document.createElement("div");

		div.classList.add("profile-info", "flex-col");
		a.classList.add("userName");
		img.src = this.json.avatar_url;
		img.alt = this.json.name;
		h1.innerText = this.json.name;
		a.href = this.json.html_url;
		a.target = "_blank";
		a.innerText = `(@${this.json.login})`;

		for (const key in filteredObj) {
			if (key == "twitter_username" || key == "blog") {
				const a = document.createElement("a");
				a.href = key == "twitter_username" ? `https://twitter.com/${filteredObj[key]}` : filteredObj[key];
				a.target = "_blank";
				a.innerText = key == "twitter_username" ? `@${filteredObj[key]}` : filteredObj[key];
				a.insertAdjacentHTML("afterbegin", key == "blog" ? `<i class="far fa-link"></i>` : `<i class="fab fa-twitter"></i> `);
				userInfo.append(a);
			} else {
				const p = document.createElement("p");
				p.innerText = filteredObj[key];
				p.insertAdjacentHTML("afterbegin", key == "company" ? `<i class="fas fa-building"></i>` : key == "bio" ? `<i class="far fa-user"></i>` : `<i class="far fa-map-marker-alt"></i>`);
				userInfo.append(p);
			}
		}

		userStat.classList.add("stat", "flex");
		const followers = document.createElement("p");
		followers.innerText = this.json.followers + " Followers";
		const following = document.createElement("p");
		following.innerText = this.json.following + " Following";
		const repos = document.createElement("p");
		repos.innerText = this.json.public_repos + " Repos";

		user.append(h1, a);
		userStat.append(followers, following, repos);
		div.append(user, userInfo, userStat);
		profileElement.append(img, div);
	}
}
class Followers extends Profile {
	constructor(xhr) {
		super(xhr);
	}

	createUI(show = 12) {
		followersElement.innerHTML = "";

		const h3 = document.createElement("h3");
		const ul = document.createElement("ul");
		h3.innerText = "Followers";
		ul.classList.add("followers-list", "flex");

		const viewMore = document.createElement("a");
		let buttonWrapper = document.createElement("div");
		buttonWrapper.classList.add("view-more");
		viewMore.innerText = "View More";

		viewMore.addEventListener("click", () => {
			show += 10;
			document.querySelector(".followers-list").remove();
			this.createUI(show);
		});

		if (this.json.length <= show) {
			show = this.json.length - 1;
			buttonWrapper = "";
		} else {
			buttonWrapper.append(viewMore);
		}

		for (let i = 0; i < show; i++) {
			const li = document.createElement("li");
			li.classList.add("follower");
			const card = document.createElement("div");
			card.classList.add(".card");
			card.setAttribute("data-username", this.json[i].login);
			const profile = document.createElement("img");
			profile.src = this.json[i].avatar_url;
			card.append(profile);
			li.append(card);
			ul.append(li, buttonWrapper);
		}

		followersElement.append(h3, ul);

		ul.addEventListener("click", (e) => {
			const value = e.target.closest("div");
			if (value.classList.contains(".card")) {
				searchProfile(value.dataset.username);
			}
		});
	}
}

class PublicRepo extends Profile {
	constructor(xhr) {
		super(xhr);
		this.createFilterOptionsUI();
	}

	sortByLatestRepo() {
		return [...this.json].sort((a, b) => {
			return Date.parse(b.updated_at) - Date.parse(a.updated_at);
		});
	}

	sortByOldestRepo() {
		return [...this.json].sort((a, b) => {
			return Date.parse(a.updated_at) - Date.parse(b.updated_at);
		});
	}

	getAge(arr) {
		return arr.map((repo) => {
			const now = new Date().toLocaleString();
			let nowDD = +now.slice(3, 5);
			let nowMM = +now.slice(0, 2);
			let nowYYYY = +now.slice(6, 10);
			let nowSec = new Date().getSeconds();
			let nowMin = new Date().getMinutes();
			let nowHour = new Date().getHours();

			let dd = +repo.updated_at.slice(8, 10);
			let mm = +repo.updated_at.slice(5, 7);
			let yyyy = +repo.updated_at.slice(0, 4);
			let hour = +repo.updated_at.slice(11, 13);
			let minute = +repo.updated_at.slice(14, 16);
			let second = +repo.updated_at.slice(17, 19);

			let remainDD = "";
			let remainMM = "";
			let remainYYYY = "";
			let remainSec = "";
			let remainMin = "";
			let remianHour = "";

			if (nowDD - dd) {
				if (nowDD - dd > 0) {
					remainDD = nowDD - dd + " day ";
				} else {
					remainDD = nowDD + 30 - dd + " day ";
					nowMM--;
				}
			} else if (nowDD - dd <= 0) {
				if (nowHour - hour) {
					if (nowHour - hour > 0) {
						remianHour = nowHour - hour + " hour ";
					} else {
						remianHour = nowHour + 24 - hour + " hour ";
					}
				} else if (nowMin - minute) {
					if (nowMin - minute > 0) {
						remainMin = nowMin - minute + " minute ";
					} else {
						remainMin = nowMin + 60 - minute + " minute ";
					}
				} else {
					if (nowSec - second > 0) {
						remainSec = nowSec - second + " second ";
					} else {
						remainSec = nowSec + 60 - second + " second ";
					}
				}
			}

			if (nowMM - mm) {
				if (nowMM - mm > 0) {
					remainMM = nowMM - mm + " month ";
				} else {
					remainMM = nowMM + 12 - mm + " month ";
					nowYYYY--;
				}
			}

			if (nowYYYY - yyyy) {
				remainYYYY = nowYYYY - yyyy + " year ";
			}

			repo.lastUpdated = remainYYYY + remainMM + remainDD + remianHour + remainMin + remainSec + "ago";
			return repo;
		});
	}

	createFilterOptionsUI() {
		const wrapper = document.createElement("div");
		const h3 = document.createElement("h3");
		h3.innerText = "Repositories";
		const div = document.createElement("div");
		div.classList.add("repo-section-nav", "flex");
		const search = document.createElement("input");
		search.classList.add("search-repo");
		search.type = "search";
		search.placeholder = "Search REPO of following user";
		const searchLabel = document.createElement("label");
		searchLabel.innerText = "Search Repo : ";
		const filterLabel = document.createElement("label");
		filterLabel.innerText = "Filter Repo : ";
		const select = document.createElement("select");
		select.classList.add("filter-options");
		select.name = "filter";
		const stars = document.createElement("option");
		stars.value = "Most Star";
		stars.innerText = "Most Star";
		const latest = document.createElement("option");
		latest.value = "Latest";
		latest.innerText = "Latest";
		const oldest = document.createElement("option");
		oldest.value = "Oldest";
		oldest.innerText = "Oldest";
		select.append(latest, oldest, stars);
		searchLabel.append(search);
		filterLabel.append(select);
		div.append(searchLabel, filterLabel);
		wrapper.append(h3, div);
		reposElement.append(wrapper);
	}

	createRepoUI(repoArr = this.sortByLatestRepo(), show = 10) {
		if (reposElement.querySelector("ul")) reposElement.querySelector("ul").remove();
		const arr = this.getAge(repoArr).map((repo) => filterUtil(repo, ["name", "description", "fork", "forks", "html_url", "lastUpdated", "open_issues", "stargazers_count"]));

		const ul = document.createElement("ul");
		ul.classList.add("repo-list");

		const viewMore = document.createElement("a");
		let buttonWrapper = document.createElement("div");
		buttonWrapper.classList.add("view-more");
		viewMore.innerText = "View More";

		viewMore.addEventListener("click", () => {
			show += 10;
			document.querySelector(".repo-list").remove();
			this.createRepoUI(undefined, show);
		});

		if (arr.length <= show) {
			show = arr.length - 1;
			buttonWrapper = "";
		} else {
			buttonWrapper.append(viewMore);
		}

		for (let i = 0; i <= show; i++) {
			const li = document.createElement("li");
			const title = document.createElement("a");
			const desc = document.createElement("p");
			const countStat = document.createElement("div");
			const starCount = document.createElement("p");
			const forkCount = document.createElement("p");
			const issueCount = document.createElement("p");
			const lastUpdate = document.createElement("p");
			const repoInfo = document.createElement("div");
			const repoStat = document.createElement("div");

			li.classList.add("repo", "flex-col");
			repoStat.classList.add("flex");
			countStat.classList.add("flex", "count-stat");
			title.href = arr[i].html_url;
			title.target = "_blank";
			title.innerHTML = `<i class="far fa-folder"></i> ${arr[i].name} `;
			starCount.innerText = `Star : ${arr[i].stargazers_count ?? 0}`;
			forkCount.innerText = `Forks : ${arr[i].stargazers_count ?? 0}`;
			issueCount.innerText = `Issue : ${arr[i].stargazers_count ?? 0}`;
			lastUpdate.innerText = "last push " + arr[i].lastUpdated;
			if (arr[i].description) {
				desc.innerText = arr[i].description;
			}
			if (arr[i].fork) {
				title.insertAdjacentHTML("beforeend", `<span> (forked) </span>`);
			}
			countStat.append(starCount, forkCount, issueCount);
			repoStat.append(countStat, lastUpdate);
			repoInfo.append(title, desc);
			li.append(repoInfo, repoStat);
			ul.append(li, buttonWrapper);
			reposElement.append(ul);
		}
	}

	createUI() {
		reposElement.innerHTML = "";
		this.createFilterOptionsUI();
		this.createRepoUI();

		const search = document.querySelector(".search-repo");
		search.addEventListener("input", (e) => {
			const value = e.target.value.trim();
			const filterRepo = this.json.filter((obj) => obj.name.toLowerCase().includes(value.toLowerCase()));
			this.createRepoUI(filterRepo, undefined);
		});

		const select = document.querySelector(".filter-options");
		select.addEventListener("change", (e) => {
			const value = e.target.value;
			if (value == "Latest") {
				this.createRepoUI(this.sortByLatestRepo());
			} else if (value == "Oldest") {
				this.createRepoUI(this.sortByOldestRepo());
			} else {
				const mostStarArr = [...this.json].sort((a, b) => b.stargazers_count - a.stargazers_count);
				this.createRepoUI(mostStarArr);
			}
		});
	}
}

function filterUtil(obj, arr) {
	const filteredInfo = Object.fromEntries(Object.entries(obj).filter((arr) => arr[1]));
	return arr.reduce((acc, cv) => {
		if (filteredInfo[cv]) {
			acc[cv] = filteredInfo[cv];
		}
		return acc;
	}, {});
}

function searchProfile(user) {
	const url = `https://api.github.com/users/${user}`;
	const endPoints = [url, `${url}/repos`, `${url}/followers`];
	const promisesArr = endPoints.map((url) => Fetch.fetchAPI(url));
	Promise.all(promisesArr)
		.then((responds) => [new Profile(responds[0]), new PublicRepo(responds[1]), new Followers(responds[2])])
		.then((instances) => instances.forEach((instance) => instance.createUI()))
		.catch((error) => {
			console.trace(error);
		});
}

input.addEventListener("search", searchHandler);

function searchHandler(e) {
	if (!e.target.value.trim()) return;
	searchProfile(e.target.value.trim());
	e.target.value = "";
}

searchProfile("altcampus");
