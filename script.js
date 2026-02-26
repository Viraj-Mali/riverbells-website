/* =====================================================
   RIVERBELLS RESORT — JavaScript
   Hero Slider, Scroll Animations, Gallery Lightbox,
   Testimonial Carousel, Booking Modal, WhatsApp Integration
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============ NAVBAR ============
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    // Sticky nav on scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        updateActiveNav();
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active nav based on scroll position
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (navLink) {
                if (scrollPos >= top && scrollPos < top + height) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    // ============ HERO SLIDER ============
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(parseInt(dot.dataset.slide));
            startSlider();
        });
    });

    startSlider();

    // ============ SCROLL REVEAL ============
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============ GALLERY LIGHTBOX ============
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentGalleryIndex = 0;

    const galleryData = [];
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        galleryData.push({
            src: img.src,
            alt: img.alt,
            caption: item.dataset.caption || ''
        });

        item.addEventListener('click', () => {
            currentGalleryIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        const data = galleryData[currentGalleryIndex];
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxCaption.textContent = data.caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
        openLightbox();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
        openLightbox();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
            openLightbox();
        }
        if (e.key === 'ArrowRight') {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
            openLightbox();
        }
    });

    // ============ TESTIMONIAL CAROUSEL ============
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    let testimonialIndex = 0;

    function getCardsPerView() {
        return window.innerWidth <= 768 ? 1 : 2;
    }

    function updateTestimonialCarousel() {
        const cards = track.querySelectorAll('.testimonial-card');
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        testimonialIndex = Math.min(testimonialIndex, maxIndex);

        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        const offset = testimonialIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
    }

    prevBtn.addEventListener('click', () => {
        testimonialIndex = Math.max(0, testimonialIndex - 1);
        updateTestimonialCarousel();
    });

    nextBtn.addEventListener('click', () => {
        const cards = track.querySelectorAll('.testimonial-card');
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        testimonialIndex = Math.min(maxIndex, testimonialIndex + 1);
        updateTestimonialCarousel();
    });

    window.addEventListener('resize', updateTestimonialCarousel);

    // ============ BOOKING MODAL ============
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');
    const heroBookBtn = document.getElementById('heroBookBtn');
    const navBookBtn = document.getElementById('navBookBtn');
    const allBookBtns = document.querySelectorAll('.book-btn');
    const bookingForm = document.getElementById('bookingForm');

    function openModal() {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    heroBookBtn.addEventListener('click', openModal);
    navBookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
    allBookBtns.forEach(btn => btn.addEventListener('click', openModal));

    modalClose.addEventListener('click', closeModal);
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('bookCheckin');
    const checkoutInput = document.getElementById('bookCheckout');
    checkinInput.min = today;
    checkoutInput.min = today;

    checkinInput.addEventListener('change', () => {
        checkoutInput.min = checkinInput.value;
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
            const nextDay = new Date(checkinInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkoutInput.value = nextDay.toISOString().split('T')[0];
        }
    });

    // Booking form → WhatsApp
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('bookName').value;
        const phone = document.getElementById('bookPhone').value;
        const roomType = document.getElementById('bookRoomType').value;
        const guests = document.getElementById('bookGuests').value;
        const checkin = document.getElementById('bookCheckin').value;
        const checkout = document.getElementById('bookCheckout').value;
        const requests = document.getElementById('bookRequests').value;

        const message = `🏕️ *Booking Request — Riverbells Resort*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
🏠 *Room Type:* ${roomType}
👥 *Guests:* ${guests}
📅 *Check-in:* ${checkin}
📅 *Check-out:* ${checkout}
${requests ? `📝 *Special Requests:* ${requests}` : ''}

Please confirm availability and pricing. Thank you! 🙏`;

        const whatsappURL = `https://wa.me/917499788935?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
        closeModal();
    });

    // ============ CONTACT FORM → WHATSAPP ============
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value;
        const phone = document.getElementById('contactPhone').value;
        const email = document.getElementById('contactEmail').value;
        const messageText = document.getElementById('contactMessage').value;

        const message = `📩 *Inquiry — Riverbells Resort*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
${email ? `📧 *Email:* ${email}` : ''}
💬 *Message:* ${messageText}

Sent from the website. 🌐`;

        const whatsappURL = `https://wa.me/917499788935?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
        contactForm.reset();
    });

    // ============ SMOOTH SCROLL FOR ALL ANCHOR LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const offset = navbar.offsetHeight;
                const targetPos = target.offsetTop - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ============ PARALLAX-LIKE HERO EFFECT ============
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero-content');
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        }
    });

});
