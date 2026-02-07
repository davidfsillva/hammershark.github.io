// =====================
// 1. ESTADO GLOBAL
// =====================
let cart = JSON.parse(localStorage.getItem('hammershark_cart')) || [];

const elements = {
    cartItems: document.getElementById("cart-items"),
    cartCount: document.getElementById("cart-count"),
    subtotal: document.getElementById("subtotal"),
    total: document.getElementById("total"),
    checkoutBtn: document.getElementById("checkoutBtn"),
    clearCartBtn: document.getElementById("clearCartBtn"), // NOVO
    hero: document.getElementById("inicio"),
    emptyMsg: document.getElementById("empty-cart-msg"),
    cartWrapper: document.getElementById("cart-wrapper")
};

// =====================
// 2. INICIALIZAÇÃO
// =====================
document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
    initHeroSlider();
    initProductSliders();
    initMenuToggle();
    initCheckout();
    initClearCart(); // NOVO
});

// =====================
// 3. HERO SLIDER
// =====================
function initHeroSlider() {
    if (!elements.hero) return;

    const imagensHero = [
        'img/img1.png',
        'img/img2.png',
        'img/img3.png',
        'img/img4.jpg',
        'img/img5.png',
        'img/img7.png',
        'img/img8.png'
    ];

    imagensHero.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    let i = 0;

    setInterval(() => {
        i = (i + 1) % imagensHero.length;
        elements.hero.style.backgroundImage =
            `linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.7)), url('${imagensHero[i]}')`;
    }, 5000);
}

// =====================
// 4. SLIDER PRODUTOS
// =====================
function initProductSliders() {
    document.querySelectorAll('.product').forEach(product => {

        const imgs = product.querySelectorAll('.product-img');
        const prev = product.querySelector('.prev');
        const next = product.querySelector('.next');

        if (!imgs.length) return;

        let index = 0;

        function updateImage() {
            imgs.forEach(img => img.classList.remove('active'));
            imgs[index].classList.add('active');
        }

        if (next) {
            next.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                index = (index + 1) % imgs.length;
                updateImage();
            });
        }

        if (prev) {
            prev.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                index = (index - 1 + imgs.length) % imgs.length;
                updateImage();
            });
        }
    });
}

// =====================
// 5. TAMANHO
// =====================
function selectSize(btn) {
    const parent = btn.closest('.sizes');
    parent.querySelectorAll('button')
        .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// =====================
// 6. CARRINHO
// =====================
function addToCart(name, price, btn) {

    const sizeBtn = btn.closest('.product')
        ?.querySelector('.sizes button.active');

    const size = sizeBtn ? sizeBtn.innerText : "M";

    cart.push({ name, price, size });

    saveCart();
    updateCartUI();
    animateButton(btn);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('hammershark_cart', JSON.stringify(cart));
}

function updateCartUI() {

    if (elements.cartCount) {
        elements.cartCount.innerText = cart.length;
    }

    if (!elements.cartItems) return;

    if (cart.length === 0) {
        if (elements.emptyMsg) elements.emptyMsg.style.display = "block";
        if (elements.cartWrapper) elements.cartWrapper.style.display = "none";
        elements.cartItems.innerHTML = "";
        return;
    }

    if (elements.emptyMsg) elements.emptyMsg.style.display = "none";
    if (elements.cartWrapper) elements.cartWrapper.style.display = "block";

    elements.cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {

        subtotal += item.price;

        const li = document.createElement("li");
        li.className = "cart-item";

        li.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <small style="display:block; color:var(--primary)">
                    TAM: ${item.size}
                </small>
            </div>
            <div style="display:flex; align-items:center; gap:15px;">
                <strong>R$ ${item.price.toFixed(2)}</strong>
                <button onclick="removeFromCart(${index})"
                    style="color:#ff4d4d; border:1px solid #ff4d4d;
                    padding:5px 8px; border-radius:5px;
                    background:none; cursor:pointer;">
                    ✕
                </button>
            </div>
        `;

        elements.cartItems.appendChild(li);
    });

    if (elements.subtotal) {
        elements.subtotal.innerText = subtotal.toFixed(2);
    }

    if (elements.total) {
        elements.total.innerText = subtotal.toFixed(2);
    }
}

// =====================
// 7. BOTÃO ANIMAÇÃO
// =====================
function animateButton(btn) {
    if (!btn) return;

    const originalText = btn.innerText;

    btn.innerText = "Adicionado!";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1200);
}

// =====================
// 8. FINALIZAR WHATSAPP
// =====================
function initCheckout() {

    if (!elements.checkoutBtn) return;

    elements.checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let message = "🦈 *Novo Pedido - Hammershark*%0A%0A";

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}* - Tam: ${item.size} (R$ ${item.price.toFixed(2)})%0A`;
        });

        const totalValue = elements.total
            ? elements.total.innerText
            : "0.00";

        message += `%0A💰 *Total:* R$ ${totalValue}`;
        message += `%0A%0A_Olá! Gostaria de prosseguir com o pagamento._`;

        const phone = "5594993012103";

        window.open(
            `https://wa.me/${phone}?text=${message}`,
            "_blank"
        );
    });
}

// =====================
// 9. ESVAZIAR CARRINHO
// =====================
function initClearCart() {

    if (!elements.clearCartBtn) return;

    elements.clearCartBtn.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("O carrinho já está vazio.");
            return;
        }

        const confirmClear = confirm("Tem certeza que deseja esvaziar o carrinho?");

        if (confirmClear) {
            clearCart();
        }
    });
}

// =====================
// 10. MENU MOBILE
// =====================
function initMenuToggle() {

    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {

        navMenu.classList.toggle('open');

        menuToggle.innerHTML =
            navMenu.classList.contains('open')
                ? '<i class="fa fa-xmark"></i>'
                : '<i class="fa fa-bars"></i>';
    });
}
