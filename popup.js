// Object of arrays of fonts
const webSafeFonts = {
	"sans-serif": [
		"Arial",
		"Arial Black",
		"Verdana",
		"Tahoma",
		"Trebuchet MS",
		"Impact"
	],
	"serif": [
		"Times New Roman",
		"Didot",
		"Georgia",
		"American Typewriter"
	],
	"monospace": [
		"Andalé Mono",
		"Courier",
		"Lucida Console",
		"Monaco"
	],
	"cursive": [
		"Bradley Hand",
		"Brush Script MT",
		"Comic Sans MS"
	],
	"fantasy": [
		"Luminari"
	]
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
		if (font === "default") {
			document.body.style.fontFamily = "";
		} else {
			document.body.style.fontFamily = font;
		}
	})
}