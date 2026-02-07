// =====================
// 1. VARIÁVEIS GLOBAIS
// =====================
let cart = JSON.parse(localStorage.getItem('hammershark_cart')) || [];

const elements = {
    cartItems: document.getElementById("cart-items"),
    cartCount: document.getElementById("cart-count"),
    subtotal: document.getElementById("subtotal"),
    shipping: document.getElementById("shipping"),
    total: document.getElementById("total"),
    checkoutBtn: document.getElementById("checkoutBtn"),
    hero: document.getElementById('inicio')
};

// =====================
// 2. INICIALIZAÇÃO
// =====================
document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
    initHeroSlider();
    initProductSliders();
});

// =====================
// 3. SLIDER HERO (COM PRÉ-CARREGAMENTO)
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

    // Pré-carregamento para evitar fundo preto
    imagensHero.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    let i = 0;
    setInterval(() => {
        i = (i + 1) % imagensHero.length;
        elements.hero.style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('${imagensHero[i]}')`;
    }, 5000);
}

// =====================
// 4. SLIDER DE FOTOS DOS PRODUTOS
// =====================
function initProductSliders() {
    document.querySelectorAll('.product').forEach(product => {
        const imgs = product.querySelectorAll('.product-img');
        const prev = product.querySelector('.prev');
        const next = product.querySelector('.next');
        let idx = 0;

        if (next && prev) {
            next.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                idx = (idx + 1) % imgs.length;
                updateImg();
            };
            prev.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                idx = (idx - 1 + imgs.length) % imgs.length;
                updateImg();
            };
        }

        function updateImg() {
            imgs.forEach(img => img.classList.remove('active'));
            imgs[idx].classList.add('active');
        }
    });
}

// =====================
// 5. LÓGICA DO CARRINHO
// =====================
function selectSize(btn) {
    const parent = btn.closest('.sizes');
    parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function addToCart(name, price, btn) {
    const activeSizeBtn = btn.closest('.product').querySelector('.sizes button.active');
    const size = activeSizeBtn ? activeSizeBtn.innerText : "M";

    cart.push({ name, price, size });
    localStorage.setItem('hammershark_cart', JSON.stringify(cart));
    updateCartUI();

    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "✅ No Carrinho!";
        btn.style.backgroundColor = "#22c55e";
        btn.disabled = true;
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "";
            btn.disabled = false;
        }, 1500);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('hammershark_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    if (elements.cartCount) {
        elements.cartCount.innerText = cart.length;
    }

    if (!elements.cartItems) return;

    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartWrapper = document.getElementById('cart-wrapper');

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = "block";
        if (cartWrapper) cartWrapper.style.display = "none";
        elements.cartItems.innerHTML = "";
    } else {
        if (emptyMsg) emptyMsg.style.display = "none";
        if (cartWrapper) cartWrapper.style.display = "block";

        elements.cartItems.innerHTML = "";
        let sub = 0;

        cart.forEach((item, index) => {
            sub += item.price;
            const li = document.createElement("li");
            li.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding:15px; background:#fff; border-bottom:1px solid #eee; border-radius:10px;";
            li.innerHTML = `
                <div>
                    <strong style="display:block;">${item.name}</strong> 
                    <small style="color:var(--primary)">TAM: ${item.size}</small>
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <strong>R$ ${item.price.toFixed(2)}</strong>
                    <button onclick="removeFromCart(${index})" style="color:#ff4d4d; border:1px solid #ff4d4d; padding:5px 8px; border-radius:5px; background:none; cursor:pointer;">✕</button>
                </div>
            `;
            elements.cartItems.appendChild(li);
        });

        const ship = sub > 0 ? 15.00 : 0;
        const total = sub + ship;

        if (elements.subtotal) elements.subtotal.innerText = sub.toFixed(2);
        if (elements.shipping) elements.shipping.innerText = ship.toFixed(2);
        if (elements.total) elements.total.innerText = total.toFixed(2);
    }
}

// =====================
// 6. FINALIZAÇÃO WHATSAPP
// =====================
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'checkoutBtn') {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let message = "🔥 *Novo Pedido - Hammershark*%0A%0A";
        cart.forEach((item, idx) => {
            message += `${idx + 1}. *${item.name}* - Tam: ${item.size} (R$ ${item.price.toFixed(2)})%0A`;
        });

        const totalValue = document.getElementById('total') ? document.getElementById('total').innerText : "0.00";
        message += `%0A💰 *Total com Frete:* R$ ${totalValue}`;
        message += `%0A%0A_Olá! Gostaria de prosseguir com o pagamento._`;

        const phone = "5594993012103";
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }
});

// =====================
// 7. BOTÃO DE ENCOLHER/EXPANDIR MENU
// =====================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        menuToggle.innerHTML = navMenu.classList.contains('open') 
            ? '<i class="fa fa-xmark"></i>' 
            : '<i class="fa fa-bars"></i>';
    });
}
