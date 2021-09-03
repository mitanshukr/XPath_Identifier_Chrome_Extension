console.info(`Thank you for downloading XPath Identifier Extension.`);
console.info(
  `Please rate the app and share you feedback or reviews on twitter with @mitanshukr.`
);
console.info(`Developed and maintained by Mitanshu Kumar.`);
console.info(
  "Feel Free to Fork or improve or suggest any change. Please give credits to original Owners."
);
console.info("All Rights Reserved.");
// ********************************************************************/

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

//////////////////////////////////////
// let audio = new Audio("carol_of_the_bells-alarm.mp3");
// let alarmTone;  //setInterval
// let timeCount;  //setInterval
// let remainingTime;
// let isPaused = false;
// let isTimesUp = false;

// function timer(seconds) {
//   clearInterval(timeCount); //clear any existing timer.
//   audio.pause();
//   audio.currentTime = 0;
//   clearInterval(alarmTone);
//   isTimesUp = false;
//   const then = Date.now() + seconds * 1000;
//   //Date.now() gives total milliseconds elapsed from January 1, 1970 to till time. check mdn.
//   sendMessageToPopup(seconds, `displayTimeLeft`);
//   sendMessageToPopup(then, `displayEndTime`);

//   timeCount = setInterval(() => {
//     const secondsLeft = Math.round((then - Date.now()) / 1000);
//     if (secondsLeft == 0) {
//       alarm();
//     }
//     if (secondsLeft < 0) {
//       clearInterval(timeCount);
//       return;
//     }
//     sendMessageToPopup(secondsLeft, `displayTimeLeft`);
//   }, 1000);
// }

// function alarm() {
//   isTimesUp = true;
//   audio.play();
//   sendMessageToPopup("", `disablePauseBtn`);

//   alarmTone = setInterval(() => {
//     audio.currentTime = 0;
//     audio.play();
//   }, 17000);
//   //please note: the audio is apx. 28sec long.
// }

// //Sends message to popup.js
// function sendMessageToPopup(message, type) {
//   let obj = {
//     message,
//     type,
//   };
//   chrome.runtime.sendMessage(obj);
// }

// //receives message from popup.js
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.type === "timer") {
//     timer(+msg.message);
//   } else if (msg.type === "PAUSE") {
//     isPaused = true;
//     remainingTime = msg.message;
//     clearInterval(timeCount);
//   } else if (msg.type === "RESUME") {
//     isPaused = false;
//     timer(remainingTime);
//   } else if (msg.type === "RESET") {
//     isPaused = false;
//     isTimesUp = false;
//     audio.pause();
//     audio.currentTime = 0;
//     audio.src = audio.src;
//     clearInterval(timeCount);
//     clearInterval(alarmTone);
//   } else if (msg.type == "initialCheck") {
//     sendResponse({
//       isTimesUp: isTimesUp,
//       isPaused: isPaused,
//       remainingTime: remainingTime,
//     });
//   }
// });
