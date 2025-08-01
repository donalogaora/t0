// ==============================
// Dynamic Image + Carousel Setup
// ==============================

const productImages = {
  '1A': [
    '/assets/shop/black_universal_phone_stand.webp',
    '/assets/shop/white_universal_phone_stand.webp',
    '/assets/shop/space_grey_universal_phone_stand.webp',
    //'/assets/shop/grey_universal_phone_stand.webp',
    //'/assets/shop/clear_universal_phone_stand.webp',
    //'/assets/shop/neon_green_universal_phone_stand.webp',
    //'/assets/shop/sea_green_universal_phone_stand.webp',
    '/assets/shop/dark_blue_universal_phone_stand.webp',
    '/assets/shop/sky_blue_universal_phone_stand.webp',
    //'/assets/shop/purple_universal_phone_stand.webp',
    //'/assets/shop/pink_universal_phone_stand.webp',
    '/assets/shop/red_universal_phone_stand.webp',
    '/assets/shop/orange_universal_phone_stand.webp',
    //'/assets/shop/yellow_universal_phone_stand.webp',
    //'/assets/shop/brown_universal_phone_stand.webp',
    //'/assets/shop/wood_colour_universal_phone_stand.webp',
    '/assets/shop/beige_universal_phone_stand.webp'
  ],
  '2A': [
    '/assets/shop/beige_aquadry_soap_cradle.webp',
    '/assets/shop/black_aquadry_soap_cradle.webp',
    '/assets/shop/white_aquadry_soap_cradle.webp',
    '/assets/shop/space_grey_aquadry_soap_cradle.webp',
    //'/assets/shop/grey_aquadry_soap_cradle.webp',
    //'/assets/shop/clear_aquadry_soap_cradle.webp',
    //'/assets/shop/neon_green_aquadry_soap_cradle.webp',
    //'/assets/shop/sea_green_aquadry_soap_cradle.webp',
    '/assets/shop/dark_blue_aquadry_soap_cradle.webp',
    '/assets/shop/sky_blue_aquadry_soap_cradle.webp',
    //'/assets/shop/purple_aquadry_soap_cradle.webp',
    //'/assets/shop/pink_aquadry_soap_cradle.webp',
    '/assets/shop/red_aquadry_soap_cradle.webp',
    '/assets/shop/orange_aquadry_soap_cradle.webp',
    //'/assets/shop/yellow_aquadry_soap_cradle.webp',
    //'/assets/shop/brown_aquadry_soap_cradle.webp',
    //'/assets/shop/wood_colour_aquadry_soap_cradle.webp',
    '/assets/shop/beige_aquadry_soap_cradle.webp',
    '/assets/shop/black_aquadry_soap_cradle.webp'
  ],
  '3A': [
    '/assets/shop/orange_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/yellow_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/brown_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/wood_colour_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/beige_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/black_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/white_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //break
    '/assets/shop/space_grey_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/grey_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/clear_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/neon_green_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/sea_green_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/dark_blue_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/sky_blue_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/purple_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    //'/assets/shop/pink_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp',
    '/assets/shop/red_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp'
  ]
  // Add more productId/image arrays here
};

const productCarousels = {}; // Stores interval, index, etc for each product

function startCarousel(productId, imageElement) {
  const carousel = productCarousels[productId];
  if (!carousel || !carousel.isActive) return;

  carousel.interval = setInterval(() => {
    imageElement.style.transition = "opacity 1.0s";
    imageElement.style.opacity = 0;

    setTimeout(() => {
      carousel.index = (carousel.index + 1) % carousel.images.length;
      imageElement.onerror = () => {
        console.warn(`Image failed to load: ${carousel.images[carousel.index]}`);
        imageElement.src = carousel.images[0]; // fallback
      };
      imageElement.src = carousel.images[carousel.index];
      imageElement.style.opacity = 1;
    }, 1000);
  }, 3000);
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

  // Get the card that contains this container and its remove button
  const card = container.closest('.shop-card');
  const removeBtn = card.querySelector('.remove-selection-btn');

  container.querySelectorAll('.circle').forEach(circle => {
    circle.addEventListener('click', () => {
      const selectedColor = circle.getAttribute('data-color');
      let imagePath;

      if (productId === '1A') {
        imagePath = `/assets/shop/${selectedColor}_universal_phone_stand.webp`;
      } else if (productId === '2A') {
        imagePath = `/assets/shop/${selectedColor}_aquadry_soap_cradle.webp`;
      } else if (productId === '3A') {
        imagePath = `/assets/shop/${selectedColor}_securefit_hose-arm_clip_adapter_for_miele_wide_upholstery_nozzle.webp`;
      }

      imageElement.src = imagePath;

      clearInterval(carousel.interval);
      carousel.isActive = false;
      imageElement.style.opacity = 1;
      imageElement.setAttribute('data-selected-color', selectedColor);

      // Highlight selected circle
      container.closest('.shop-card').querySelectorAll('.circle').forEach(c => c.classList.remove('selected'));
      circle.classList.add('selected');

      // Show remove button
      if (removeBtn) removeBtn.style.display = 'inline-block';
    });
  });
});

document.querySelectorAll('.remove-selection-btn').forEach(removeBtn => {
  removeBtn.addEventListener('click', () => {
    const productId = removeBtn.getAttribute('data-product-id');
    const carousel = productCarousels[productId];
    if (!carousel) return;

    // Reset image and carousel
    clearInterval(carousel.interval);
    carousel.index = 0;
    carousel.imageElement.src = carousel.images[0];
    carousel.imageElement.removeAttribute('data-selected-color');
    carousel.isActive = true;
    startCarousel(productId, carousel.imageElement);

    // Deselect all circles
    document.querySelectorAll(`.circle-container[data-product-id="${productId}"] .circle`).forEach(c => c.classList.remove('selected'));

    // Hide remove button
    removeBtn.style.display = 'none';
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
      imagePath = `/assets/shop/${color}_universal_phone_stand.webp`;
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

document.addEventListener("DOMContentLoaded", () => {
  fetchAllProducts();

  // Attach remove-color-button listeners after DOM fully loaded
  document.addEventListener('click', function (e) {
    if (!e.target.matches('.remove-selection-btn')) return;
  
    const removeBtn = e.target;
    const productId = removeBtn.getAttribute('data-product-id');
    const carousel = productCarousels[productId];
    if (!carousel) return;
  
    console.log("Remove Color clicked for", productId); // ✅ Debug log
  
    clearInterval(carousel.interval);
    carousel.index = 0;
    carousel.imageElement.src = carousel.images[0];
    carousel.imageElement.removeAttribute('data-selected-color');
    carousel.isActive = true;
    startCarousel(productId, carousel.imageElement);
  
    // Deselect all circles
    document.querySelectorAll(`.circle-container[data-product-id="${productId}"] .circle`)
      .forEach(c => c.classList.remove('selected'));
  
    // Hide remove button
    removeBtn.style.display = 'none';
  });


});

