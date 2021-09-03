console.log(
  "XPath Identifier Extension Active... Tracking mouse click events!"
);

let label_temp = null;
document.body.addEventListener("click", (e) => {
  const element = e.target;
  const elemType = e.target.nodeName;
  console.log(element);

  let xpath = null;

  if (elemType === "LABEL" || elemType === "INPUT" || elemType === "SELECT") {
    if (elemType === "LABEL") {
      label_temp = element.innerText;
    }

    if (label_temp && elemType === "INPUT") {
      xpath = `//input[@id=(//label[text()='${label_temp}'])/@for]`;
      label_temp = null;
      sendDataToBackground(xpath);
    }

    if (label_temp && elemType === "SELECT") {
      xpath = `//select[@id=(//label[text()='${label_temp}'])/@for]`;
      label_temp = null;
      sendDataToBackground(xpath);
    }
  }

  if (elemType === "BUTTON") {
    const innerTxt = element.innerText;
    xpath = `//button[text()='${innerTxt}']`;
    if (getMatchingElementCount(xpath) === 1) {
      sendDataToBackground(xpath);
    } else {
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
      xpath = `//button[text()='${innerTxt}' and contains(@id, '${trimmedId}')]`;
      sendDataToBackground(xpath);
    }
  }

  if (elemType === "A") {
    if (element.innerHTML !== "") {
      const firstChildName = element.firstChild.nodeName;
      if (firstChildName === "#text") {
        xpath = `//a[text()='${element.innerText}']`;
      } else if (firstChildName === "SVG") {
        xpath = `//a[span='${element.innerText}']`;
      } else {
        xpath = `//a[${firstChildName.toLowerCase()}='${element.innerText}']`;
      }
    } else {
      const aTitle = element.getAttribute("title");
      if (aTitle) {
        xpath = `//a[contains(@title,'${aTitle}')]`;
      } else {
        //xpath else logic here
      }
    }
    if (xpath) sendDataToBackground(xpath);
  }

  if (elemType === "svg") {
    const parentNode = element.parentNode;
    if (parentNode.nodeName === "A") {
      const aTitle = parentNode.getAttribute("title");
      if (aTitle) {
        xpath = `//a[contains(@title,'${aTitle}')]`;
      } else {
        //xpath logic here
      }
    }
    if (xpath) sendDataToBackground(xpath);
  }

  if (elemType === "IMG") {
    const parentNode = element.parentNode;
    if (parentNode.nodeName === "A") {
      const imgTitle = element.getAttribute("title");
      if (imgTitle) {
        xpath = `//img[contains(@title,'${imgTitle}')]/..`;
      } else {
        //xpath logic here
      }
    }
    if (xpath) sendDataToBackground(xpath);
  }

  if (elemType === "SPAN") {
    const parentNode = element.parentNode;
    if (parentNode.nodeName === "A") {
      xpath = `//a[span='${parentNode.innerText}']`;
    }
    if (xpath) sendDataToBackground(xpath);
  }
});

function sendDataToBackground(xpath) {
  const countVal = getMatchingElementCount(xpath);
  const xpathVar = `@FindBy(xpath = "${xpath}")
  private WebElement __variableNameHere__;
  //MatchingElemCount: ${countVal}`;
  console.log(xpathVar);
  chrome.runtime.sendMessage({ type: "STORE_XPATH_DATA", xpath: xpathVar });
}

function getMatchingElementCount(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  ).snapshotLength;
}
