// Initialize Locomotive Scroll for Smooth Scrolling and Parallax Effects
const scrollContainer = document.querySelector('[data-scroll-container]');
const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true
});

// GSAP ScrollTrigger Setup with Locomotive Scroll
gsap.registerPlugin(ScrollTrigger);
scroll.on('scroll', ScrollTrigger.update);

ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
});

// Refresh ScrollTrigger and Locomotive on Window Resize
ScrollTrigger.addEventListener('refresh', () => scroll.update());
ScrollTrigger.refresh();

// Function to handle project card click
function handleProjectCardClick() {
    const popup = document.getElementById('project-popup');
    popup.style.display = 'flex';
    gsap.fromTo(popup, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
}

// Function to handle popup close
function handleClosePopup() {
    const popup = document.getElementById('project-popup');
    gsap.to(popup, { opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => {
        popup.style.display = 'none';
    }});
}

// Add event listeners to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', handleProjectCardClick);
    card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
});

// Close Popup Button
document.querySelector('.close-btn').addEventListener('click', handleClosePopup);

// Easter Egg - Secret Content Toggle
document.getElementById('secretButton').addEventListener('click', () => {
    const hiddenContent = document.getElementById('hiddenContent');
    hiddenContent.style.display = hiddenContent.style.display === 'none' ? 'block' : 'none';
});

// Animated Skill Meter - Circular Progress Effect
document.querySelectorAll('.circular-progress').forEach(progress => {
    const percent = progress.getAttribute('data-percent');
    const radius = 60; // Radius for the circular progress
    const circumference = 2 * Math.PI * radius;

    gsap.to(progress, {
        scrollTrigger: {
            trigger: progress,
            scroller: scrollContainer,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reset'
        },
        onUpdate: () => {
            const offset = circumference - (percent / 100) * circumference;
            progress.style.strokeDashoffset = offset;
        }
    });
});

// Contact Form Submission Handler
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent actual form submission

    const responseMessage = document.getElementById('responseMessage');
    responseMessage.innerText = "Your message has been sent!";
    responseMessage.style.opacity = 1;

    // Reset form fields after submission
    setTimeout(() => {
        responseMessage.style.opacity = 0;
        document.getElementById('contactForm').reset();
    }, 3000);
});

// GSAP Animation for Hero Section Intro Text
gsap.from('#intro-statement', {
    opacity: 0,
    y: -50,
    duration: 1.5,
    delay: 0.5,
    ease: 'power4.out',
    scrollTrigger: {
        trigger: '#intro-statement',
        scroller: scrollContainer,
        start: 'top 80%',
        toggleActions: 'play none none reset'
    }
});

// Enhanced scroll animation triggers
gsap.from('.project-card, .brag-card', {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
        trigger: '.projects-showcase, .brag-wall',
        start: 'top 80%',
        toggleActions: 'play none none reset'
    }
});

// Progressive Reveal Animations for Project Cards
document.querySelectorAll('.project-card').forEach(card => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: card,
            scroller: scrollContainer,
            start: 'top 80%',
            toggleActions: 'play none none reset'
        }
    });
});
