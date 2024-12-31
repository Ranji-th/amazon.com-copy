import { loadFormStorage, cart, updateDeliveryOption } from '../../data/cart.js';
import { renderOrderSummary } from '../../script/checkout/orderSummary.js';
import {  loadProductsFetch } from '../../data/products.js';


describe('test suite: renderOrderSummary', () => {
  const productId1 = '83d4ca15-0f35-48f5-b7a3-1ea210004f2e';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeAll(async () => {
    await loadProductsFetch();
  });

  beforeEach(() => {
    /*
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 4,
        deliveryOptionId: '1'
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '2'
      }]);
    });
    */

    cart = [{
      productId: productId1,
      quantity: 4,
      deliveryOptionId: '1'
    }, {
      productId: productId2,
      quantity: 1,
      deliveryOptionId: '2'
    }]

    loadFormStorage();
  });

  afterAll(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('display orders', () => {
    renderOrderSummary();
    //console.log('Cart data loaded:', cart);

    expect(cart.length).toEqual(2);

    expect(
      document.querySelectorAll('.js-test-cart-item').length
    ).toEqual(2);

    expect(
      document.querySelector(`.js-test-product-quantity-${productId1}`).innerText
    ).toContain('Quantity: 4');

    expect(
      document.querySelector(`.js-test-product-quantity-${productId2}`).innerText
    ).toContain('Quantity: 1');

    //expect(cart[0].name).toEqual('Adults Plain Cotton T-Shirt - 2 Pack');
    expect(
      document.querySelector(`.js-test-product-details-${productId1}`).innerText
    ).toContain('Adults Plain Cotton T-Shirt - 2 Pack');

    expect(
      document.querySelector(`.js-test-product-details-${productId1}`).innerText
    ).toContain('$7.99');
  });

  it('Remove a product', () => {
    renderOrderSummary();
    document.querySelector(`.js-test-delete-cartItems${productId1}`).click();

    expect(
      document.querySelectorAll('.js-test-cart-item').length
    ).toEqual(1);
    expect(
      document.querySelector(`.js-test-delete-cartItems${productId1}`)
    ).toEqual(null);
    expect(
      document.querySelector(`.js-test-delete-cartItems${productId2}`)
    ).not.toEqual(null);

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });

  it('updating the delivery option', () => {
    renderOrderSummary();

    document.querySelector(`.js-test-delivery-option-${productId1}-3`).click();

    expect(
      document.querySelector(`.js-test-delivery-option-input-${productId1}-3`).checked
    ).toEqual(true);
    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(
      document.querySelector(`.js-test-shipping-price`).innerText
    ).toEqual('$14.98');
    expect(
      document.querySelector('.js-test-total-price').innerText
    ).toEqual('$74.68')
  });
});