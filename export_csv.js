document.getElementById("export-csv").addEventListener("click", function () {
  chrome.storage.local.get("recordedSteps", function (data) {
      const steps = data.recordedSteps || [];
      let csvContent = "data:text/csv;charset=utf-8,Command,Target,Value\n";

      steps.forEach(step => {
          csvContent += `${step.command},"${step.target}","${step.value}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const a = document.createElement("a");
      a.href = encodedUri;
      a.download = "recorded_steps.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  });
});
