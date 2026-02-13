// =============================================
// CONFIGURATION
// =============================================
const CONFIG = {
    typeSpeed: 100,
    pauseAfterType: 5000,
    imageInterval: 5000,
    scrollThreshold: 300,
    textToType: "Guru Prasad Yadav",
    profiles: [
        "profile1.jpg",
        "profile2.jpg",
        "profile3.jpg",
        "profile4.jpg"
    ]
};

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize typing effect
    typeEffect();
    
    // Start profile image rotation
    setInterval(autoChangeProfile, CONFIG.imageInterval);
    
    // Initialize theme
    initializeTheme();
    
    // Initialize scroll features
    initializeScrollFeatures();
    
    // Initialize navigation
    initializeNavigation();
    
    // Animate stats on scroll
    animateStatsOnScroll();
    
    // Add intersection observer for animations
    initializeIntersectionObserver();
}

// =============================================
// TYPING EFFECT
// =============================================
function typeEffect() {
    const typingElement = document.getElementById("typing-name");
    if (!typingElement) return;
    
    let charIndex = 0;
    typingElement.innerHTML = "";
    
    function type() {
        if (charIndex < CONFIG.textToType.length) {
            typingElement.innerHTML += CONFIG.textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, CONFIG.typeSpeed);
        } else {
            setTimeout(() => {
                charIndex = 0;
                typeEffect();
            }, CONFIG.pauseAfterType);
        }
    }
    
    type();
}

// =============================================
// PROFILE IMAGE ROTATION
// =============================================
function autoChangeProfile() {
    const profileElement = document.getElementById("profile-pic");
    if (!profileElement) return;
    
    const currentSrc = profileElement.getAttribute('src').split('/').pop();
    let randomIndex = Math.floor(Math.random() * CONFIG.profiles.length);
    
    // Ensure we don't get the same image
    while (CONFIG.profiles[randomIndex] === currentSrc) {
        randomIndex = Math.floor(Math.random() * CONFIG.profiles.length);
    }
    
    // Fade out
    profileElement.style.opacity = '0';
    
    // Change image and fade in
    setTimeout(() => {
        profileElement.src = "images/" + CONFIG.profiles[randomIndex];
        profileElement.style.opacity = '1';
    }, 300);
}

// =============================================
// THEME MANAGEMENT
// =============================================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.className = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeBtn = document.querySelector('.theme-toggle i');
    if (themeBtn) {
        themeBtn.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// =============================================
// SCROLL FEATURES
// =============================================
function initializeScrollFeatures() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > CONFIG.scrollThreshold) {
            scrollBtn?.classList.add('visible');
        } else {
            scrollBtn?.classList.remove('visible');
        }
        
        // Update active navigation link
        updateActiveNavLink();
    });
    
    // Scroll to top functionality
    scrollBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =============================================
// NAVIGATION
// =============================================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// =============================================
// STATS ANIMATION
// =============================================
function animateStatsOnScroll() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                statNumbers.forEach(stat => {
                    animateValue(stat);
                });
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });
    
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
        observer.observe(statsRow);
    }
}

function animateValue(element) {
    const text = element.textContent;
    const number = parseInt(text);
    const suffix = text.replace(/[0-9]/g, '');
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = number + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, duration / steps);
}

// =============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =============================================
function initializeIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth hover effect to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.content-box, .profile-card, .achievements-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            toggleTheme();
        }
    }
    
    // Press 'Escape' to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Add parallax effect to profile image
window.addEventListener('scroll', debounce(() => {
    const profileImg = document.querySelector('.profile-img');
    if (profileImg && window.innerWidth > 1100) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        profileImg.style.transform = `translateY(${rate}px) scale(1.05)`;
    }
}, 10));

// Preload images for smooth transitions
function preloadImages() {
    CONFIG.profiles.forEach(filename => {
        const img = new Image();
        img.src = `images/${filename}`;
    });
}

// Call preload on page load
window.addEventListener('load', preloadImages);

// Add easter egg - click logo 5 times for surprise
let logoClickCount = 0;
const logo = document.querySelector('.logo-box');

logo?.addEventListener('click', () => {
    logoClickCount++;
    
    if (logoClickCount === 5) {
        // Create confetti effect or special message
        createConfetti();
        logoClickCount = 0;
    }
});

function createConfetti() {
    // Simple confetti animation
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: fall ${2 + Math.random() * 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console message for developers
console.log('%c👋 Hello Developer!', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
console.log('%cWelcome to Guru Prasad Yadav\'s Portfolio', 'font-size: 14px; color: #22c55e;');
console.log('%cPress T to toggle theme | Press ESC to scroll to top', 'font-size: 12px; color: #a1a1aa;');
