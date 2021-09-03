console.info(`Thank you for downloading XPath Identifier Chrome Extension.`);
console.info(`Developed and maintained by Mitanshu Kumar.`);
console.info(
  `Please rate the app and share you feedback or reviews on twitter with @mitanshukr.`
);
console.log("Extension icon by: www.flaticon.com (No Copyright Infringement.)");
console.info(
  "Feel Free to Fork or improve or suggest any change. Please give credits to original Owners."
);

/********************************************************************/

let xpathData = "";

chrome.extension.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.type === "REMOVE_COPIED_DATA") {
    xpathData = "";
  }

  if (request.type === "GET_COPIED_DATA") {
    if (xpathData && xpathData !== "") {
      sendResponse({
        status: true,
        xpathData: xpathData,
      });
    } else {
      sendResponse({
        status: false,
        xpathData: null,
        message: "No Data",
      });
    }
  }

  if (request.type === "STORE_XPATH_DATA") {
    console.log(request.xpath);
    xpathData += request.xpath + "\n\n";
  }
});
