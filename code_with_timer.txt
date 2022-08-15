const useTimer = true;
const delayToStart = 650

const greenBtnSelector = "td[style='background-color: rgb(188, 237, 145); cursor: pointer;']"
const confirmationButtonXPath = "//*[@id='btnConfirm']"
const radioXPath = "//input[@type='radio']"

// It starts in desired minute each hour
function getTimeToCheck() {
  const date = new Date()
  const desiredMinuteToStart = 60
  const minutesLeft = desiredMinuteToStart - date.getMinutes() - 1
  const secondsLeft = 60 - date.getSeconds() - 1
  const millisecondsLeft = 1000 - date.getMilliseconds()

  return minutesLeft * 60000 + secondsLeft * 1000 + millisecondsLeft + delayToStart
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
}

function findGreenBtn() {
  return new Promise((resolve) => {
    const mutationNode = document.querySelector("div[class='fc-content']");

    let dayButton = document.querySelector(greenBtnSelector);
    console.log(dayButton)

    if (dayButton) {
      console.log('FOUND GREEN (NO OBSERVER)');
      resolve(dayButton);
    }

    const observer = new MutationObserver((mutations, observer) => {
      dayButton = document.querySelector(greenBtnSelector);
      console.log(dayButton)

      if (dayButton) {
        console.log('FOUND GREEN (OBSERVER)');
        observer.disconnect();
        resolve(dayButton);
      }
    });

    observer.observe(mutationNode, {attributes: true, childList: true, subtree: true});
  })
}

function findAndClickRadio() {
  return new Promise((resolve) => {
    const result = getElementByXpath(radioXPath)
    result.iterateNext()
    result.iterateNext()
    const dateRadio1 = result.iterateNext()
    const dateRadio2 = result.iterateNext()
    const actualDate = dateRadio2 ?? dateRadio1
    console.log('radio button');
    console.log(actualDate);
    if (actualDate) {
      resolve(actualDate);
    }
  })
}

function findConfirmationButton() {
  return new Promise((resolve, reject) => {
    const result = getElementByXpath(confirmationButtonXPath)
    const confButton = result.iterateNext();

    if (confButton) {
      confButton.click()
      resolve(confButton)
    } else {
      reject(new Error("Can't find confirmation button"))
    }
  })
}

async function toPrevMonth() {
  const timeLeft = getTimeToCheck()

  return new Promise((resolve) => {
    setTimeout(() => {
      const prevBtn = document.getElementsByClassName("fc-button-prev")[0]
      prevBtn.click()
      console.log('CALENDAR CLICK')
      resolve()
    }, timeLeft)
  })
}

function greenBtnTrigger(greenBtn) {
  return new Promise((resolve) => {
    const day = $(greenBtn);
    console.log(day);
    const down = new $.Event("mousedown");

    down.which = 1;
    down.pageX = day.offset().left;
    down.pageY = day.offset().top;
    day.trigger(down);
    console.log('green button click');
    resolve();
  })
}

async function start() {
  console.log('start');
  const realConfirm = window.confirm;

  window.confirm = function () {
    console.log('confirmation alert skip');
    window.confirm = realConfirm;
    return true;
  };
  console.log('added confirm skip');

  if (useTimer) {
    await toPrevMonth();
  }

  const greenBtn = await findGreenBtn();
  await greenBtnTrigger(greenBtn)

  await findAndClickRadio();
  console.log('radio button click');

  await findConfirmationButton();
  console.log('confirmation button click');


  const time = new Date()

  console.log('sent request with ' + time.getSeconds() + 'seconds and ' + time.getMilliseconds() + 'milliseconds')
}

start();


