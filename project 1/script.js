// Sample product data (in a real app, this would come from data.json)
const productsData = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Smartphone",
        description: "Latest smartphone with advanced camera and long battery life",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Laptop",
        description: "Powerful laptop for work and gaming",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Coffee Maker",
        description: "Automatic coffee maker with programmable settings",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Running Shoes",
        description: "Comfortable running shoes with excellent support",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Backpack",
        description: "Durable backpack with multiple compartments",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
    }
];

// Cart state
let cart = [];
let cartTotal = 0;

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartElement = document.getElementById('cart');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartTotalElement = document.getElementById('cartTotal');
const confirmOrder = document.getElementById('confirmOrder');
const modalOverlay = document.getElementById('modalOverlay');
const confirmationModal = document.getElementById('confirmationModal');
const modalClose = document.getElementById('modalClose');
const startNewOrder = document.getElementById('startNewOrder');
const modalOrderSummary = document.getElementById('modalOrderSummary');

// Templates
const productTemplate = document.getElementById('productTemplate');
const cartItemTemplate = document.getElementById('cartItemTemplate');

// Initialize the application
function init() {
    loadProducts();
    setupEventListeners();
    updateCartDisplay();
}

// Load and display products
function loadProducts() {
    productsGrid.innerHTML = '';
    
    productsData.forEach(product => {
        const productElement = createProductElement(product);
        productsGrid.appendChild(productElement);
    });
}

// Create a product element from template
function createProductElement(product) {
    const template = productTemplate.content.cloneNode(true);
    const productElement = template.querySelector('.product');
    
    productElement.dataset.productId = product.id;
    productElement.querySelector('.product__img').src = product.image;
    productElement.querySelector('.product__img').alt = product.name;
    productElement.querySelector('.product__title').textContent = product.name;
    productElement.querySelector('.product__description').textContent = product.description;
    productElement.querySelector('.product__price').textContent = formatPrice(product.price);
    
    const addButton = productElement.querySelector('.product__add-btn');
    addButton.addEventListener('click', () => addToCart(product));
    
    return productElement;
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Update cart display
function updateCart() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
    updateCartVisibility();
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
}

// Update cart items display
function updateCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        return;
    }
    
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItems.appendChild(cartItemElement);
    });
}

// Create a cart item element from template
function createCartItemElement(item) {
    const template = cartItemTemplate.content.cloneNode(true);
    const cartItemElement = template.querySelector('.cart-item');
    
    cartItemElement.dataset.productId = item.id;
    cartItemElement.querySelector('.cart-item__img').src = item.image;
    cartItemElement.querySelector('.cart-item__img').alt = item.name;
    cartItemElement.querySelector('.cart-item__title').textContent = item.name;
    cartItemElement.querySelector('.cart-item__price').textContent = formatPrice(item.price);
    cartItemElement.querySelector('.quantity-value').textContent = item.quantity;
    
    // Quantity controls
    const decreaseBtn = cartItemElement.querySelector('.quantity-btn--decrease');
    const increaseBtn = cartItemElement.querySelector('.quantity-btn--increase');
    
    decreaseBtn.addEventListener('click', () => updateQuantity(item.id, -1));
    increaseBtn.addEventListener('click', () => updateQuantity(item.id, 1));
    
    // Remove button
    const removeBtn = cartItemElement.querySelector('.cart-item__remove');
    removeBtn.addEventListener('click', () => removeFromCart(item.id));
    
    return cartItemElement;
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart total
function updateCartTotal() {
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = formatPrice(cartTotal);
}

// Update cart visibility
function updateCartVisibility() {
    const hasItems = cart.length > 0;
    cartEmpty.style.display = hasItems ? 'none' : 'block';
    cartSummary.style.display = hasItems ? 'block' : 'none';
}

// Show cart notification
function showCartNotification() {
    cartButton.classList.add('cart-button--pulse');
    setTimeout(() => {
        cartButton.classList.remove('cart-button--pulse');
    }, 300);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Show cart
function showCart() {
    cartElement.classList.add('cart--open');
    document.body.classList.add('body--cart-open');
    
    // Focus management
    setTimeout(() => {
        cartClose.focus();
    }, 100);
}

// Hide cart
function hideCart() {
    cartElement.classList.remove('cart--open');
    document.body.classList.remove('body--cart-open');
    
    // Return focus to cart button
    cartButton.focus();
}

// Show confirmation modal
function showConfirmationModal() {
    modalOverlay.classList.add('modal-overlay--visible');
    confirmationModal.classList.add('modal--visible');
    
    // Populate order summary
    populateOrderSummary();
    
    // Focus management
    setTimeout(() => {
        modalClose.focus();
    }, 100);
}

// Hide confirmation modal
function hideConfirmationModal() {
    modalOverlay.classList.remove('modal-overlay--visible');
    confirmationModal.classList.remove('modal--visible');
}

// Populate order summary in modal
function populateOrderSummary() {
    const summaryHTML = cart.map(item => `
        <div class="order-summary-item">
            <span class="order-summary-item__name">${item.name}</span>
            <span class="order-summary-item__quantity">x${item.quantity}</span>
            <span class="order-summary-item__price">${formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');
    
    modalOrderSummary.innerHTML = `
        <div class="order-summary">
            ${summaryHTML}
            <div class="order-summary-total">
                <strong>Total: ${formatPrice(cartTotal)}</strong>
            </div>
        </div>
    `;
}

// Reset cart
function resetCart() {
    cart = [];
    cartTotal = 0;
    updateCart();
    hideConfirmationModal();
}

// Setup event listeners
function setupEventListeners() {
    // Cart button
    cartButton.addEventListener('click', showCart);
    
    // Cart close button
    cartClose.addEventListener('click', hideCart);
    
    // Confirm order button
    confirmOrder.addEventListener('click', showConfirmationModal);
    
    // Modal close button
    modalClose.addEventListener('click', hideConfirmationModal);
    
    // Start new order button
    startNewOrder.addEventListener('click', resetCart);
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideConfirmationModal();
        }
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartElement.contains(e.target) && !cartButton.contains(e.target) && cartElement.classList.contains('cart--open')) {
            hideCart();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Escape key to close cart or modal
        if (e.key === 'Escape') {
            if (confirmationModal.classList.contains('modal--visible')) {
                hideConfirmationModal();
            } else if (cartElement.classList.contains('cart--open')) {
                hideCart();
            }
        }
        
        // Enter key for buttons
        if (e.key === 'Enter' && e.target.classList.contains('btn')) {
            e.target.click();
        }
    });
    
    // Prevent body scroll when cart is open
    cartElement.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateQuantity,
        formatPrice,
        resetCart
    };
}
