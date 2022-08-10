function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
}

function findGreenBtn() {
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

    if(confButton) {
      resolve(confButton)
    } else {
      reject(new Error("Can't find confirmation button"))
    }
  })
}

async function start() {
  const gereenBtn = await findGreenBtn();
  var day = $(gereenBtn);
  var down = new $.Event("mousedown");
  var up = new $.Event("mouseup");
  down.which = up.which = 1;
  down.pageX = up.pageX = day.offset().left;
  down.pageY = up.pageY = day.offset().top;
  day.trigger(down);
  day.trigger(up);

  const radioBtn = await findRadio("//input[@type='radio']");
  radioBtn.click();

  const confirmationBtn = await findConfirmationButton("//*[@id='btnConfirm']");

  if (radioBtn.checked) {
    setTimeout(() => confirmationBtn.click(), 0);
  }
}

start();
