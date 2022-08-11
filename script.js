function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
}

function findGreenBtn() {
  return new Promise((resolve, reject) => {
    const mutationNode = document.querySelector("div[class='fc-content']");

    const observer = new MutationObserver((mutations, observer) => {
      const dayButton = document.querySelector("td[style='background-color: rgb(188, 237, 145); cursor: pointer;']");

      if (dayButton) {
        observer.disconnect();
        resolve(dayButton);
      }
    });

    observer.observe(mutationNode, {attributes: true, childList: true, subtree: true});
  })
}

function findRadio(path) {
  return new Promise((resolve, reject) => {
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
  const gereenBtn = await findGreenBtn();
  const day = $(gereenBtn);
  const down = new $.Event("mousedown");

  down.which  = 1;
  down.pageX  = day.offset().left;
  down.pageY  = day.offset().top;
  day.trigger(down);

  const radioBtn = await findRadio("//input[@type='radio']");
  radioBtn.click();

  const confirmationBtn = await findConfirmationButton("//*[@id='btnConfirm']");

  if (radioBtn.checked) {
    setTimeout(() => confirmationBtn.click(), 0);
  }
}

const realConfirm = window.confirm;
window.confirm = function () {
  console.log('confirm function');
  window.confirm = realConfirm;
  return true;
};

const realPrompt= window.prompt;
window.prompt = function () {
  console.log('prompt function');
  window.prompt = realPrompt;
  return true;
};

document.addEventListener('keydown', function (ev) {
  if (ev.which === 32) {
    start();
  }
});

start()


