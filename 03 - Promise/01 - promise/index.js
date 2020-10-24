// Challenge 1

function sayHello() {
	setTimeout(() => {
		console.log("Hello");
	}, 1000);
}

// Uncomment the line below when ready
sayHello(); // should log "Hello" after 1000ms

// Challenge 2
var promise = new Promise(function (resolve, reject) {
	resolve("Resolved!");
}).then((msg) => console.log(msg));

// Should print out "Resolved!"
// ADD CODE HERE

// Challenge 3

promise = new Promise(function (resolve, reject) {
	reject("Reject!");
})
	.then((msg) => console.log(msg))
	.catch((msg) => console.log(msg));

// Should print out "Reject!"
// ADD CODE HERE

// Challenge 4

promise = new Promise(function (resolve, reject) {
	resolve();
});

/* OUTPUT -
  "I'm not the promise!"
  "Promise has been resolved!"

  The Following Out be Printed as JS is single tread and synchronous in nature here when it reach to promise land the promise executor get push to micro task queue and the console log got executed and when a call stack is empty the any execution pending on micro task queue get executed
*/

// Uncomment the lines below when ready
promise.then(() => console.log("Promise has been resolved!"));
console.log("I'm not the promise!");

// Challenge 5
function delay() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, 1000);
	});
}

// Uncomment the code below to test
// This code should log "Hello" after 1000ms
delay().then(sayHello);

// Challenge 6
// ADD CODE BELOW
var secondPromise = new Promise((resolve, reject) => {
	resolve("Second!");
});
var firstPromise = new Promise((resolve, reject) => {
	resolve(secondPromise);
})
	.then((promise) => promise)
	.then((msg) => console.log(msg));

// Challenge 7
const fakePeople = [
	{ name: "Rudolph", hasPets: false, currentTemp: 98.6 },
	{ name: "Zebulon", hasPets: true, currentTemp: 22.6 },
	{ name: "Harold", hasPets: true, currentTemp: 98.3 },
];

const fakeAPICall = (i) => {
	const returnTime = Math.floor(Math.random() * 1000);
	return new Promise((resolve, reject) => {
		if (i >= 0 && i < fakePeople.length) {
			setTimeout(() => resolve(fakePeople[i]), returnTime);
		} else {
			reject({ message: "index out of range" });
		}
	});
};

function getAllData() {
	const promisesArr = fakePeople.map((element, index) => fakeAPICall(index));
	return Promise.all(promisesArr).then((data) => console.log(data));
}
