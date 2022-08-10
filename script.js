function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
}

// It starts in desired minute each hour
function getTimeToCheck() {
  const date = new Date()
  const desiredMinuteToStart = 9
  const minutesLeft = desiredMinuteToStart - date.getMinutes() - 1
  const secondsLeft = 60 - date.getSeconds() - 1
  const millisecondsLeft = 1000 - date.getMilliseconds()
  const delay = 1000
  return minutesLeft * 60000 + secondsLeft * 1000 + millisecondsLeft + delay
}

// const dayButton = document.querySelector("td[style='color: rgb(204, 204, 204); background-color: rgb(255, 106, 106);']");

const dayButtonSelector = "td[style='background-color: rgb(255, 106, 106); cursor: pointer;']"

function findGreenBtn() {
      const mutationNode = document.querySelector("div[class='fc-content']");

      const observer = new MutationObserver((mutations, observer) => {
        const greenBtn = document.querySelector(dayButtonSelector);

        console.log('observe');
        console.log(greenBtn);

        if (greenBtn) {
          console.log("I GOT BUTTON");
          console.log(greenBtn);

          triggerGreenCell(greenBtn)
          observer.disconnect();
        }
      });
      observer.observe(mutationNode, {attributes: true, childList: true, subtree: true});
}

const radioXPath = "//input[@type='radio']"

function findRadio() {
  return new Promise((resolve, reject) => {
    const mutationNode = document.querySelector("div[id='TimeBandsDiv']");

    const observer = new MutationObserver((mutations, observer) => {
      const result = getElementByXpath(radioXPath)
      result.iterateNext()
      result.iterateNext()
      const dateRadio1 = result.iterateNext()
      const dateRadio2 = result.iterateNext()
      const actualDate = dateRadio2 ?? dateRadio1

      if (actualDate) {
        actualDate.click()
        observer.disconnect();
        resolve(actualDate);
      }
    });

    observer.observe(mutationNode, {attributes: true, childList: true, subtree: true});
  })
}

function triggerGreenCell(greenBtn) {
  let slot = $(greenBtn);
  let down = new $.Event("mousedown");
  down.which = 1;
  down.pageX = slot.offset().left;
  down.pageY = slot.offset().top;
  slot.trigger(down);
}

function findConfirmationButton(path) {
  return new Promise((resolve, reject) => {
    const result = getElementByXpath(path)
    const confButton = result.iterateNext();

    if (confButton) {
      resolve(confButton)
    } else {
      reject(new Error("Can't find confirmation button"))
    }
  })
}

async function toPrevMonth() {
  console.log('TO PREV MONTH CLICK')
  const prevBtn = document.getElementsByClassName("fc-button-prev")[0]
  prevBtn.click()
}

const timeLeft = getTimeToCheck()
setTimeout(toPrevMonth, timeLeft)
findGreenBtn();
const radioBtn = await findRadio();

const confirmationBtn = await findConfirmationButton("//*[@id='btnConfirm']");
if (radioBtn.checked) {
  setTimeout(() => confirmationBtn.click(), 0);
}
