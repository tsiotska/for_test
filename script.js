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

        observer.observe(mutationNode, { attributes: true, childList: true, subtree: true });
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
    // const gereenBtn = await findGreenBtn();
    // gereenBtn.click();

    const radioBtn = await findRadio("//input[@type='radio']");
    radioBtn.click();

    confirmationBtn = await findConfirmationButton("//*[@id='btnConfirm']");

    if (radioBtn.checked) {
        setTimeout(() => confirmationBtn.click(), 0);
    }
  }

  start();