// Projects Page JavaScript

// ===== Filter Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-detailed');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = 'slideUp 0.6s ease forwards';
                        }, 10);
                    }, index * 100);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Initialize - show all projects on load
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) {
        allBtn.classList.add('active');
    }
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Navbar Menu Toggle =====
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuBtn) menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Cursor Follower =====
const cursorFollower = document.querySelector('.cursor-follower');

if (cursorFollower) {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    const speed = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hide cursor follower on mobile
    if (window.innerWidth <= 768) {
        cursorFollower.style.display = 'none';
    }
}

// ===== Back to Top Button =====
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Reveal Animations =====
const revealElements = document.querySelectorAll('.reveal, .reveal-delay-1, .reveal-delay-2');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, entry.target.classList.contains('reveal-delay-1') ? 150 : 
               entry.target.classList.contains('reveal-delay-2') ? 300 : 0);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));

// ===== Project Card Hover Effect =====
const projectCards = document.querySelectorAll('.project-card-detailed');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        projectCards.forEach(c => {
            if (c !== this) {
                c.style.opacity = '0.7';
            }
        });
    });

    card.addEventListener('mouseleave', function() {
        projectCards.forEach(c => {
            c.style.opacity = '1';
        });
    });
});

// ===== Responsive Navbar =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        if (menuBtn) menuBtn.classList.remove('active');
    }
});

// ===== Active Section Highlight =====
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// ===== Count Visible Projects =====
function updateProjectCount() {
    const visibleProjects = document.querySelectorAll('.project-card-detailed:not(.hidden)').length;
    console.log(`Currently showing ${visibleProjects} project(s)`);
}

// ===== Copy to Clipboard Function =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ===== Project Link Click Handler =====
const projectLinks = document.querySelectorAll('.project-links a');

projectLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // You can add custom analytics or tracking here
        const href = this.getAttribute('href');
        const text = this.textContent;
        console.log(`Clicked: ${text} - ${href}`);
    });
});

// ===== Smooth Loading Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    updateProjectCount();
});

// ===== Search/Filter Enhancement (Future Feature) =====
function searchProjects(keyword) {
    const projects = document.querySelectorAll('.project-card-detailed');
    let count = 0;

    projects.forEach(project => {
        const title = project.querySelector('h2').textContent.toLowerCase();
        const description = project.querySelector('.project-description p').textContent.toLowerCase();
        
        if (title.includes(keyword.toLowerCase()) || description.includes(keyword.toLowerCase())) {
            project.classList.remove('hidden');
            count++;
        } else {
            project.classList.add('hidden');
        }
    });

    console.log(`Found ${count} project(s) matching "${keyword}"`);
    return count;
}

// ===== Export Projects Data (Future Feature) =====
function getProjectsData() {
    const projects = [];
    
    document.querySelectorAll('.project-card-detailed').forEach(card => {
        const title = card.querySelector('h2').textContent;
        const category = card.getAttribute('data-category');
        const status = card.querySelector('.status').textContent;
        
        projects.push({
            title,
            category,
            status,
            timestamp: new Date()
        });
    });

    return projects;
}

// ===== Log Initialization =====
console.log('Projects page loaded successfully! 🚀');
