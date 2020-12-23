const form = document.getElementById('form'),
  formInputs = form.querySelectorAll('input');

let valid = false;

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


const isValid = event => {
  event.preventDefault(); // отменяем стандартное поведение браузера

  if (event.type === 'input') { // если тип эвента input
    // если value у таргета пустое то подсвечиваем бордер красным, иначе цвет по-умолчанию 
    event.target.value.trim() === '' ? event.target.style.border = '1px solid red' : event.target.style.border = '1px solid #b99150';
    // перебираем все инпуты, если value не пустое, то устанавливаем флаг true, иначе false
    formInputs.forEach(input => input.value.trim !== '' ? valid = true : valid = false);
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
    // если флаг валидации true, то делаем отправку формы, иначе ничего
    valid === true ? sendForm() : null;
  }

};


form.addEventListener('input', isValid);

form.addEventListener('submit', isValid);
