import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((options) => {
    if (options.id === deliveryOptionId) {
      deliveryOption = options;
    }
  });

  return deliveryOption || deliveryOptions[0];
}

export function validDeliveryOption(deliveryOptionId) {
  let found = false;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      found = true;
    }
  });

  return found;
}
// some online stores don't deliver on the weekend (saturday/sunday)
// check is weekend
function isWeekend(date) {
  const dayOfWeek = date.format('dddd');
  return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
}

// calculating date
export function calculateDeliveryDate(deliveryOption) {
  //const today = dayjs();
  //const deliveryDate = today.add(
  //  deliveryOption.deliveryDays,
  //  'days'
  //);
  let remainingDays = deliveryOption.deliveryDays;
  let deliveryDate = dayjs();

  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, 'day');

    if (!isWeekend(deliveryDate)) {
      remainingDays--;
      // This is a shortcut for;
      // remainingDays = remainingDays - 1;
    }
  }
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  );
  
  return dateString;
}

