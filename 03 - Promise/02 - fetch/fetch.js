// Using XMLHttpRequest and Promise write your own implementation of browsers fetch method.
// 1. It takes two parameter 'url' and type of request (GET | POST)
// 2. Returns a promise
// 3. Resolve the promise when data is fetched (onload)
// 4. Reject the promise when error occurred (onerror)

function fetchData(url, type = "GET") {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(type, url);
		xhr.onload = function () {
			resolve(JSON.parse(xhr.response));
		};
		xhr.onerror = function () {
			reject("SomeThing Went Wrong");
		};
		xhr.send();
	});
}

fetchData("https://api.github.com/users/ikushaldave")
	.then((data) => console.log(data))
	.catch((error) => {
		throw new Error(error);
	});
