document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("start-recording");
    const stopBtn = document.getElementById("stop-recording");
    const countdownDiv = document.getElementById("countdown");
    const tableContainer = document.getElementById("table-container");
    const tableBody = document.getElementById("recorded-steps");
    const exportCSV = document.getElementById("export-csv");
    const exportJSON = document.getElementById("export-json");
    const exportRobot = document.getElementById("export-robot");

    let recordedSteps = [];

    startBtn.addEventListener("click", function () {
        let countdown = 3;
        countdownDiv.innerText = `Recording starts in ${countdown}...`;
        countdownDiv.style.display = "block";

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownDiv.innerText = `Recording starts in ${countdown}...`;
            } else {
                clearInterval(countdownInterval);
                countdownDiv.innerText = "✅ Recording has started!";
                startRecording();
            }
        }, 1000);
    });

    function startRecording() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs.length) {
                alert("No active tab found.");
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error injecting content script:", chrome.runtime.lastError.message);
                    alert("Failed to start recording. Reload the page and try again.");
                    return;
                }

                chrome.tabs.sendMessage(tabs[0].id, { action: "startRecording" }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error("Content script error:", chrome.runtime.lastError.message);
                        alert("Failed to start recording. Reload the page and try again.");
                        return;
                    }
                    if (!response || response.status !== "recording_started") {
                        console.error("Unexpected response:", response);
                        alert("Recording did not start properly.");
                    }
                });
            });
        });
    }

    stopBtn.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stopRecording" }, function (response) {
                if (chrome.runtime.lastError) {
                    console.error("Error stopping recording:", chrome.runtime.lastError);
                    alert("Failed to stop recording. Reload the page and try again.");
                    return;
                }
                if (!response || response.status !== "recording_stopped") {
                    console.error("Error stopping recording:", response);
                    alert("Error: Recording did not stop properly.");
                } else {
                    recordedSteps = response.steps;
                    // Save to chrome.storage.local
                    chrome.storage.local.set({ recordedSteps: recordedSteps }, function() {
                        console.log("Steps saved to storage.");
                    });
                    tableContainer.style.display = "block";
                    updateRecordedStepsTable(recordedSteps);
                }
            });
        });
    });
    function updateRecordedStepsTable(steps) {
        tableBody.innerHTML = "";
        steps.forEach(step => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${step.command}</td><td>${step.target}</td><td>${step.value || ""}</td>`;
            tableBody.appendChild(row);
        });
    }

    // **EXPORT BUTTONS FUNCTIONALITY**
    exportCSV.addEventListener("click", function () {
        chrome.storage.local.get("recordedSteps", function (data) {
            const steps = data.recordedSteps || [];
            if (steps.length === 0) {
                alert("No recorded steps to export.");
                return;
            }
            let csvContent = "Command,Target,Value\n";
            steps.forEach(step => {
                csvContent += `${step.command},"${step.target}","${step.value}"\n`;
            });
            downloadFile(csvContent, "recording.csv", "text/csv");
        });
    });

    // Export JSON
    exportJSON.addEventListener("click", function () {
        chrome.storage.local.get("recordedSteps", function (data) {
            const steps = data.recordedSteps || [];
            if (steps.length === 0) {
                alert("No recorded steps to export.");
                return;
            }
            const jsonContent = JSON.stringify(steps, null, 2);
            downloadFile(jsonContent, "recording.json", "application/json");
        });
    });

    // Export Robot Framework
    exportRobot.addEventListener("click", function () {
        chrome.storage.local.get("recordedSteps", function (data) {
            const steps = data.recordedSteps || [];
            if (steps.length === 0) {
                alert("No recorded steps to export.");
                return;
            }
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const url = tabs[0] ? tabs[0].url : "https://example.com";
                let robotContent = `*** Settings ***\nLibrary    SeleniumLibrary\n\n*** Test Cases ***\nTest Case 1\n`;
                robotContent += `    Open Browser    ${url}    chrome\n`;
                robotContent += `    Maximize Browser Window\n`;
                steps.forEach(step => {
                    if (step.command === "click") {
                        robotContent += `    Click Element    xpath=${step.target}\n`;
                    } else if (step.command === "type") {
                        robotContent += `    Input Text    xpath=${step.target}    ${step.value}\n`;
                    }
                });
                robotContent += `    Close Browser\n`;
                downloadFile(robotContent, "testcase.robot", "text/plain");
            });
        });
    });

    function downloadFile(content, fileName, fileType) {
        const blob = new Blob([content], { type: fileType });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
