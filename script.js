// ================== Your existing carousel & color selection code ===================

const phoneStandImageElement = document.getElementById('toggle-image');
const phoneStandImages = [
    '/assets/shop/phonestand_black.webp',
    '/assets/shop/phonestand_white.webp',
    '/assets/shop/phonestand_space_grey.webp',
    '/assets/shop/phonestand_dark_blue.webp',
    '/assets/shop/phonestand_red.webp',
    '/assets/shop/phonestand_orange.webp'
];
let phoneStandCurrentIndex = 0;
let phoneStandCarouselInterval;
let phoneStandIsCarouselActive = true;

const soapCradleImageElement = document.getElementById('soap-toggle-image');
const soapCradleImages = [
    '/assets/shop/black_aquadry_soap_cradle.png',
    '/assets/shop/white_aquadry_soap_cradle.png',
    '/assets/shop/space_grey_aquadry_soap_cradle.png',
    '/assets/shop/blue_aquadry_soap_cradle.png',
    '/assets/shop/red_aquadry_soap_cradle.png',
    '/assets/shop/orange_aquadry_soap_cradle.png'
];
let soapCradleCurrentIndex = 0;
let soapCradleCarouselInterval;
let soapCradleIsCarouselActive = true;

function startPhoneStandCarousel() {
    if (phoneStandIsCarouselActive) {
        phoneStandCarouselInterval = setInterval(() => {
            phoneStandImageElement.style.transition = "opacity 0.5s";
            phoneStandImageElement.style.opacity = 0;
            setTimeout(() => {
                phoneStandCurrentIndex = (phoneStandCurrentIndex + 1) % phoneStandImages.length;
                phoneStandImageElement.src = phoneStandImages[phoneStandCurrentIndex];
                phoneStandImageElement.style.opacity = 1;
            }, 500);
        }, 1500);
    }
}

function startSoapCradleCarousel() {
    if (soapCradleIsCarouselActive) {
        soapCradleCarouselInterval = setInterval(() => {
            soapCradleImageElement.style.transition = "opacity 0.5s";
            soapCradleImageElement.style.opacity = 0;
            setTimeout(() => {
                soapCradleCurrentIndex = (soapCradleCurrentIndex + 1) % soapCradleImages.length;
                soapCradleImageElement.src = soapCradleImages[soapCradleCurrentIndex];
                soapCradleImageElement.style.opacity = 1;
            }, 500);
        }, 1500);
    }
}

startPhoneStandCarousel();
startSoapCradleCarousel();

let selectedColor = ''; // Store selected color

const colorCircles = document.querySelectorAll('.circle');
const toggleImage = document.getElementById('toggle-image');

colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        selectedColor = circle.getAttribute('data-color');

        // Update image
        toggleImage.src = `/assets/shop/phonestand_${selectedColor}.webp`;

        // Stop carousel
        clearInterval(phoneStandCarouselInterval);
        phoneStandIsCarouselActive = false;
        phoneStandImageElement.style.opacity = 1;

        // Update selected circle styling
        colorCircles.forEach(c => c.classList.remove('selected'));
        circle.classList.add('selected');
    });
});

// ================== Cart & Product Handling ===================

const orderButtons = document.querySelectorAll('.shop-order-button');

orderButtons.forEach(orderButton => {
  orderButton.addEventListener('click', function () {
    const productId = orderButton.getAttribute('data-product-id');
    if (!productId) {
      alert("Missing product ID.");
      return;
    }

    const productName = getProductField(productId, 'product_name') || 'Unnamed Product';
    const price = parseFloat(getProductField(productId, 'price')) || 0;
    const imagePath = `/assets/shop/phonestand_${selectedColor}.webp`;
    const color = selectedColor;

    if (!color) {
      alert('Please select a color first!');
      return;
    }

    const formattedColor = color.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const cartItem = {
      id: productId,
      name: productName,
      color: formattedColor,
      price: price,
      qty: 1,
      image: imagePath
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === productId && item.color === formattedColor);

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartNav(); // Update icon count
    alert(`${formattedColor} ${productName} added to cart!`);
  });
});

function updateCartNav() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartNavItem = document.getElementById('cart-nav-item');
  const cartCountSpan = document.getElementById('cart-count');

  if (totalQty > 0) {
    cartCountSpan.textContent = totalQty;  
    cartNavItem.style.display = 'list-item';  
  } else {
    cartNavItem.style.display = 'none';  
  }
}

updateCartNav();

// Scroll to hash on load
window.addEventListener("load", function() {
  const hash = window.location.hash;
  if (hash) {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Soap order button redirect fix
document.querySelectorAll(".soap-order-button").forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "https://shop.donalogaora.com/all-products#aqua-dry-soap-cradle";
  });
});

// ================== Data Fetch & Helpers ===================

const PRODUCTS_URL = "https://script.google.com/macros/s/AKfycbz8LydxCL8AZclrYOXVbQjCVcWtp3rzAWNct-tI0Sf2ZNz_j7Zu3invgYMoHEMANlVv/exec?all=true";
const PROMOS_URL = "https://script.google.com/macros/s/AKfycbz8LydxCL8AZclrYOXVbQjCVcWtp3rzAWNct-tI0Sf2ZNz_j7Zu3invgYMoHEMANlVv/exec?promos=true";

const productsData = {};
let promosData = [];

function normalizeKey(str) {
  return str.toLowerCase().replace(/\s+/g, "_");
}

function getProductField(id, field) {
  const product = productsData[id.toLowerCase()];
  if (!product) return null;
  return product[normalizeKey(field)] ?? null;
}

function updateDomFields() {
  const elems = document.querySelectorAll("[data-product-id][data-field]");
  elems.forEach(elem => {
    const id = elem.getAttribute("data-product-id");
    const field = elem.getAttribute("data-field");
    const value = getProductField(id, field);
    if (value !== null) {
      if (field.toLowerCase() === 'price') {
        elem.textContent = `€${value}`;
      } else {
        elem.textContent = value;
      }
    }
  });
}

function fetchAllProducts() {
  fetch(PRODUCTS_URL)
    .then(res => res.json())
    .then(flatData => {
      for (const [flatKey, value] of Object.entries(flatData)) {
        const [id, ...rest] = flatKey.split("_");
        const keyRaw = rest.join("_");
        const key = normalizeKey(keyRaw);
        const idNormalized = id.toLowerCase();

        if (!productsData[idNormalized]) productsData[idNormalized] = {};
        productsData[idNormalized][key] = value;
      }
      console.log("All products loaded:", productsData);
      updateDomFields();
    })
    .catch(err => console.error("Failed to load products:", err));
}

// Parse promos from flat data to array of objects
function parsePromos(flatData) {
  const promosMap = {};
  for (const [flatKey, value] of Object.entries(flatData)) {
    const [pid, ...rest] = flatKey.split('_');
    const key = rest.join('_');
    if (!promosMap[pid]) promosMap[pid] = {};
    promosMap[pid][key] = value;
  }
  promosData = Object.values(promosMap).map(promo => ({
    pid: promo.pid,
    promo_code: promo.promo_code ? promo.promo_code.trim().toUpperCase() : '',
    discount_amount: promo.discount_amount ? promo.discount_amount.trim() : '',
    minimum_spent: promo.minimum_spent ? parseFloat(promo.minimum_spent) : null,
    expiry_date: promo.expiry_date ? promo.expiry_date.trim() : ''
  }));
  console.log("Parsed promos:", promosData);
}

function fetchPromos() {
  fetch(PROMOS_URL)
    .then(res => res.json())
    .then(data => {
      parsePromos(data);
    })
    .catch(err => console.error("Failed to load promos:", err));
}

// ================== Promo Code Logic ===================

function applyPromoCode(codeInput, cartTotal) {
  const code = codeInput.trim().toUpperCase();
  const promo = promosData.find(p => p.promo_code === code);
  if (!promo) {
    return { success: false, message: "Invalid promo code." };
  }

  // Check expiry if set and not "N/A"
  if (promo.expiry_date && promo.expiry_date.toUpperCase() !== 'N/A') {
    const [day, month, year] = promo.expiry_date.split('/');
    const expiryDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    if (today > expiryDate) {
      return { success: false, message: "Promo code has expired." };
    }
  }

  // Check minimum spend
  if (promo.minimum_spent !== null && cartTotal < promo.minimum_spent) {
    return { success: false, message: `Minimum spend of €${promo.minimum_spent} required.` };
  }

  // Calculate discount
  let discountAmount = 0;
  if (promo.discount_amount.endsWith('%')) {
    const percent = parseFloat(promo.discount_amount);
    discountAmount = (percent / 100) * cartTotal;
  } else {
    discountAmount = parseFloat(promo.discount_amount);
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return {
    success: true,
    message: `Promo applied! You saved €${discountAmount.toFixed(2)}.`,
    discountAmount,
    finalTotal
  };
}

// ================== Promo UI Hook ===================

// Make sure your HTML has these elements:
// <input id="promo-code-input" type="text">
// <button id="apply-promo-button">Apply Promo</button>
// <div id="promo-message"></div>
// <div id="cart-total"></div> (to display total price)

document.getElementById('apply-promo-button').addEventListener('click', () => {
  const promoInput = document.getElementById('promo-code-input').value;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const result = applyPromoCode(promoInput, cartTotal);

  const messageElem = document.getElementById('promo-message');
  messageElem.textContent = result.message;

  if (result.success) {
    document.getElementById('cart-total').textContent = `Total: €${result.finalTotal.toFixed(2)}`;
    localStorage.setItem('promoApplied', JSON.stringify(result));
  } else {
    document.getElementById('cart-total').textContent = `Total: €${cartTotal.toFixed(2)}`;
    localStorage.removeItem('promoApplied');
  }
});

// ================== Init on DOM ready ===================

document.addEventListener("DOMContentLoaded", () => {
  fetchAllProducts();
  fetchPromos();
  updateCartNav();
});
