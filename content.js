console.log("hello xpath : DXC");

function sendDataToBackground(type, xpath) {
  chrome.runtime.sendMessage({ type: type, xpath: xpath });
}

let label_temp = null;
document.body.addEventListener("click", (e) => {
  let xpath = null;
  console.log(e.target);
  //console.log(e.target.getAttribute("id"));

  const element = e.target;
  const elemType = e.target.nodeName;

  if (elemType === "LABEL" || elemType === "INPUT" || elemType === "SELECT") {
    if (elemType === "LABEL") {
      label_temp = element.innerText;
    }

    if (label_temp && elemType === "INPUT") {
      xpath = `@FindBy(xpath = "//input[@id=(//label[text()='${label_temp}'])/@for]")
      private WebElement __inputTextField__;`;
      console.log(xpath);
      label_temp = null;
      sendDataToBackground("STORE_XPATH_DATA", xpath);
    }

    if (label_temp && elemType === "SELECT") {
      xpath = `@FindBy(xpath = "//select[@id=(//label[text()='${label_temp}'])/@for]")
      private WebElement __inputSelectField__;`;
      console.log(xpath);
      label_temp = null;
      sendDataToBackground("STORE_XPATH_DATA", xpath);
    }
  }

  if (elemType === "BUTTON") {
    const innerTxt = element.innerText;
    const btnId = element.getAttribute("id");

    let trimIndex = null;
    for (let i = 0; i < btnId.length; i++) {
      if (btnId[i] === ":") {
        if (btnId[i + 1] === ":") {
          trimIndex = i;
          break;
        }
      }
    }
    const trimmedId = btnId.slice(trimIndex);

    xpath = `@FindBy(xpath = "//button[text()='${innerTxt}' and contains(@id, '${trimmedId}')")
    private WebElement __btnElement__;`;

    console.log(xpath);
    sendDataToBackground("STORE_XPATH_DATA", xpath);
  }

  if (elemType === "A") {
    if (element.innerHTML !== "") {
      const childNodeName = element.firstChild.nodeName;
      if (childNodeName === "#text") {
        xpath = `@FindBy(xpath = "//a[text()='${element.innerText}']")
        private WebElement __textLink__;`;
      } else {
        xpath = `@FindBy(xpath = "//a[${childNodeName.toLowerCase()}='${
          element.innerText
        }']")
        private WebElement __nestedTextLink__;`;
      }
    } else {
      const aTitle = element.getAttribute("title");
      if (aTitle) {
        xpath = `@FindBy(xpath = "//a[@title='${aTitle}']")
        private WebElement __textlessLinkElement__;`;
      } else {
        //xpath logic here
      }
    }
    console.log(xpath);
    sendDataToBackground("STORE_XPATH_DATA", xpath);
  }
});
