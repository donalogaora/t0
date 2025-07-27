// ==============================
// Dynamic Image + Carousel Setup
// ==============================

const productImages = {
  '1A': [
    '/assets/shop/black_universal_phone_stand.webp',
    '/assets/shop/white_universal_phone_stand.webp',
    '/assets/shop/space_grey_universal_phone_stand.webp',
    '/assets/shop/dark_blue_universal_phone_stand.webp',
    '/assets/shop/red_universal_phone_stand.webp',
    '/assets/shop/orange_universal_phone_stand.webp'
  ],
  '2A': [
    '/assets/shop/black_aquadry_soap_cradle.webp',
    '/assets/shop/white_aquadry_soap_cradle.webp',
    '/assets/shop/space_grey_aquadry_soap_cradle.webp',
    '/assets/shop/dark_blue_aquadry_soap_cradle.webp',
    '/assets/shop/red_aquadry_soap_cradle.webp',
    '/assets/shop/orange_aquadry_soap_cradle.webp'
  ],
  '3A': [
    '/assets/shop/black_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/white_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/space_grey_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/dark_blue_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/red_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/orange_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp'
  ]
  // Add more productId/image arrays here
};

const productCarousels = {}; // Stores interval, index, etc for each product

function startCarousel(productId, imageElement) {
  const carousel = productCarousels[productId];
  if (!carousel || !carousel.isActive) return;

  carousel.interval = setInterval(() => {
    imageElement.style.transition = "opacity 0.8s";
    imageElement.style.opacity = 0;

    setTimeout(() => {
      carousel.index = (carousel.index + 1) % carousel.images.length;
      imageElement.onerror = () => {
        console.warn(`Image failed to load: ${carousel.images[carousel.index]}`);
        imageElement.src = carousel.images[0]; // fallback
      };
      imageElement.src = carousel.images[carousel.index];
      imageElement.style.opacity = 1;
    }, 800);
  }, 2500);
}


// ==============================
// Initialize Carousels
// ==============================

document.querySelectorAll('.shop-card').forEach(card => {
  const productId = card.getAttribute('data-product-id');
  const imageElement = card.querySelector('.shop-card-image');
  const images = productImages[productId];
  // Preload all carousel images for this product
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });


  if (!images || !imageElement) return;

  productCarousels[productId] = {
    index: 0,
    isActive: true,
    interval: null,
    images,
    imageElement
  };

  imageElement.setAttribute('id', `product-image-${productId}`); // Assign dynamic ID
  startCarousel(productId, imageElement);
});

// ==============================
// Handle Color Selections
// ==============================

document.querySelectorAll('.circle-container').forEach(container => {
  const productId = container.getAttribute('data-product-id');
  const carousel = productCarousels[productId];
  if (!carousel) return;

  const imageElement = carousel.imageElement;

  container.querySelectorAll('.circle').forEach(circle => {
    circle.addEventListener('click', () => {
      const selectedColor = circle.getAttribute('data-color');
      let imagePath;

      if (productId === '1A') {
        imagePath = `/assets/shop/${selectedColor}universal_phone_stand.webp`;
      } else if (productId === '2A') {
        imagePath = `/assets/shop/${selectedColor}_aquadry_soap_cradle.webp`;
      } else if (productId === '3A') {
        imagePath = `/assets/shop/${selectedColor}_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp`;
      } else {
        // fallback or error
      }

      imageElement.src = imagePath;

      clearInterval(carousel.interval);
      carousel.isActive = false;
      imageElement.style.opacity = 1;
      imageElement.setAttribute('data-selected-color', selectedColor);

      container.querySelectorAll('.circle').forEach(c => c.classList.remove('selected'));
      circle.classList.add('selected');
    });
  });
});

// ==============================
// Add to Cart (Per Product)
// ==============================

document.querySelectorAll('.shop-order-button').forEach(orderButton => {
  orderButton.addEventListener('click', function () {
    const productId = orderButton.getAttribute('data-product-id');
    const imageElement = document.querySelector(`#product-image-${productId}`);
    const color = imageElement?.getAttribute('data-selected-color');

    if (!color) {
      alert('Please select a color first!');
      return;
    }

    const productName = getProductField(productId, 'product_name') || 'Unnamed Product';
    const price = parseFloat(getProductField(productId, 'price')) || 0;
    const formattedColor = color.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let imagePath;
    if (productId === '1A') {
      imagePath = `/assets/shop/${color}universal_phone_stand.webp`;
    } else if (productId === '2A') {
      imagePath = `/assets/shop/${color}_aquadry_soap_cradle.webp`;
    } else if (productId === '3A') {
      imagePath = `/assets/shop/${color}_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp`;
    } else {
      // fallback or error
    }

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
    updateCartNav();
    alert(`${formattedColor} ${productName} added to cart!`);
  });
});

// ==============================
// Utility + Misc (Same as Before)
// ==============================

window.addEventListener("load", function () {
  const hash = window.location.hash;
  if (hash) {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

document.querySelectorAll(".soap-order-button").forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "https://shop.donalogaora.com/all-products#aqua-dry-soap-cradle";
  });
});

const cartNavItem = document.getElementById('cart-nav-item');
const cartCountSpan = document.getElementById('cart-count');

function updateCartNav() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  if (totalQty > 0) {
    cartCountSpan.textContent = totalQty;
    cartNavItem.style.display = 'list-item';
  } else {
    cartNavItem.style.display = 'none';
  }
}

updateCartNav();
document.getElementById('cart-nav-item').classList.remove('hidden');
document.getElementById('cart-count').textContent = 2;

// ==============================
// Product Info Fetching
// ==============================

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
      elem.textContent = field.toLowerCase() === 'price' ? `€${value}` : value;
    }
  });
}

function fetchAllProducts() {
  fetch(DATA_URL)
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

document.addEventListener("DOMContentLoaded", fetchAllProducts);
