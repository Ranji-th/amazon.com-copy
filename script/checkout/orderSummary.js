import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption
} from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate
} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { updateHeaderCartQuantity } from '../checkout.js';


// rendering the order summary
export function renderOrderSummary() {
  
  // created a variable to 
  // store the cart summary
  let cartSummaryHTML = '';

  // looping through every cart item
  cart.forEach((cartItem) => {
    const { productId } = cartItem;

    // getting matching product
    const matchingProduct = getProduct(productId);

    // Looping through dates to get delivery date 
    // which we choose in delivery option
    const deliveryOptionId = cartItem.deliveryOptionId;

    // getting delivery option 
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    // calculating date and skip weekend
    const dateString = calculateDeliveryDate(deliveryOption);


    // rendering cart summary
    cartSummaryHTML += `
      <div class="product-containor 
        js-test-cart-item
        js-cart-item-containor-${matchingProduct.id}">
        <div class="order-delivery-text">
          Delivery date: ${dateString}
        </div>

        <div class="product-orders-grid">
          <div class="product-image">
            <img class="product" src="${matchingProduct.image}">
          </div>
          <div class="product-details 
            js-test-product-details-${matchingProduct.id}">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="quantity-delete 
              js-test-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: 
                <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-text js-update-link"
              data-product-id="${matchingProduct.id}">
                Update
              </span>

              <input class="quantity-input 
                js-quantity-input-${matchingProduct.id}"
                type="number" value="${cartItem.quantity}" min="1" max="20">
              <span class="quantity-save-link link-primary js-save-link"
              data-product-id="${matchingProduct.id}">Save</span>
              
              <span class="delete-text 
                js-delete-cartItems 
                js-test-delete-cartItems${matchingProduct.id}"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>
          <div class="choose-delivery-containor">
            <div class="choose-delivery-text">
              Choose a delivery option: 
            </div>

            <div class="choose-day-containor">
              ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // displaying the cart summary by using dom
  document.querySelector('.js-cart-items')
    .innerHTML = cartSummaryHTML;


  // creating delivery Option for every cart product
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      // calculating date and skiping weekends
      const dateString = calculateDeliveryDate(deliveryOption);

      // calculating delivery price
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}-`;

      // choosing the delivery option and marking it checked
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      // rendering delivery option
      html += ` 
        <div class="day-flex 
          js-delivery-option
          js-test-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <div class="checkbox-date">
            <input type="radio"
              ${isChecked ? 'checked' : ''}
              class="checkbox-input
                js-test-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
              name="delivery-option-${matchingProduct.id}">
          </div>
          <div class="day-shipping">
            <div class="day-text">
              ${dateString}
            </div>
            <div class="free-delivery-ornot">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });
    return html;
  }

  // change the delivery option when clicked
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;

        // updating delivery option
        updateDeliveryOption(productId, deliveryOptionId);

        // rerendering cart
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  // delete button
  document.querySelectorAll('.js-delete-cartItems')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;

        // removing product from cart
        removeFromCart(productId);

        // rendering cart
        updateHeaderCartQuantity(cart);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  // update link / modifies the quantity of products in cart
  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        const container = document.querySelector(`.js-cart-item-containor-${productId}`);

        // removes quantity label 
        // and display quantity input
        // and quantity save link.
        container.classList.add('is-editing-quantity');

        // remove update button
        container.classList.add('is-update-disapear');

        // recalculating the payment summary
        renderPaymentSummary();
      });
    });

  // save button 
  // re-add update link / modifies the quantity
  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        const container = document.querySelector(`.js-cart-item-containor-${productId}`);

        // removes quantity-input and quantity save link
        container.classList.remove('is-editing-quantity');
        
        // re-add update link
        container.classList.remove('is-update-disapear');

        // quantity input extrating value 
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(quantityInput.value);

        // Here's an example of a feature we can add: validation.
        // Note: we need to move the quantity-related code up
        // because if the new quantity is not valid, we should
        // return early and NOT run the rest of the code. This
        // technique is called an "early return".

        if (newQuantity >= 20) {
          alert('The stock of the product is over.\nWe will notify you once the stock has arrived.');
          return;
        }

        // adding the value of quantity input to quantity label
        updateQuantity(productId, newQuantity);

        document.querySelector(`.js-quantity-label-${productId}`)
          .innerHTML = newQuantity;
        
        if (newQuantity <= 0) {
          container.remove();
        }
        // recalculating the header items;
        updateHeaderCartQuantity(cart);

        // recalculating the payment summary
        renderPaymentSummary();
      });
    });
}