import {cart, addToCart} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  let productHTML = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  // If a search exists in the URL parameters,
  // filter the products that match the search.
  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeyWord = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyWord = true;
        }
      });

      return matchingKeyWord || 
        product.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  filteredProducts.forEach((product) => {
    productHTML += `
      <div class="product-containor">
        <div class="product-image-containor">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name display-in-two-lines">
          ${product.name}
        </div>
        
        <div class="rating">
          <img class="stars" src="${product.getStartUrl()}">
          <span class="vote">${product.rating.count}</span>
        </div>

        <div class="price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-selector">
          <select class="
            quantity js-select-quantity${product.id}
          ">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="check-mark js-check-mark-section-${product.id}">
          <img class="check-mark-icon" src="images/icons/checkmark.png">
          <div class="added">
            Added
          </div>
        </div>
        
        <button class="add-to-cart-button js-add-to-cart-button"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-product-grid')
    .innerHTML = productHTML;

  function updateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((item) => {
      cartQuantity += item.quantity;
    })
    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
  }

  updateCartQuantity();

  document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${search}`;
    });

  // We're going to use an object to save the timeout ids.
  // The reason we use an object is because each product
  // will have its own timeoutId. So an object lets us
  // save multiple timeout ids for different products.
  // For example:
  // {
  //   'product-id1': 2,
  //   'product-id2': 5,
  //   ...
  // }
  // (2 and 5 are ids that are returned when we call setTimeout).
  const addedMessageTimeout = {};

  document.querySelectorAll('.js-add-to-cart-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const { productId } = button.dataset;

        addToCart(productId);
        updateCartQuantity();

        const addedMessage = document.querySelector(`.js-check-mark-section-${productId}`);

        addedMessage.classList.add('display-check-mark');

        // Check if there's a previous timeout for this
        // product. If there is, we should stop it.
        const previousTimeoutId = addedMessageTimeout[productId];
        if (previousTimeoutId) {
          clearTimeout(previousTimeoutId);
        }

        const timeoutId = setTimeout(() => {
          addedMessage.classList.remove('display-check-mark');
        }, 2000);
        
        // Save the timeoutId for this product
        // so we can stop it later if we need to.
        addedMessageTimeout[productId] = timeoutId;
          
        console.log(addedMessage);
        console.log(cartQuantity);
        console.log(cart);
      });
    });


  // searching by pressing "Enter" on the keyboard.
  document.querySelector('.js-search-bar')
    .addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const searchTerm = document.querySelector('.js-search-bar').value;
        window.location.href = `amazon.html?search=${searchTerm}`;
      }
    });
}