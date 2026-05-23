// Dynamic title animation for the home page
const dynamicTitle = document.getElementById('dynamic-title');
if (dynamicTitle) {
    const titles = [
        'Welcome to Special Gift',
        'Design it. Gift it. Love it.',
        'Make Every Gift Personal'
    ];
    let titleIndex = 0;
    setInterval(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        dynamicTitle.style.opacity = '0';
        dynamicTitle.style.transform = 'translateY(12px)';
        setTimeout(() => {
            dynamicTitle.textContent = titles[titleIndex];
            dynamicTitle.style.opacity = '1';
            dynamicTitle.style.transform = 'translateY(0)';
        }, 280);
    }, 2600);
}

// Reveal animation on scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.14 });
revealElements.forEach(element => revealObserver.observe(element));


// Customer account shown in the header after login
function getSpecialGiftUser() {
    const savedUser = localStorage.getItem('specialGiftUser');
    if (!savedUser) return null;

    try {
        return JSON.parse(savedUser);
    } catch (error) {
        return {
            email: savedUser,
            name: savedUser.split('@')[0]
        };
    }
}

function updateCustomerAccountInHeader() {
    const user = getSpecialGiftUser();
    if (!user) return;

    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (loginLink) {
        loginLink.textContent = `Account: ${user.name}`;
        loginLink.classList.add('customer-account-link');
    }
}

updateCustomerAccountInHeader();

const productGrid = document.getElementById('product-grid');
if (productGrid) {
    const hiddenProducts = JSON.parse(localStorage.getItem('specialGiftHiddenProducts')) || [];
    document.querySelectorAll('#product-grid .product-card').forEach(card => {
        const heading = card.querySelector('h3');
        if (heading && hiddenProducts.includes(heading.textContent.trim())) {
            card.remove();
        }
    });
    const adminProducts = JSON.parse(localStorage.getItem('specialGiftProducts')) || [];
    adminProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card hover-photo';
        card.dataset.name = product.name.toLowerCase();
        card.innerHTML =
            '<img src="' + product.image + '" alt="' + product.name + '" class="zoomable-product">' +
            '<h3>' + product.name + '</h3>' +
            '<p class="price">' + product.price + ' SAR</p>' +
            '<button onclick="location.href=\'product-details.html?item=' +
            encodeURIComponent(product.name) + '&img=' + encodeURIComponent(product.image) +
            '&price=' + product.price + '\'">Customize Now</button>';
        productGrid.appendChild(card);
    });
}

// Product search
const productSearch = document.getElementById('product-search');
const noProducts = document.getElementById('no-products');
if (productSearch) {
    productSearch.addEventListener('input', () => {
        const value = productSearch.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        cards.forEach(card => {
            const name = card.dataset.name || card.textContent.toLowerCase();
            const match = name.includes(value);
            card.style.display = match ? 'block' : 'none';
            if (match) visibleCount++;
        });
        if (noProducts) noProducts.style.display = visibleCount ? 'none' : 'block';
    });
}

// Product details page: dynamic product data from URL
const productTitle = document.getElementById('product-title');
const mainProductImg = document.getElementById('main-product-img');
const displayPrice = document.getElementById('display-price');
const customizationForm = document.getElementById('customization-form');
const params = new URLSearchParams(window.location.search);
const selectedItem = params.get('item') || 'Item';
const selectedImg = params.get('img') || 'box.jfif';
const selectedPrice = Number(params.get('price') || 20);

if (productTitle) productTitle.textContent = `Customize Your ${selectedItem}`;
if (mainProductImg) mainProductImg.src = selectedImg;
if (displayPrice) displayPrice.textContent = `${selectedPrice} SAR`;

// Image interactive effect
if (mainProductImg) {
    mainProductImg.addEventListener('mousemove', (event) => {
        const box = mainProductImg.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        mainProductImg.style.transform = `scale(1.04) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
    });
    mainProductImg.addEventListener('mouseleave', () => {
        mainProductImg.style.transform = 'scale(1) rotateX(0) rotateY(0)';
    });
}

// Add to cart
if (customizationForm) {
    customizationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const upload = document.getElementById('design-upload');
        if (!upload.files.length) {
            alert('Please upload your design before adding the product to cart.');
            return;
        }
        const item = {
            name: selectedItem,
            image: selectedImg,
            price: selectedPrice,
            color: document.getElementById('color').value,
            notes: document.getElementById('notes').value || 'No special instructions',
            quantity: 1
        };
        const cart = JSON.parse(localStorage.getItem('specialGiftCart')) || [];
        cart.push(item);
        localStorage.setItem('specialGiftCart', JSON.stringify(cart));
        alert('Product added to cart successfully!');
        window.location.href = 'cart.html';
    });
}

// Render cart
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
function renderCart() {
    if (!cartItemsContainer) return;
    const cart = JSON.parse(localStorage.getItem('specialGiftCart')) || [];
    cartItemsContainer.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message" style="display:block;">Your cart is empty.</p>';
    }
    cart.forEach((item, index) => {
        const quantity = Number(item.quantity) || 1;
        total += Number(item.price) * quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>Color: ${item.color}</p>
                <p>Notes: ${item.notes}</p>
                <p>Quantity: ${quantity}</p>
                <strong>${Number(item.price) * quantity} SAR</strong>
            </div>
            <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(div);
    });
    if (cartTotal) cartTotal.textContent = `${total} SAR`;
}
function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('specialGiftCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('specialGiftCart', JSON.stringify(cart));
    renderCart();
}
renderCart();

// Login / logout simulation
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const logoutBtn = document.getElementById('logout-btn');

if (loginForm) {
    const savedUser = getSpecialGiftUser();
    if (savedUser) {
        loginMessage.textContent = `Logged in as ${savedUser.name}`;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const customerName = email.split('@')[0];

        if (password.length < 6) {
            loginMessage.textContent = 'Password must be at least 6 characters.';
            return;
        }

        localStorage.setItem('specialGiftUser', JSON.stringify({
            email: email,
            name: customerName
        }));

        loginMessage.textContent = `Logged in successfully as ${customerName}`;
        updateCustomerAccountInHeader();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('specialGiftUser');
        loginMessage.textContent = 'Logged out successfully.';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });
}

// Contact form validation
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if (name.length < 2 || !email.includes('@') || message.length < 10) {
            contactMessage.textContent = 'Please enter a valid name, email, and message of at least 10 characters.';
            return;
        }
        contactMessage.textContent = 'Your message has been sent successfully!';
        contactForm.reset();
    });
}



// Enlarge product image when clicked
const productModal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');

function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('show');
    productModal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.product-card img, .mini-card img').forEach((image) => {
    image.addEventListener('click', () => {
        if (!productModal || !modalImg || !modalTitle) return;
        const card = image.closest('.product-card');
        const miniCard = image.closest('.mini-card');
        const title = card ? card.querySelector('h3').textContent : (miniCard ? miniCard.querySelector('span').textContent : image.alt);
        modalImg.src = image.src;
        modalImg.alt = image.alt;
        modalTitle.textContent = title;
        productModal.classList.add('show');
        productModal.setAttribute('aria-hidden', 'false');
    });
});

if (modalClose) modalClose.addEventListener('click', closeProductModal);
if (productModal) {
    productModal.addEventListener('click', (event) => {
        if (event.target === productModal) closeProductModal();
    });
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProductModal();
});

// Small sparkle effect when clicking buttons and images
function createSparkle(event) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}
document.querySelectorAll('button, .primary-btn, .secondary-btn, .hover-photo img').forEach(element => {
    element.addEventListener('click', createSparkle);
});