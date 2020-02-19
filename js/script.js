document.addEventListener('DOMContentLoaded', () => {

  const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [150, 250, 350],
    desktopTemplates: [35, 25, 20],
    adapt: 20,
    mobileTemplates: 15,
    editable: 20,
    analyticsGoogle: [15, 25, 30],
    sendOrder: 10,
    deadlineDay: [
      [2, 7],
      [3, 10],
      [7, 14]
    ],
    deadlinePercent: [20, 17, 15]
  }

  const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum');

  function showElem(elem) {
    elem.style.display = 'block';
  }

  function hideElem(elem) {
    elem.style.display = 'none';
  }

  // Скидання всіх чекбоксів при виборі сайту
  function priceCalculation(elem) {
    let result = 0,
      index = 0,
      options = [];


    if (elem.name === 'whichSite') {
      for (const item of formCalculate.elements) {
        if (item.type === 'checkbox') {
          item.checked = false;
        }
      }
      hideElem(fastRange);
    }

    for (const item of formCalculate.elements) {
      if (item.name === 'whichSite' && item.checked) {
        index = DATA.whichSite.indexOf(item.value);
      } else if (item.classList.contains('calc-handler') && item.checked) {
        options.push(item.value)
      }
    }

    options.forEach(function (key) {
      if (typeof (DATA[key]) === 'number') {
        if (key === 'sendOrder') {
          result += DATA[key]
        } else {
          result += DATA.price[index] * DATA[key] / 100
        }
      } else {
        if (key === 'desktopTemplates') {
          result += DATA.price[index] * DATA.desktopTemplates[index] / 100
        } else {
          result += DATA[key][index]
        }
      }
    })

    result += DATA.price[index];

    totalPriceSum.textContent = result;
  }
  // Скидання всіх чекбоксів при виборі сайту

  function handlerCallBackForm(event) {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
      target.checked ? showElem(fastRange) : hideElem(fastRange);
    }

    if (target.classList.contains('calc-handler')) {
      priceCalculation(target)
    }
  };

  startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
  })

  endButton.addEventListener('click', () => {
    for (const elem of formCalculate.elements) {
      if (elem.tagName === 'FIELDSET') {
        hideElem(elem);
      }
    }
    showElem(total);
  })

  formCalculate.addEventListener('change', handlerCallBackForm);

})