const form = document.getElementById('form'),
  formInputs = form.querySelectorAll('input');

form.addEventListener('input', e => {
  const target = e.target;
  if (target.matches('input[name="name"]')) {
    target.value = target.value.replace(/[^а-яa-zA-ZА-ЯёЁё\-]/g, '');
  }
  if (target.matches('input[name="phone"]')) {
    target.value = target.value.replace(/[^\d+]/g, '');
  }
});

const formHelper = () => {
  popup.style.display = 'block';
  form.reset();
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
};

const sendForm = () => {
  const formData = new FormData(form);

  let body = {};

  formData.forEach((val, key) => {
    body[key] = val;
  });

  const postData = body => {
    return fetch('./server.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  };

  postData(body).then(response => {
    if (response.status !== 200) {
      throw new Error('status network not 200.');
    }
    formHelper();
  }).catch(error => {
    popupTitle.textContent = 'Ошибка! Свяжитесь по телефону';
    formHelper();
    console.error(error)
  });
};

popupBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});


let valid = false;

const validateCurrentInput = (event, inputs = []) => {
  if (event.type === 'input') { // если тип эвента input
    if (event.target.name === 'name') { // replace для поля name
      event.target.value = event.target.value.replace(/[^а-яa-zA-ZА-ЯёЁё\- ]/g, '');
    }
    if (event.target.name === 'phone') { // replace для поля phone
      event.target.value = event.target.value.replace(/[^+\-\(\)\d]/g, '');
    }
  } else if (event.type === 'submit') { // если тип эвента sumbit
    // перебираем все инпуты и добавляем регулярки на test
    inputs.forEach(input => {
      if (input.name === 'name' && !/^[а-яa-zA-ZА-ЯёЁ\.\,\!\?]{2,15}\s{0,1}-{0,1}[а-яa-zA-ZА-ЯёЁ\.\,\!\?]{0,15}$/.test(input.value)) {
        valid = false;
        input.style.border = '1px solid red';
      } else if (input.name === 'name' && /^[а-яa-zA-ZА-ЯёЁ\.\,\!\?]{2,15}\s{0,1}-{0,1}[а-яa-zA-ZА-ЯёЁ\.\,\!\?]{0,15}$/.test(input.value)) {
        input.style.border = '1px solid #b99150';
      }
      if (input.name === 'phone' && !/\+?[78]([-()]*\d){10}$/.test(input.value)) {
        valid = false;
        input.style.border = '1px solid red';
      } else if (input.name === 'phone' && /\+?[78]([-()]*\d){10}$/.test(input.value)) {
        input.style.border = '1px solid #b99150';
      }
    })
  }
};

const isValid = event => {
  event.preventDefault(); // отменяем стандартное поведение браузера

  if (event.type === 'input') { // если тип эвента input
    // если value у таргета пустое то подсвечиваем бордер красным, иначе цвет по-умолчанию 
    event.target.value.trim() === '' ? event.target.style.border = '1px solid red' : event.target.style.border = '1px solid #b99150';
    // перебираем все инпуты, если value не пустое, то устанавливаем флаг true, иначе false
    formInputs.forEach(input => input.value.trim !== '' ? valid = true : valid = false);
    // вызов функции валидатора
    validateCurrentInput(event);
  } else if (event.type === 'submit') { // если тип эвента submit
    // получаем все элементы у которых локальное имя input
    let inputCollection = [...event.target.elements].filter(item => item.localName === 'input');
    // перебираем все полученные элементы
    inputCollection.forEach(item => {
      // если значение у определенного инпута пустое, то устанавливаем флаг false, иначе null
      item.value === '' ? valid = false : null;
      // если значение у определенного инпута пустое, то устанавливаем красный бордер, иначе цвет по-умолчанию 
      item.value.trim() === '' ? item.style.border = '1px solid red' : item.style.border = '1px solid #b99150';
    });
    // вызываем валидацию и передаем туда коллекцию инпутов
    validateCurrentInput(event, inputCollection);
    // если флаг валидации true, то делаем отправку формы, иначе ничего
    valid === true ? sendForm() : null;
  }

};

form.addEventListener('input', isValid);

form.addEventListener('submit', isValid);
