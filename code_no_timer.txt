function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
}

function findGreenBtn() {
  return new Promise((resolve) => {
    const mutationNode = document.querySelector("div[class='fc-content']");

    const dayButton = document.querySelector("td[style='background-color: rgb(188, 237, 145); cursor: pointer;']");

    if (dayButton) {
      console.log('FOUND GREEN (NO OBSERVER)');
      resolve(dayButton);
    }

    const observer = new MutationObserver((mutations, observer) => {
      const dayButton = document.querySelector("td[style='background-color: rgb(188, 237, 145); cursor: pointer;']");

      if (dayButton) {
        console.log('FOUND GREEN (OBSERVER)');
        observer.disconnect();
        resolve(dayButton);
      }
    });

    observer.observe(mutationNode, {attributes: true, childList: true, subtree: true});
  })
}

function findRadio(path) {
  return new Promise((resolve) => {
    const result = getElementByXpath(path)
    result.iterateNext()
    result.iterateNext()
    const dateRadio1 = result.iterateNext()
    const dateRadio2 = result.iterateNext()
    const actualDate = dateRadio2 ?? dateRadio1

    if (actualDate) {
      resolve(actualDate);
    }
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
  console.log('start');
  const realConfirm = window.confirm;
  window.confirm = function () {
    console.log('confirm function worked');
    window.confirm = realConfirm;
    return true;
  };
  console.log('added confirm skip');

  const realPrompt = window.prompt;
  window.prompt = function () {
    console.log('prompt function worked');
    window.prompt = realPrompt;
    return true;
  };
  console.log('added prompt');

  const greenBtn = await findGreenBtn();
  const day = $(greenBtn);
  console.log('Button found');
  console.log(day);
  const down = new $.Event("mousedown");

  down.which = 1;
  down.pageX = day.offset().left;
  down.pageY = day.offset().top;
  day.trigger(down);
  console.log('green button click');

  const radioBtn = await findRadio("//input[@type='radio']");
  radioBtn.click();

  console.log('radio click');

  const confirmationBtn = await findConfirmationButton("//*[@id='btnConfirm']");
  console.log('confirmation button click');
  if (radioBtn.checked) {
    setTimeout(() => confirmationBtn.click(), 0);
  }
}

document.addEventListener('keydown', function (ev) {
  if (ev.which === 32) {
    start();
  }
});

start()


