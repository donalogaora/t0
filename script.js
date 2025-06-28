// Use absolute paths for images on main page
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
            }, 500);  // 500ms fade out to fade in (was 50ms too quick)
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

        // Update image using consistent naming
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
    const imagePath = `../assets/shop/phonestand_${selectedColor}.webp`;
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

// Fix for soap order buttons - multiple elements
document.querySelectorAll(".soap-order-button").forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "https://shop.donalogaora.com/all-products#aqua-dry-soap-cradle";
  });
});

// Grab the cart nav elements
const cartNavItem = document.getElementById('cart-nav-item');
const cartCountSpan = document.getElementById('cart-count');

// Function to update cart display based on what's in localStorage
function updateCartNav() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  if (totalQty > 0) {
    cartCountSpan.textContent = totalQty;  // update number in parentheses
    cartNavItem.style.display = 'list-item';  // show the cart link
  } else {
    cartNavItem.style.display = 'none';  // hide it if cart empty
  }
}

// Run on page load to check if there's anything in cart already
updateCartNav();

// When someone adds an item to the cart, update the nav
orderButtons.forEach(orderButton => {
  orderButton.addEventListener('click', function () {
    // Your existing add-to-cart code here (which updates localStorage)...

    // After adding item to cart, update the nav item
    updateCartNav();
  });
});

// Show the cart nav item when needed
document.getElementById('cart-nav-item').classList.remove('hidden');

// Optionally update cart count
document.getElementById('cart-count').textContent = 2;


// ShopBackend API Pull
const DATA_URL = "https://script.google.com/macros/s/AKfycbz8LydxCL8AZclrYOXVbQjCVcWtp3rzAWNct-tI0Sf2ZNz_j7Zu3invgYMoHEMANlVv/exec?all=true";

const productsData = {};

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
  fetch(DATA_URL)
    .then(res => res.json())
    .then(flatData => {
      for (const [flatKey, value] of Object.entries(flatData)) {
        const [id, ...rest] = flatKey.split("_");
        const keyRaw = rest.join("_"); // e.g. "product name"
        const key = normalizeKey(keyRaw); // e.g. "product_name"
        const idNormalized = id.toLowerCase();

        if (!productsData[idNormalized]) productsData[idNormalized] = {};
        productsData[idNormalized][key] = value;
      }

      console.log("All products loaded:", productsData);
      updateDomFields();
    })
    .catch(err => console.error("Failed to load products:", err));
}

// ✅ DOM must be ready
document.addEventListener("DOMContentLoaded", fetchAllProducts);


// promo code code
let appliedPromo = null;

// Fetch promo data
fetch('https://script.google.com/macros/s/AKfycbz8LydxCL8AZclrYOXVbQjCVcWtp3rzAWNct-tI0Sf2ZNz_j7Zu3invgYMoHEMANlVv/exec?promos=true')
  .then(res => res.json())
  .then(data => {
    promoCodes = {};
    // Restructure promo data for easier use
    for (const key in data) {
      const [id, field] = key.split('_');
      if (!promoCodes[id]) promoCodes[id] = {};
      promoCodes[id][field] = data[key];
    }
  })
  .catch(err => {
    console.error('Failed to load promo codes:', err);
  });

// Apply promo logic
applyPromoBtn.addEventListener('click', () => {
  const codeInput = promoInput.value.trim().toUpperCase();
  if (!codeInput) {
    promoMessage.textContent = 'Please enter a promo code.';
    promoMessage.classList.remove('success');
    return;
  }

  const now = new Date();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Find promo object matching code
  const promo = Object.values(promoCodes).find(p => p.promo_code?.toUpperCase() === codeInput);

  if (!promo) {
    appliedPromo = null;
    promoMessage.textContent = 'Invalid promo code.';
    promoMessage.classList.remove('success');
    updateTotals();
    return;
  }

  // Check expiry
  if (promo.expiry_date) {
    const expiry = new Date(promo.expiry_date);
    if (now > expiry) {
      appliedPromo = null;
      promoMessage.textContent = 'Promo code expired.';
      promoMessage.classList.remove('success');
      updateTotals();
      return;
    }
  }

  // Check minimum spend
  const minSpend = parseFloat(promo.minimum_spent || 0);
  if (subtotal < minSpend) {
    appliedPromo = null;
    promoMessage.textContent = `Minimum spend of €${minSpend.toFixed(2)} required.`;
    promoMessage.classList.remove('success');
    updateTotals();
    return;
  }

  appliedPromo = promo;
  promoMessage.textContent = `Promo code applied: ${promo.promo_code}`;
  promoMessage.classList.add('success');
  updateTotals();
});



function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotalEl.textContent = subtotal.toFixed(2);

  let discountAmount = 0;

  if (appliedPromo) {
    const discount = parseFloat(appliedPromo.discont_amount); // API uses discont_amount!
    if (discount > 0 && discount < 1) {
      discountAmount = subtotal * discount; // percentage
    } else {
      discountAmount = discount; // fixed amount
    }
  }

  discountEl.textContent = discountAmount.toFixed(2);
  discountRow.style.display = discountAmount > 0 ? 'flex' : 'none';

  const total = Math.max(0, subtotal - discountAmount);
  totalEl.textContent = total.toFixed(2);

  const canCheckout = total > 0 && cart.length > 0;
  checkoutBtn.disabled = !canCheckout;
  checkoutBtn.setAttribute('aria-disabled', (!canCheckout).toString());
}

// Store promo in localStorage when applied
localStorage.setItem('appliedPromo', JSON.stringify(promo));

// On page load, check for an applied promo and display it
const savedPromo = JSON.parse(localStorage.getItem('appliedPromo'));
if (savedPromo) {
  appliedPromo = savedPromo;
  promoMessage.textContent = `Promo code applied: ${savedPromo.promo_code}`;
  promoMessage.classList.add('success');
  updateTotals();
}
