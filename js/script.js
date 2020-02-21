document.addEventListener('DOMContentLoaded', () => {

  const DAY_STRING = ['день', 'дня', 'дней'];

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
      [2, 10],
      [4, 14],
      [7, 21]
    ],
    deadlinePercent: [10, 12, 9]
  }

  const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum'),
    adapt = document.getElementById('adapt'),
    mobileTemplates = document.getElementById('mobileTemplates'),
    desktopTemplates = document.getElementById('desktopTemplates'),
    editable = document.getElementById('editable'),
    adaptValue = document.querySelector('.adapt_value'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    typeSite = document.querySelector('.type-site'),
    maxDeadLine = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    calcDescription = document.querySelector('.calc-description'),
    analyticsGoogle = document.getElementById('analyticsGoogle'),
    sendOrder = document.getElementById('sendOrder'),
    cardHead = document.querySelector('.card-head'),
    totalPrice = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset');


  function declOfNum(n, titles) {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
      0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
  }

  function showElem(elem) {
    elem.style.display = 'block';
  }

  function hideElem(elem) {
    elem.style.display = 'none';
  }

  function dopOptionsString() {
    // Подключим Гугл Аналитику и отправку заявок на почту.
    let str = '';

    if (analyticsGoogle.checked || sendOrder.checked) {
      str += 'Подключим';

      if (analyticsGoogle.checked) {
        str += ' Гугл Аналитику';
      }
      if (analyticsGoogle.checked && sendOrder.checked) {
        str += ' и ';
      }
      if (sendOrder.checked) {
        str += ' отправку заявок на почту';
      }
    }

    return str;
  }

  function renderTextContent(total, site, maxDay, minDay) {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadLine.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
    desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${site} ${adapt.checked ? ', адаптированный под мобильные устройства и планшеты' : ''}
    ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика' : ''}.
    ${dopOptionsString()}
    `;
  }

  // Скидання всіх чекбоксів при виборі сайту
  function priceCalculation(elem = {}) {
    let result = 0,
      index = 0,
      options = [],
      site = '',
      maxDeadlineDay = DATA.deadlineDay[index][1],
      minDeadlineDay = DATA.deadlineDay[index][0],
      overPercent = 0;

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
        site = item.dataset.site;
        maxDeadlineDay = DATA.deadlineDay[index][1];
        minDeadlineDay = DATA.deadlineDay[index][0];
      } else if (item.classList.contains('calc-handler') && item.checked) {
        options.push(item.value)
      } else if (item.classList.contains('want-faster') && item.checked) {
        const overDay = maxDeadlineDay - rangeDeadline.value;
        overPercent = overDay * (DATA.deadlinePercent[index] / 100);
      }
    }
    result += DATA.price[index];

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
    result += result * overPercent;
    renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
  }
  // Скидання всіх чекбоксів при виборі сайту

  function handlerCallBackForm(event) {
    const target = event.target;

    if (adapt.checked) {
      mobileTemplates.disabled = false;
    } else {
      mobileTemplates.disabled = true;
      mobileTemplates.checked = false;
    }

    if (target.classList.contains('want-faster')) {
      target.checked ? showElem(fastRange) : hideElem(fastRange);
      priceCalculation(target);
    }

    if (target.classList.contains('calc-handler')) {
      priceCalculation(target);
    }
  };

  function moveBackTotal() {
    if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
      totalPrice.classList.remove('totalPriceBottom');
      firstFieldset.after(totalPrice);
      window.removeEventListener('scroll', moveBackTotal);
      window.addEventListener('scroll', moveTotal);
    }

  }

  function moveTotal() {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200) {
      totalPrice.classList.add('totalPriceBottom');
      endButton.before(totalPrice);
      window.removeEventListener('scroll', moveTotal);
      window.addEventListener('scroll', moveBackTotal);
    }
  }

  startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
    window.addEventListener('scroll', moveTotal);
  })

  endButton.addEventListener('click', () => {
    for (const elem of formCalculate.elements) {
      if (elem.tagName === 'FIELDSET') {
        hideElem(elem);
      }
    }

    cardHead.textContent = 'Заявка на разработку сайта';

    hideElem(totalPrice);

    showElem(total);
  })

  formCalculate.addEventListener('change', handlerCallBackForm);
  priceCalculation();
});