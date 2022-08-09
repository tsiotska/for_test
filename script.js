function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
}

function getTimeToCheck() {
  const date = new Date();
  const minutesLeft = 60 - date.getMinutes()
  const secondsLeft = 60 - date.getSeconds()
  const millisecondsLeft = 60 - date.getMilliseconds()
  const toMilliseconds = minutesLeft * 60000 + secondsLeft * 1000 + millisecondsLeft
  return toMilliseconds
}

function findRadio(path) {
  return new Promise((resolve, reject) => {
    const mutationNode = document.querySelector("div[id='TimeBandsDiv']");

    const observer = new MutationObserver((mutations, observer) => {
      const result = getElementByXpath(path)
      result.iterateNext()
      result.iterateNext()
      const dateRadio1 = result.iterateNext()
      const dateRadio2 = result.iterateNext()
      const actualDate = dateRadio1 ?? dateRadio2

      if (actualDate) {
        resolve(actualDate);
        observer.disconnect();
      }
    });

    observer.observe(mutationNode, {attributes: true, childList: true, subtree: true});
  })
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

async function start() {
  /*const prevBtn = document.getElementsByClassName("fc-button-prev")[0]
prevBtn.click()*/

  // const gereenBtn = await findGreenBtn();
  // gereenBtn.click();

  const radioBtn = await findRadio("//input[@type='radio']");
  radioBtn.click();
  const confirmationBtn = await findConfirmationButton("//*[@id='btnConfirm']");
  if (radioBtn.checked) {
    setTimeout(() => confirmationBtn.click(), 0);
  }
}

const timeLeft = getTimeToCheck()
setTimeout(start, timeLeft)


/*  function findGreenBtn() {
    return new Promise((resolve, reject) => {
        const mutationNode = document.querySelector("div[class='fc-content']");

        const observer = new MutationObserver((mutations, observer) => {
            const dayButton = document.querySelector("td[style='background-color: rgb(188, 237, 145); cursor: pointer;']");

            if(dayButton) {
                resolve(dayButton);
                observer.disconnect();
            }
        });

        observer.observe(mutationNode, { attributes: true, childList: true, subtree: true });
    })
  }*/
