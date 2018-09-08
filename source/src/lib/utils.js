/**
* @param date - Date to be formatted, need not be JS date, ISO string would be fine as well
* @param isTimeRequired - If set to true, will also return the time of the day component
*/
export function formatDateTime(date, isTimeRequired) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone:'Asia/Kolkata'
  };
  let formattedDate = '';
  if (isTimeRequired) {
    options.hour = 'numeric';
    options.minute = 'numeric';
    options.second = 'numeric';
  }
  if (date) {
    formattedDate = new Intl.DateTimeFormat('en-IN', options).format(new Date(date));
  }
  return formattedDate;
}

export function getFormattedAmount(amount) {
  if (amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  }
  return '-';
}

export function startLoader() {
  let element = document.getElementById('loader-bg');
  element.style.display = 'block';
}

export function stopLoader() {
  let element = document.getElementById('loader-bg');
  element.style.display = 'none';
}
