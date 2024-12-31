import { validDeliveryOption } from './deliveryOptions.js'


export let cart;

loadFormStorage();

export function loadFormStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [{
      productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
      quantity: 4,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  //let select = document.querySelector(`.js-select-quantity${productId}`);
  let quantity;

  if (quantity === undefined) {
    const select = document.querySelector(`.js-select-quantity${productId}`);
    quantity = select ? select.value : 1;
  }
  
  //const quantity = Number(select.value);
  

  let matchingItem;
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }

  });

  if (matchingItem) {
    matchingItem.quantity += Number(quantity);
  } else {
    cart.push({
      productId,
      quantity: Number(quantity),
      deliveryOptionId: '1' 
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  
  saveToStorage();
}

// created a function which helps to update the quantity
// in save button

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (!matchingItem) {
    return;
  }

  if (!validDeliveryOption(deliveryOptionId)) {
    return;
  }


  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export let products = [];
export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    console.log('loaded cart')
    fun();
  })

  xhr.open('GET', 'https://supersimplebackend.dev/products');
  xhr.send();
}

export async function loadCartFetch() {
  try {
    const response = await fetch('https://supersimplebackend.dev/products');
    const text = await response.json();
    console.log(text);
  } catch (error) {
    console.log('Network error. Please try again later.')
  }
}

// make the cart empty after creating an order.
export function resetCart() {
  cart = [];
  saveToStorage();
}