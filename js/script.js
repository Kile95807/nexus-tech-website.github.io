document.addEventListener('DOMContentLoaded', function() {

    /*=============== PRELOADER ===============*/
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('preloader-hidden');
    });

    /*=============== MOBILE MENU ===============*/
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.classList.contains('show-menu')) {
            return;
        }
        const isClickInsideMenu = e.target.closest('#nav-menu');
        const isClickOnToggle = e.target.closest('#nav-toggle');
        if (!isClickInsideMenu && !isClickOnToggle) {
            navMenu.classList.remove('show-menu');
        }
    });

    /*=============== HEADER SCROLL EFFECT ===============*/
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    /*=============== SCROLL REVEAL ANIMATION ===============*/
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        revealObserver.observe(el);
    });

    /*=============== INTERACTIVE PRODUCT CARDS (HANYA UNTUK DESKTOP) ===============*/
    
    const productCards = document.querySelectorAll('.product-card');
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Cek apakah ini perangkat sentuh atau bukan
    if (isTouchDevice()) {
        // Jika ini adalah perangkat sentuh (HP/Tablet)
        console.log("Perangkat terdeteksi sebagai HP/Tablet (Layar Sentuh). Animasi 3D dinonaktifkan.");
    } else {
        // Jika ini adalah perangkat desktop dengan mouse
        console.log("Perangkat terdeteksi sebagai Desktop (Mouse). Animasi 3D diaktifkan.");
        
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }
    

    /*=============== MODAL VARIAN ===============*/
    const openModalButtons = document.querySelectorAll('[data-modal]');
    const closeModalButtons = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');

    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('modal-active');
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('modal-active');
            }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('modal-active');
            }
        });
    });

    /*=============== LOGIKA KERANJANG BELANJA (CART) & SIDEBAR ===============*/
    
    let cart = []; 
    
    const cartBadge = document.getElementById('cart-badge');
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartCloseButton = cartSidebar.querySelector('.cart-close');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const variantItems = document.querySelectorAll('.variant-item');

    function renderCartItems() {
        cartItemsList.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="cart-empty-message">Keranjang Anda masih kosong.</p>';
            cartTotalPriceElement.textContent = '$0.00';
            return;
        }

        let totalPrice = 0;
        cart.forEach(item => {
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-variant">${item.variant}</span>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-price">${item.price}</span>
                        <i class="fa-solid fa-trash-can cart-item-remove" data-id="${item.id}"></i>
                    </div>
                </div>
            `;
            cartItemsList.innerHTML += itemHTML;

            const priceNumber = parseFloat(item.price.replace('$', '').replace(',', ''));
            totalPrice += priceNumber;
        });

        cartTotalPriceElement.textContent = `$${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    function updateCartIcon() {
        const totalItems = cart.length;
        cartBadge.textContent = totalItems;

        if (totalItems > 0) {
            cartBadge.classList.add('show-badge');
        } else {
            cartBadge.classList.remove('show-badge');
        }
    }
    
    function handleRemoveItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        
        console.log('Item dihapus. Isi keranjang sekarang:', cart);

        renderCartItems();
        updateCartIcon();
    }

    variantItems.forEach(item => {
        item.addEventListener('click', () => {
            const modal = item.closest('.modal');
            const productName = modal.querySelector('.modal-title').textContent;
            const storage = item.dataset.storage;
            const price = item.dataset.price;
            
            const productToAdd = { 
                name: productName, 
                variant: storage, 
                price: price, 
                id: Date.now()
            };
            cart.push(productToAdd);
            
            console.log('Isi Keranjang sekarang:', cart);

            updateCartIcon();
            renderCartItems();
            modal.classList.remove('modal-active');
        });
    });

    cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-remove')) {
            const itemId = parseInt(e.target.dataset.id, 10);
            handleRemoveItem(itemId);
        }
    });

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('cart-sidebar-active');
    });

    cartCloseButton.addEventListener('click', () => {
        cartSidebar.classList.remove('cart-sidebar-active');
    });

    cartSidebar.addEventListener('click', (e) => {
        if (e.target === cartSidebar) {
            cartSidebar.classList.remove('cart-sidebar-active');
        }
    });
    
    updateCartIcon(); 
    renderCartItems();

});