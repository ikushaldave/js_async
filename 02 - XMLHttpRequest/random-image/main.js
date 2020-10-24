const root = document.querySelector("#root");

function fetch() {
	const url = "https://api.unsplash.com/photos/random/?client_id=xhD5sNxcCBe09Fun2jGNRq1g1sMHjNvVCl1z4JaK7Hs";
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.onload = function () {
		const jsonData = JSON.parse(xhr.response);
		createUI(jsonData);
	};
	xhr.onerror = function () {
		alert("SOMETHING WENT WRONG ❌");
	};
	xhr.send();
}

function createUI(data) {
	root.innerHTML = "";
	const img = document.createElement("img");
	img.src = data.urls.regular;
	img.alt = data.alt_description;
	root.append(img);
}

document.body.addEventListener("click", fetch);

fetch();
