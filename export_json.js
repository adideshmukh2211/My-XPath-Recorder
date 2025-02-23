document.getElementById("export-json").addEventListener("click", function () {
  chrome.storage.local.get("recordedSteps", function (data) {
      const steps = data.recordedSteps || [];
      const jsonData = JSON.stringify(steps, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded_steps.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  });
});
