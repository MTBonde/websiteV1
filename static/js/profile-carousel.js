// Profile image carousel for hero section
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.profile-img');

    if (images.length === 0) return;

    let currentIndex = 0;
    const intervalTime = 4000; // 4 seconds per image

    function showNextImage() {
        // Remove active class from current image
        images[currentIndex].classList.remove('active');

        // Move to next image
        currentIndex = (currentIndex + 1) % images.length;

        // Add active class to new image
        images[currentIndex].classList.add('active');
    }

    // Start the carousel
    setInterval(showNextImage, intervalTime);
});
