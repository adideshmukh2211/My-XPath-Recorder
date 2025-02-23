function exportToRobot() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let browserURL = tabs.length ? tabs[0].url : "https://default-url.com"; // Use actual opened URL

        chrome.storage.local.get("recordedSteps", function (data) {
            if (!data.recordedSteps || data.recordedSteps.length === 0) {
                alert("No recorded steps to export!");
                return;
            }

            let robotScript = `*** Settings ***\nLibrary    SeleniumLibrary\n\n`;
            robotScript += `*** Test Cases ***\nTest Case 1\n`;
            robotScript += `    Open Browser    ${browserURL}    chrome\n`;
            robotScript += `    Maximize Browser Window\n`;

            data.recordedSteps.forEach(step => {
                if (step.command === "click") {
                    robotScript += `    Click Element    xpath=${step.target}\n`;
                } else if (step.command === "type") {
                    robotScript += `    Input Text    xpath=${step.target}    ${step.value}\n`;
                }
            });

            robotScript += `    Close Browser\n`;

            const blob = new Blob([robotScript], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "testcase.robot";
            a.click();
            URL.revokeObjectURL(url);
        });
    });
}
