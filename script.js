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
        const product = orderButton.getAttribute('data-product') || '3D Printed Phone Stand';
        const price = 6.95;
        const color = selectedColor;

        if (!color) {
            alert('Please select a color first!');
            return;
        }

        // Format color: space_grey → Space Grey
        const formattedColor = color.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const imagePath = `../assets/shop/phonestand_${color}.webp`;

        const cartItem = {
            name: product,
            color: formattedColor,
            price: price,
            qty: 1,
            image: imagePath
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingIndex = cart.findIndex(item => item.name === product && item.color === formattedColor);

        if (existingIndex > -1) {
            cart[existingIndex].qty += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        alert(`${formattedColor} ${product} added to cart!`);
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


// CODE FOR APK PULL
const API_URL = "https://script.google.com/macros/s/AKfycbzL1wu8NlY3xJEZLK6u2y5YQeUBpkMHyY4sWjJdFEK26cnro9rVMn4ugLELxzzzTMTp/exec";

async function fetchShopData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching data:", data.error);
      return;
    }

    const products = data.products;
    const promos = data.promos;
    const delivery = data.delivery;

    // Example: find a product by name
    const phoneStand = products.find(p => p.Name === "3D Printed Phone Stand");
    if (phoneStand) {
      console.log("Phone Stand Price:", phoneStand.Price);
      // You could update HTML elements dynamically like:
      document.querySelector("#product-price").textContent = `€${phoneStand.Price}`;
    }

    // Example: Check if promo exists
    const codeInput = "WELCOME5";
    const activePromo = promos.find(p => p.Code === codeInput);
    if (activePromo) {
      console.log(`Promo ${codeInput} gives ${activePromo.Discount}% off.`);
    }

    // Example: Show delivery ETA for Ireland
    const irelandDelivery = delivery.find(d => d.Zone === "Ireland");
    if (irelandDelivery) {
      console.log(`Delivery in Ireland: €${irelandDelivery.Cost}, ETA: ${irelandDelivery.ETA}`);
    }

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// ✅ Add this at the end to actually run the function on load:
fetchShopData();
