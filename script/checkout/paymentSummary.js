import {cart, resetCart} from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { updateHeaderCartQuantity } from '../checkout.js';
import { addOrder } from '../../data/orders.js'

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  }); 
  console.log(productPriceCents);
  console.log(shippingPriceCents);

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;
  const quantity = updateHeaderCartQuantity(cart);
  console.log(quantity);

  const paymentSummaryHTML = `
    <div class="product-summary-grid">
      <div>items (${quantity}):</div>
      <div class="payment-summary">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>
    <div class="product-summary-grid">
      <div>Shipping & handling:</div>
      <div class="payment-summary js-test-shipping-price">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>
    <div class="product-summary-grid total-before-tax">
      <div>Total before tax:</div>
      <div class="payment-summary">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>
    <div class="product-summary-grid">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary">
        $${formatCurrency(taxCents)}
      </div>
    </div>
    <div class="product-summary-grid total-summary">
      <div>Order total:</div>
      <div class="payment-summary js-test-total-price">
        $${formatCurrency(totalCents)}
      </div>
    </div>
    <div class="input-section">
      <span>Use UPI</span>
      <input class="checkbox-input" type="checkbox">
    </div>
    <button class="place-order-button js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });
  
        const order = await response.json();
        addOrder(order);
        console.log(order);

      } catch (error) {
        console.log('unexpected error. Try again later');
      }

      // make the cart empty after creating an order.
      resetCart();
      updateHeaderCartQuantity(cart);
      window.location.href = 'orders.html';
    })
}