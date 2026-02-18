document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons({
        attrs: {
            'stroke-width': 1.5
        }
    });

    // 2. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const isDark = htmlElement.classList.contains('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            htmlElement.style.colorScheme = isDark ? 'dark' : 'light';
        });
    }

    // 3. Header Animation
    const header = document.getElementById('main-header');
    setTimeout(() => {
        if (header) header.classList.remove('opacity-0', '-translate-y-full');
    }, 100);

    // 4. Bento Stagger Animation
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            // Clear inline styles after animation so CSS :hover can take over
            setTimeout(() => {
                card.style.removeProperty('opacity');
                card.style.removeProperty('transform');
                card.style.removeProperty('transition');
            }, 700);
        }, 300 + (index * 100));
    });

    // 5. Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        document.body.style.overflow = mobileMenu.classList.contains('translate-x-full') ? 'hidden' : '';
        mobileMenu.classList.toggle('translate-x-full');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // 6. Scroll Progress
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (!scrollProgress) return;
        const total = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.transform = `scaleX(${total / height})`;
    });

    // 7. Scroll to Top
    const scrollTopBtn = document.getElementById('scroll-to-top');
    const footerScrollTopBtn = document.getElementById('footer-back-to-top');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    if (footerScrollTopBtn) {
        footerScrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // 8. Profile Image Rotation
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        const images = ['images/profile1.jpg', 'images/profile2.jpg', 'images/profile3.jpg'];
        let currentImageIndex = 0;

        // Preload
        images.forEach(src => new Image().src = src);

        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            profileImage.style.opacity = '0';
            setTimeout(() => {
                profileImage.src = images[currentImageIndex];
                profileImage.style.opacity = '1';
            }, 500);
        }, 5000);
    }

    // 9. Name Typing Animation (Loop constantly)
    const typingNameElement = document.getElementById('typing-name');
    const nameText = "Guru Prasad Yadav";

    function typeNameEffect() {
        if (!typingNameElement) return;

        // Type out
        let i = 0;
        typingNameElement.textContent = "";

        const typeInterval = setInterval(() => {
            typingNameElement.textContent += nameText.charAt(i);
            i++;
            if (i > nameText.length - 1) {
                clearInterval(typeInterval);

                // Wait, then delete (or just restart loop)
                // User asked for "Name animate type animation in 5sec"
                setTimeout(() => {
                    typeNameEffect();
                }, 5000); // Wait 5 seconds after typing finishes, then restart
            }
        }, 100); // Typing speed
    }

    // Start typing effect
    typeNameEffect();

    // Scroll fade-in observer for bento cards
    const fadeCards = document.querySelectorAll('.bento-card.scroll-fade-in');
    if (fadeCards.length > 0) {
        // If navigating with a hash (e.g. from contact.html to #about),
        // instantly reveal all cards so the browser scrolls to the right spot
        if (window.location.hash) {
            fadeCards.forEach(card => card.classList.add('visible'));
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            fadeCards.forEach((card, i) => {
                card.style.transitionDelay = `${i * 0.15}s`;
                observer.observe(card);
            });
        }
    }

    // --- Share Utility ---
    const shareBtn = document.getElementById('share-btn');
    const shareDropdown = document.getElementById('share-dropdown');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    const shareTwitter = document.getElementById('share-twitter');
    const shareLinkedin = document.getElementById('share-linkedin');
    const shareEmail = document.getElementById('share-email');

    if (shareBtn && shareDropdown) {
        // Toggle Dropdown
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareDropdown.classList.toggle('active');
        });

        // Close on Outside Click
        document.addEventListener('click', (e) => {
            if (!shareDropdown.contains(e.target) && !shareBtn.contains(e.target)) {
                shareDropdown.classList.remove('active');
            }
        });

        // Update Share Links Dynamically
        const currentUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);

        if (shareTwitter) shareTwitter.href = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${currentUrl}`;
        if (shareLinkedin) shareLinkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
        if (shareEmail) shareEmail.href = `mailto:?subject=${pageTitle}&body=Check this out: ${currentUrl}`;

        // Copy Link Functionality
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    // Show Feedback
                    if (copyFeedback) {
                        copyFeedback.classList.add('show');
                        setTimeout(() => {
                            copyFeedback.classList.remove('show');
                        }, 2000);
                    }
                    // Close Dropdown
                    shareDropdown.classList.remove('active');
                });
            });
        }
    }

});
