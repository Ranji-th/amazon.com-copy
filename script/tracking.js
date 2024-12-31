import { loadProductsFetch } from '../data/products.js';
import { getOrder } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {cart} from '../data/cart.js';


export async function loadTrackingPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  // Get additional details about the product like
  // the estimated delivery time.
  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  // Display "delivered" on the tracing page
  // if today's date is past the delivery date.
  const deliveredMessage = today < deliveryTime ? 'Arriving on ' : 'Delivered on';
   
  const trackingHTML = `
    <a href="orders.html">View all orders</a>
    <h2>${deliveredMessage} ${
      dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')
    }
    </h2>
    <p>
      ${product.name}
    </p>
    <p>Quantity: ${productDetails.quantity}</p>
    <div class="product-img-container">
      <img class="product-img" src="${product.image}">
    </div>

    <div class="order-status">
      <p class="progress-label ${
        percentProgress < 50 ? 'current-status' : ''
      }">Preparing</p>
      <p class="progress-label ${
        (percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''
      }">Shipped</p>
      <p class="progress-label ${
        percentProgress > 100 ? 'current-status' : ''
      }">Delivered</p>
    </div>
    <div class="order-prograss"> 
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  document.querySelector('.js-tracking-product')
    .innerHTML = trackingHTML;
}
loadTrackingPage();

document.querySelector('.js-cart-quantity')
  .innerHTML = cart.length;