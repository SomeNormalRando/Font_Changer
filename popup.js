// Object of arrays of fonts
const webSafeFonts = {
	"sans-serif": [
		"Arial",
		"Arial Black",
		"Arial Narrow",
		"Verdana",
		"Tahoma",
		"Trebuchet MS",
		"Impact"
	],
	"serif": [
		"Times New Roman",
		"Georgia",
	],
	"monospace": [
		"Courier",
		"Lucida Console",
	],
	"cursive": [
		"Brush Script MT",
		"Comic Sans MS"
	],
}

//Get the select menu element
const fontSelect = document.getElementById("fontSelect");

// Loop over the fonts to create options in the select menu
for (const fontCategory of Object.keys(webSafeFonts)) {
	for (const font of webSafeFonts[fontCategory]) {
		const newOption = document.createElement("option");
		newOption.textContent = font;
		newOption.value = font;
		fontSelect.appendChild(newOption);
	}
}

(async function() {
	chrome.storage.sync.get("font", ({ font }) => {
		document.getElementById("fontSelect").value = font;
	});
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: changePageFont,
	});
})();

// When an option is chosen, inject changeFont() into current page
fontSelect.addEventListener("change", async (event) => {
	chrome.storage.sync.set({ font: event.target.value });
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: changePageFont,
	});
});
  
// The body of this function will be executed as a content script inside the current page
function changePageFont() {
	chrome.storage.sync.get("font", ({ font }) => {
		const elements = [
			document.getElementsByTagName("p"),
			document.getElementsByTagName("em"),
			document.getElementsByTagName("strong"),
			document.getElementsByTagName("a"),
			document.getElementsByTagName("div"),
			document.getElementsByTagName("span"),
		]

		if (font === "default") font = "";
		loop(font, elements);

	});
	function loop(font, elementsArr) {
		document.body.style.fontFamily = font;
		for (const elementType of elementsArr) {
			for (const element of elementType) {
				element.style.fontFamily = font;
			}
		}
	}
}