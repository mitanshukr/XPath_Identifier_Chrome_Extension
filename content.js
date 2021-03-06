console.log(
  "%cXPath Identifier Extension Active... Tracking mouse click events!",
  "color: blue; font-size: 20px"
);

// let label_temp = null;
document.body.addEventListener("click", (e) => {
  const element = e.target;
  const elemType = e.target.nodeName;
  console.log(element);

  let xpath = null;

  // if (elemType === "LABEL" || elemType === "INPUT" || elemType === "SELECT") {
  //   if (elemType === "LABEL") {
  //     label_temp = element.innerText;
  //   }

  //   if (label_temp && elemType === "INPUT") {
  //     xpath = `//input[@id=(//label[text()='${label_temp}'])/@for]`;
  //     label_temp = null;
  //     sendDataToBackground(xpath);
  //   }

  //   if (label_temp && elemType === "SELECT") {
  //     xpath = `//select[@id=(//label[text()='${label_temp}'])/@for]`;
  //     label_temp = null;
  //     sendDataToBackground(xpath);
  //   }
  // }

  //Input and Select type elements click handling
  if (
    elemType === "INPUT" ||
    elemType === "SELECT" ||
    elemType === "TEXTAREA"
  ) {
    const elemId = element.getAttribute("id");
    const labelNode = getInputLabelNode(elemId);
    if (labelNode) {
      const labelName = labelNode.innerHTML;
      if (elemType === "INPUT")
        xpath = `//input[@id=(//label[text()='${labelName}'])/@for]`;
      else if (elemType === "TEXTAREA")
        xpath = `//textarea[@id=(//label[text()='${labelName}'])/@for]`;
      else xpath = `//select[@id=(//label[text()='${labelName}'])/@for]`;
      sendDataToBackground(elemType, xpath);
    } else {
      if (elemType === "INPUT") xpath = `//input[contains(@id, '${elemId}')]`;
      else if (elemType === "TEXTAREA")
        xpath = `//textarea[contains(@id, '${elemId}')]`;
      else xpath = `//select[contains(@id, '${elemId}')]`;
      sendDataToBackground(elemType, xpath);
    }
  }

  //Button click handling
  if (elemType === "BUTTON") {
    const innerTxt = element.innerText;
    xpath = `//button[text()='${innerTxt}']`;
    if (getMatchingElementCount(xpath) !== 1) {
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
    }
    sendDataToBackground("BUTTON", xpath);
  }

  //a tag/link element click handling
  if (elemType === "A") {
    if (element.innerHTML !== "") {
      const firstChildName = element.firstChild.nodeName;
      if (firstChildName === "#text") {
        xpath = `//a[text()='${element.innerText}']`;
        if (getMatchingElementCount(xpath) !== 1) {
          const aTagId = element.getAttribute("id");
          if (aTagId && aTagId !== "")
            xpath = `//a[text()='${element.innerText}' and contains(@id, '${aTagId}')]`;
        }
      } else if (firstChildName === "svg") {
        xpath = `//a[span='${element.innerText}']`;
      } else {
        xpath = `//a[${firstChildName.toLowerCase()}='${element.innerText}']`;
      }
    } else {
      const aTitle = element.getAttribute("title");
      if (aTitle) {
        xpath = `//a[contains(@title,'${aTitle}')]`;
      }
      if (!aTitle || getMatchingElementCount(xpath) !== 1) {
        const aTagId = element.getAttribute("id");
        if (aTagId && aTagId !== "" && aTitle)
          xpath = `//a[contains(@title,'${aTitle}') and contains(@id, '${aTagId}')]`;
        else if (aTagId && aTagId !== "")
          xpath = `//a[contains(@id, '${aTagId}')]`;
      }
    }
    if (xpath) sendDataToBackground("A", xpath);
  }

  //svg click handling
  if (elemType === "svg") {
    const parentNode = element.parentNode;
    if (parentNode.nodeName === "A") {
      const aTitle = parentNode.getAttribute("title");
      if (aTitle) {
        xpath = `//a[contains(@title,'${aTitle}')]`;
      } else {
        //xpath else logic here
      }
    }
    if (xpath) sendDataToBackground("A", xpath);
  }

  //img tag click handling
  if (elemType === "IMG") {
    const parentNode = element.parentNode;
    if (parentNode.nodeName === "A") {
      const imgTitle = element.getAttribute("title");
      if (imgTitle) {
        xpath = `//img[contains(@title,'${imgTitle}')]/..`;
      } else {
        //xpath else logic here
      }
    }
    if (xpath) sendDataToBackground("A", xpath);
  }

  //span element click handling
  if (elemType === "SPAN") {
    const parentNode = element.parentNode;
    if (parentNode.nodeName === "A") {
      xpath = `//a[span='${parentNode.innerText}']`;
      sendDataToBackground("A", xpath);
    }
    if (parentNode.nodeName === "TD") {
      xpath = `//span[text()='__COLUMN_NAME__']/following::table/tbody/tr[1]/td[2]/div/table/tbody/tr`;
      sendDataToBackground("SEARCH_LIST", xpath);
    }
  }
});

function sendDataToBackground(xpathType, xpath) {
  const countVal = getMatchingElementCount(xpath);
  const xpathVar = `@FindBy(xpath = "${xpath}")
  private WebElement __VAR_NAME__;
  //Matches: ${countVal}\n\n`;
  console.log(xpathVar);
  const xpathFunc = getXpathMethodFunc(xpathType);
  const xpathData = xpathVar + xpathFunc;
  chrome.runtime.sendMessage({ type: "STORE_XPATH_DATA", xpath: xpathData });
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

function getInputLabelNode(inputId) {
  return document.evaluate(
    `//label[@for='${inputId}']`,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function getXpathMethodFunc(xpathType) {
  if (xpathType === "BUTTON" || xpathType === "A") {
    return `public void __FUNCTION_NAME__() {
      wait.until(ExpectedConditions.visibilityOf(this.__VAR_NAME__)).click();
      // TestUtilities.waitForElementInvisibility(this.__VAR_NAME__);
    }`;
  }
  if (xpathType === "INPUT" || xpathType === "TEXTAREA") {
    return `public void __FUNCTION_NAME__(String input) {
      if (input.trim().equals(""))
        return;
      wait.until(ExpectedConditions.visibilityOf(this.__VAR_NAME__)).clear();
      wait.until(ExpectedConditions.visibilityOf(this.__VAR_NAME__)).sendKeys(input);
      // Keys.RETURN
    }`;
  }
  if (xpathType === "SELECT") {
    return `public void __FUNCTION_NAME__(String option) {
      if (option.trim().equals(""))
        return;
      Select s = new Select(this.__VAR_NAME__);
      s.selectByVisibleText(option);
    }`;
  }

  if (xpathType === "SEARCH_LIST") {
    return `public void __FUNCTION_NAME__(String input) {
      if (input.trim().equals(""))
        return;
      wait.until(ExpectedConditions.visibilityOf(this.__SEARCH_ICON__)).click();
      // wait.until(ExpectedConditions.visibilityOf(this.__SEARCH_LINK__)).click();
      wait.until(ExpectedConditions.visibilityOf(this.__SEARCH_INPUT__)).clear();
      wait.until(ExpectedConditions.visibilityOf(this.__SEARCH_INPUT__)).sendKeys(input, Keys.RETURN);
      wait.until(ExpectedConditions.visibilityOf(this.__SEARCH__OUTPUT_ROW__)).click();
      wait.until(ExpectedConditions.visibilityOf(this.__SEARCH_OK_BTN__)).click();
      TestUtilities.waitForElementInvisibility(this.__SEARCH_OK_BTN__);
    }`;
  }
}
