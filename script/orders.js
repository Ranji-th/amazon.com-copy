import {orders} from '../data/orders.js';
import { loadProductsFetch, getProduct } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from './utils/money.js';
import {addToCart, cart} from '../data/cart.js';
import { updateHeaderCartQuantity } from './checkout.js';


export async function loadPage() {
  await loadProductsFetch();
  let orderHtml = '';

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format('MMMM D');

    orderHtml += `
      <div class="order-containor">
        <div class="order-details">
          <section class="order-placed">
            <div class="order-date-total">
              <div class="placed-text">
                Order Placed:
              </div>
    
              <div class="date-text">
                ${orderTimeString}
              </div>
            </div>
            

            <div class="order-total">
              <div class="total-text">
                Total:
              </div>
    
              <div class="price-text">
                $${formatCurrency(order.totalCostCents)}
              </div>
            </div>
            
          </section>

          <section class="order-id">
            <div class="order-id-text">
              Order ID:
            </div>

            <div class="id-text">
             ${order.id}
            </div>
          </section>

        </div>

        <div class="products">
          ${productsListHTML(order)}
        </div>
      </div>
    `;
  });

  function productsListHTML(order) {
    let productsListHTML = '';
  
    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);
  
      productsListHTML += `
        <div class="product-imag">
          <img class="image" src="${product.image}">
        </div>
  
        <div class="product-details">
  
          <div class="product-name">
            ${product.name}
          </div>
  
          <div class="product-delivered-date">
            Arriving on: ${
              dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')
            }
          </div>
  
          <div class="product-qunatity">
            Quantity: ${productDetails.quantity}
          </div>
  
          
          <button class="buy-button js-buy-it-again" 
          data-product-id="${product.id}">
            <img class="buy-again-img" src="images/icons/buy-again.png">
            <span class="buy-it-again">Buy it again</span>
          </button>
        </div>
  
        <div class="track-saparatly">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-button">
              Track package
            </button>  
          </a>
        </div>
      `;
    });
    return productsListHTML;
  }

  document.querySelector('.js-order-html')
    .innerHTML = orderHtml;

  document.querySelectorAll('.js-buy-it-again')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        const order = orders.find((order) => {
          return order.products.find((product) => {
            return product.productId === productId;
          });
        });
        addToCart(productId, order.quantity);

        button.innerHTML = '✔ Added';
        setTimeout(() => {
          button.innerHTML = `
            <img class="buy-again-img" src="images/icons/buy-again.png">
            <span class="buy-it-again">Buy it again</span>
          `;
        }, 1000);
      });
    });

  updateHeaderCartQuantity(cart);
}
loadPage();

