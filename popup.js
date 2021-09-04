const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", (e) => {
  chrome.runtime.sendMessage(
    { type: "GET_COPIED_DATA" },
    async function (response) {
      if (response.status === true) {
        try {
          if (!navigator.clipboard) {
            alert(`Clipboard API not available. Try with different browser.`);
            return;
          }
          await navigator.clipboard.writeText(response.xpathData);
          copyBtn.innerText = "✔ Copied to Clipboard";
          setTimeout(() => {
            copyBtn.innerText = "Copy xPaths to Clipboard";
          }, 1500);
          chrome.runtime.sendMessage({ type: "REMOVE_COPIED_DATA" });
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
      } else if (response.status === false) {
        alert("No data to Copy.");
      } else {
        alert("Something went wrong!");
      }
    }
  );
});
