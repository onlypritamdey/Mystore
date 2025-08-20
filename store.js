// store.js
document.addEventListener('alpine:init', () => {
  Alpine.data('store', () => ({
    products: [],
    cart: [],
    isCartOpen: false,

    // --- Cart Getters ---
    get cartCount() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    // --- Cart Actions ---
    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },
    addToCart(product) {
      let existing = this.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      this.saveCart();
    },
    increaseQty(index) {
      this.cart[index].quantity++;
      this.saveCart();
    },
    decreaseQty(index) {
      if (this.cart[index].quantity > 1) this.cart[index].quantity--;
      else this.cart.splice(index, 1);
      this.saveCart();
    },
    checkout() {
      window.location.href = 'checkout.html';
    },

    // --- Persistence ---
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    loadCart() {
      try {
        const saved = localStorage.getItem('cart');
        this.cart = saved ? JSON.parse(saved) : [];
      } catch (e) {
        this.cart = [];
      }
    },

    // --- Helpers ---
    getStars(rating) {
      let stars = [];
      for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push('full');
        else if (rating >= i - 0.5) stars.push('half');
        else stars.push('empty');
      }
      return stars;
    },

    // --- Init ---
    init() {
      this.loadCart();
      fetch('products.json')
        .then(res => res.json())
        .then(data => { this.products = data })
        .catch(err => console.error("Failed to load products.json:", err));
    }
  }))
});
