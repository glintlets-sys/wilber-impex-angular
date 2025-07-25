// Initialize carousel with animation
document.addEventListener('DOMContentLoaded', function() {
    var heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        var carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 6000,
            pause: 'hover'
        });
        
        // Fix for split hero layout
        heroCarousel.addEventListener('slide.bs.carousel', function (e) {
            // Reset split sections when moving away from split hero
            if (e.from === 0) {
                var splitHeroSections = document.querySelectorAll('.split-hero-section');
                splitHeroSections.forEach(function(section) {
                    section.style.flex = "1";
                });
            }
            
            // Remove animation classes from previous slide
            var currentSlide = heroCarousel.querySelector('.carousel-item.active');
            if (currentSlide) {
                var animatedElements = currentSlide.querySelectorAll('.animate__animated');
                animatedElements.forEach(function(element) {
                    element.classList.remove('animate__fadeInDown', 'animate__fadeInUp');
                });
            }
            
            // Add animation classes to next slide after a small delay
            setTimeout(function() {
                var nextSlide = e.relatedTarget;
                var animatedElements = nextSlide.querySelectorAll('.animate__animated');
                animatedElements.forEach(function(element, index) {
                    if (element.classList.contains('animate__fadeInDown')) {
                        element.classList.add('animate__fadeInDown');
                    } else if (element.classList.contains('animate__fadeInUp')) {
                        element.classList.add('animate__fadeInUp');
                    }
                });
            }, 50);
        });
        
        // Fix for when carousel cycles back to split hero
        heroCarousel.addEventListener('slid.bs.carousel', function (e) {
            if (e.to === 0) {
                // Reset split hero sections after transition completes
                setTimeout(function() {
                    var splitHeroItem = document.getElementById('split-hero-item');
                    if (splitHeroItem && splitHeroItem.classList.contains('active')) {
                        var container = splitHeroItem.querySelector('.split-hero-container');
                        if (container) {
                            // Force a reflow to ensure clip-path works correctly
                            container.style.display = 'none';
                            // Get a reflow
                            void container.offsetWidth;
                            container.style.display = 'flex';
                        }
                    }
                }, 50);
            }
        });
    }
});

// Back to top button
window.addEventListener('scroll', function() {
    var backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});
const backToTop = document.querySelector('.back-to-top');
            
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
});

backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    var header = document.querySelector('.main-header');
    if (window.pageYOffset > 100) {
        // header.style.padding = '0px 0';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        // header.style.padding = '0px 0';
        header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.05)';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        if (this.getAttribute('href') === '#') return;
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});