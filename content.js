if (!window.hasOwnProperty("xpathRecorderInjected")) {
    window.xpathRecorderInjected = true; // Prevent duplicate injections

    let recording = false;
    let recordedSteps = [];

    function getAccurateXPath(element) {
        if (!element || element.nodeType !== 1) return '';

        if (element.hasAttribute("id")) {
            return `//*[@id="${element.id}"]`;
        }
        if (element.hasAttribute("data-testid")) {
            return `//*[@data-testid="${element.getAttribute("data-testid")}"]`;
        }
        if (element.hasAttribute("name")) {
            return `//*[@name="${element.getAttribute("name")}"]`;
        }
        if (element.hasAttribute("class")) {
            let className = element.getAttribute("class").trim().replace(/\s+/g, ".");
            return `//*[contains(@class, "${className}")]`;
        }
        if (element.tagName.toLowerCase() === "button") {
            return `//button[contains(text(), '${element.innerText.trim()}')]`;
        }
        if (element.tagName.toLowerCase() === "a") {
            return `//a[contains(text(), '${element.innerText.trim()}')]`;
        }

        let tag = element.tagName.toLowerCase();
        let index = Array.from(element.parentNode.children).indexOf(element) + 1;
        let parentXPath = getAccurateXPath(element.parentNode);

        return `${parentXPath}/${tag}[${index}]`;
    }

    // Listen for messages from popup.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "startRecording") {
            recording = true;
            recordedSteps = [];
            console.log("Recording started...");
            sendResponse({ status: "recording_started" });
        } else if (message.action === "stopRecording") {
            recording = false;
            console.log("Recording stopped.");
            sendResponse({ status: "recording_stopped", steps: recordedSteps });
        }
    });

    // ✅ Click Event Listener (Now Captures Input Field Clicks Too!)
    document.addEventListener("click", function (event) {
        if (!recording) return;

        let target = event.target.closest("button, a, input, textarea, select");
        if (!target) return;

        let accurateXPath = getAccurateXPath(target);

        let step = {
            command: "click",
            target: accurateXPath,
            value: "" // Click should not store value
        };

        recordedSteps.push(step);
        console.log("Recorded step:", step);
    });

    // ✅ Type Event Listener (Stores Only User Input)
    document.addEventListener("blur", function (event) {
        if (!recording) return;

        let target = event.target.closest("input, textarea, select");
        if (!target) return;

        // Exclude non-textual inputs (buttons, submits)
        if (target.tagName.toLowerCase() === "input") {
            const inputType = target.type.toLowerCase();
            if (["submit", "button", "reset", "image"].includes(inputType)) {
                return;
            }
        }

        let accurateXPath = getAccurateXPath(target);

        let step = {
            command: "type",
            target: accurateXPath,
            value: target.value // Store only user input
        };

        recordedSteps.push(step);
        console.log("Recorded step:", step);
    }, true);
}
