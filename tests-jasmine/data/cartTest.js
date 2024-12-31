import { addToCart, cart, loadFormStorage, removeFromCart, updateDeliveryOption } from '../../data/cart.js';

describe('test suite: addToCart', () => {

  let mockSelect;

  // Reset the cart and localStorage before each test
  beforeEach(() => {
    mockSelect = { value: '1' }; // Simulate input with quantity 1

    // Mock localStorage for both tests, starting with an empty or existing cart
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]); // Default to an empty cart unless otherwise specified
    });
    spyOn(localStorage, 'setItem').and.callFake(() => {}); // Mock setItem

    // Mock the document.querySelector to return a fake input element
    spyOn(document, 'querySelector').and.returnValue(mockSelect);

    loadFormStorage();
  });

  it('checks if product is already in the cart', () => {

    // Change the localStorage mock to simulate a product already in the cart
    localStorage.getItem.and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '2'
      }]); // Simulate a cart with an existing product
    });

    loadFormStorage();

    // Add the same product, which should increase its quantity
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    // Check if the product's quantity is updated in the cart
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2); // Quantity should be incremented to 2
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '2'
    }]));
  });

  it('adds a new product to the cart', () => {
    // This test uses the default mock where localStorage returns an empty cart

    // Add a new product to the cart
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    // Check if the cart now contains one item with the correct quantity
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1); // Starting with quantity 1
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '1'
    }]));
  });

});

describe('test suite: removeFromCart', () => {
  beforeEach(() => {
    //Mock the localStorage
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
        quantity: 4,
        deliveryOptionId: '1'
      }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }]);
    });
    loadFormStorage();
  });

  it('removes a product from the cart', () => {
    removeFromCart('83d4ca15-0f35-48f5-b7a3-1ea210004f2e');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[0].productid).not.toEqual('83d4ca15-0f35-48f5-b7a3-1ea210004f2e');
  });

  it('does nothing if product is not in the cart', () => {
    removeFromCart('non-existent-product-id');

    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual('83d4ca15-0f35-48f5-b7a3-1ea210004f2e');
    expect(cart[1].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});

describe('test suite: updateDeliveryOption', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
        quantity: 4,
        deliveryOptionId: '1'
      }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }]);
    });
    loadFormStorage();
  });
  it('updates the delivery option of a product in the cart', () => {
    updateDeliveryOption('83d4ca15-0f35-48f5-b7a3-1ea210004f2e', '2');

    expect(cart[0].deliveryOptionId).toEqual('2');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('update a delivery option of a product that is not in the cart', () => {
    updateDeliveryOption('non-existent-product-id', '2');

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('use deliveryOption that doesnt exist', () => {
    updateDeliveryOption('83d4ca15-0f35-48f5-b7a3-1ea210004f2e', 'doesnt-not-exist');

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('1');
    expect(cart[0].quantity).toEqual(4);
  });

});
