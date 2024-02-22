import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const myButtonEl = document.querySelector('button');
const inputEl = document.querySelector('#datetime-picker');
const timerEl = document.querySelector('.timer');
const daysSpan = timerEl.querySelector('[data-days]');
const hoursSpan = timerEl.querySelector('[data-hours]');
const minutesSpan = timerEl.querySelector('[data-minutes]');
const secondsSpan = timerEl.querySelector('[data-seconds]');

let userSelectedDate;
let countdownInterval;
myButtonEl.disabled = true;

function startCountdown() {
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = new Date();
  const remainingTime = userSelectedDate - now;
  if (remainingTime <= 0) {
    stopCountdown();
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(remainingTime);
  daysSpan.textContent = days;
  hoursSpan.textContent = hours;
  minutesSpan.textContent = minutes;
  secondsSpan.textContent = seconds;
}

myButtonEl.addEventListener('click', () => {
  if (userSelectedDate) {
    myButtonEl.disabled = true;
    inputEl.disabled = true;
    startCountdown();
  }
});

const options = {
  enableTime: true,
  time_24hr: true,
  dateFormat: 'Y-m-d H:i',
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < Date.now()) {
      iziToast.error({
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
      myButtonEl.disabled = true;
    } else {
      myButtonEl.disabled = false;
    }
  },
};

function stopCountdown() {
  clearInterval(countdownInterval);
  daysSpan.textContent = '00';
  hoursSpan.textContent = '00';
  minutesSpan.textContent = '00';
  secondsSpan.textContent = '00';
  countdownInterval = null;
  inputEl.disabled = false;
}

const instance = flatpickr(inputEl, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day)
    .toString()
    .padStart(2, '0');
  // Remaining hours
  const hours = Math.floor((ms % day) / hour)
    .toString()
    .padStart(2, '0');
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute)
    .toString()
    .padStart(2, '0');
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second)
    .toString()
    .padStart(2, '0');

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
