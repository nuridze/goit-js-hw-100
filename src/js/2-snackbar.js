
import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const formEl = document.querySelector('.form');
formEl.addEventListener('submit', createPromise);

function createPromise(e) {
  e.preventDefault();

  const storedObj = {
    delay: parseInt(formEl.elements.delay.value),
    state: formEl.elements.state.value,
  };

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (storedObj.state === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${storedObj.delay}ms`);
      } else {
        reject(`❌ Rejected promise in ${storedObj.delay}ms`);
      }
    }, storedObj.delay);
  });

  promise
    .then(result => {
      iziToast.success({
        position: 'topRight',
        message: result,
      });
    })
    .catch(error => {
      iziToast.error({
        position: 'topRight',
        message: error,
      });
    });
}