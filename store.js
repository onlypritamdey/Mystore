document.addEventListener('alpine:init', () => {
  Alpine.data('store', () => ({
    products: [],
    cart: [],
    isCartOpen: false,

    // --- Derived Values ---
    get cartCount() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    // --- Cart Methods ---
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
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
      } else {
        this.cart.splice(index, 1);
      }
      this.saveCart();
    },

    // --- Checkout ---
    checkout() {
      window.location.href = 'checkout.html';
    },

    // --- Persistence ---
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    loadCart() {
      const saved = localStorage.getItem('cart');
      if (saved) this.cart = JSON.parse(saved);
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
