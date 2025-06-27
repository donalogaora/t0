// Phone Stand Image Fade
const phoneStandImageElement = document.getElementById('toggle-image');
const phoneStandImages = [
    '../assets/shop/phonestand_black.webp',
    '../assets/shop/phonestand_white.webp',
    '../assets/shop/phonestand_space_grey.webp',
    '../assets/shop/phonestand_dark_blue.webp',
    '../assets/shop/phonestand_red.webp',
    '../assets/shop/phonestand_orange.webp'
];
let phoneStandCurrentIndex = 0;
let phoneStandCarouselInterval;
let phoneStandIsCarouselActive = true;

// Soap Cradle Image Fade
const soapCradleImageElement = document.getElementById('soap-toggle-image');
const soapCradleImages = [
    '../assets/shop/black_aquadry_soap_cradle.png',
    '../assets/shop/white_aquadry_soap_cradle.png',
    '../assets/shop/space_grey_aquadry_soap_cradle.png',
    '../assets/shop/blue_aquadry_soap_cradle.png',
    '../assets/shop/red_aquadry_soap_cradle.png',
    '../assets/shop/orange_aquadry_soap_cradle.png'
];
let soapCradleCurrentIndex = 0;
let soapCradleCarouselInterval;
let soapCradleIsCarouselActive = true;

// Function to start the phone stand carousel
function startPhoneStandCarousel() {
    if (phoneStandIsCarouselActive) {
        phoneStandCarouselInterval = setInterval(() => {
            phoneStandImageElement.style.transition = "opacity 0.5s";  // Smooth fade transition
            phoneStandImageElement.style.opacity = 0;

            // After fade-out, change the image source and fade back in
            setTimeout(() => {
                phoneStandCurrentIndex = (phoneStandCurrentIndex + 1) % phoneStandImages.length;
                phoneStandImageElement.src = phoneStandImages[phoneStandCurrentIndex];
                phoneStandImageElement.style.opacity = 1;
            }, 50);  // Wait 50ms to fade out image before switching
        }, 1500); // Change image every 1.5 seconds
    }
}

// Function to start the soap cradle carousel
function startSoapCradleCarousel() {
    if (soapCradleIsCarouselActive) {
        soapCradleCarouselInterval = setInterval(() => {
            soapCradleImageElement.style.transition = "opacity 0.5s";  // Smooth fade transition
            soapCradleImageElement.style.opacity = 0;

            // After fade-out, change the image source and fade back in
            setTimeout(() => {
                soapCradleCurrentIndex = (soapCradleCurrentIndex + 1) % soapCradleImages.length;
                soapCradleImageElement.src = soapCradleImages[soapCradleCurrentIndex];
                soapCradleImageElement.style.opacity = 1;
            }, 50);  // Wait 50ms to fade out image before switching
        }, 1500); // Change image every 1.5 seconds
    }
}

// Start both carousels initially
startPhoneStandCarousel();
startSoapCradleCarousel();

// Color selection logic
let selectedColor = ''; // Store the selected color

// Select the color circles for phone stand
const colorCircles = document.querySelectorAll('.circle');
const toggleImage = document.getElementById('toggle-image');

// Loop through each color circle and add a click event listener
colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        // Get the data-color attribute value from the clicked circle
        selectedColor = circle.getAttribute('data-color');
        
        // Update the image source based on the color selected
        toggleImage.src = `/assets/shop/${selectedColor}_3d_printed_phone_stand_preview.png`;  // Static color image
        
        // Stop the image carousel once a color is selected
        clearInterval(phoneStandCarouselInterval);  // Stop the carousel for phone stand
        phoneStandIsCarouselActive = false; // Set carousel as inactive
        phoneStandImageElement.style.opacity = 1;  // Ensure the image is fully visible immediately

        // Update the selected circle styling
        colorCircles.forEach(c => c.classList.remove('selected')); // Remove "selected" class from all circles
        circle.classList.add('selected'); // Add "selected" class to the clicked circle
    });
});

const orderButtons = document.querySelectorAll('.shop-order-button');

orderButtons.forEach(orderButton => {
    orderButton.addEventListener('click', function () {
        const product = orderButton.getAttribute('data-product') || '3D Printed Phone Stand';
        const price = 6.95; // Matches what the cart expects
        const color = selectedColor;

        if (!color) {
            alert('Please select a color first!');
            return;
        }

        const imagePath = `/assets/shop/phonestand_${color}.webp`; // Match your preview naming convention

        const cartItem = {
            name: product,
            color: color,
            price: price,
            qty: 1,
            image: imagePath
        };

        // Load existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if same item already exists
        const existingIndex = cart.findIndex(item => item.name === product && item.color === color);

        if (existingIndex > -1) {
            cart[existingIndex].qty += 1;
        } else {
            cart.push(cartItem);
        }

        // Save back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Optional: User feedback
        alert(`${product} (${color}) added to cart!`);
    });
});

// Function to scroll to a specific product section after the page is loaded
window.addEventListener("load", function() {
  const hash = window.location.hash;
  if (hash) {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Redirect to the products page and scroll to the section
document.getElementById("soap-order-button").addEventListener("click", function() {
  window.location.href = "https://shop.donalogaora.com/all-products#aqua-dry-soap-cradle";
});
