// Mock products data
const products = [
    { id: 1, name: 'iPhone 15 Pro', category: 'phones', price: 99900, emoji: '📱' },
    { id: 2, name: 'MacBook Pro M3', category: 'laptops', price: 199900, emoji: '💻' },
    { id: 3, name: 'AirPods Pro 2', category: 'headphones', price: 24900, emoji: '🎧' },
    { id: 4, name: 'Samsung Galaxy S24', category: 'phones', price: 79900, emoji: '📱' },
    { id: 5, name: 'Dell XPS 13', category: 'laptops', price: 129900, emoji: '💻' },
    { id: 6, name: 'Sony WH-1000XM5', category: 'headphones', price: 34900, emoji: '🎧' },
    { id: 7, name: 'Wireless Charger', category: 'accessories', price: 2990, emoji: '🔌' },
    { id: 8, name: 'Apple Watch Ultra', category: 'accessories', price: 79900, emoji: '⌚' }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const overlay = document.createElement('div');

// Initialize
overlay.className = 'overlay';
document.body.appendChild(overlay);

renderProducts();
updateCartUI();

// Events
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderProducts();
    });
});

function renderProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">${product.category.toUpperCase()}</div>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" 
                        id="add-${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    updateAddButton(productId, true);
    
    // Visual feedback
    const btn = document.getElementById(`add-${productId}`);
    btn.textContent = 'Added!';
    setTimeout(() => {
        btn.textContent = 'Add to Cart';
        updateAddButton(productId, false);
    }, 1500);
}

function updateAddButton(productId, disabled) {
    const btn = document.getElementById(`add-${productId}`);
    btn.disabled = disabled;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderProducts(); // Re-enable add buttons
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function renderCartItems() {
    if (cart.length === 0) {
        return '<p style="text-align: center; color: var(--text-secondary);">Your cart is empty</p>';
    }
    
    return cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="qty-btn" style="margin-left: auto; background: #ef4444; color: white;" onclick="removeFromCart(${item.id})">×</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartUI() {
    cartItems.innerHTML = renderCartItems();
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPrice.textContent = `₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) return;
    
    alert(`Order placed successfully! Total: ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}`);
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Overlay click to close
overlay.addEventListener('click', toggleCart);
