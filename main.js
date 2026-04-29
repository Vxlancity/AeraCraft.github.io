// Use global supabase from script tag
const { createClient } = window.supabase || {};

// Credentials from main project
const supabaseUrl = localStorage.getItem('supabase-url');
const supabaseKey = localStorage.getItem('supabase-key');
const supabase = (supabaseUrl && supabaseKey && createClient) ? createClient(supabaseUrl, supabaseKey) : null;

// IP Copy Function
window.copyIP = function() {
    const ip = "play.aeracraft.net";
    navigator.clipboard.writeText(ip).then(() => {
        const ipTexts = [document.getElementById('ip-text'), document.getElementById('ip-text-large')];
        ipTexts.forEach(el => {
            if (el) {
                const original = el.textContent;
                el.textContent = "IP kopiert!";
                el.style.color = "#a855f7";
                setTimeout(() => {
                    el.textContent = original;
                    el.style.color = "";
                }, 2000);
            }
        });
    });
}

// Alt + A Shortcut for Admin (Global)
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyA') {
        e.preventDefault();
        window.location.href = 'admin.html';
    }
});

// Load Cloud Config
async function loadCloudConfig() {
    if (!supabase) return;

    const { data, error } = await supabase.from('site_config').select('*');
    if (data) {
        const config = {};
        data.forEach(item => config[item.key] = item.value);

        // Apply Phase
        const phase = config.aeracraft_current_phase || "1";
        document.querySelectorAll('.timeline-card').forEach(card => card.classList.remove('active'));
        const activeCard = document.getElementById(`phase-card-${phase}`);
        if (activeCard) activeCard.classList.add('active');

        // Apply Theme
        if (config.aeracraft_season_theme) {
            document.getElementById('current-theme').textContent = config.aeracraft_season_theme;
        }

        // Apply Hall of Fame
        if (config.aeracraft_hall_of_fame) {
            document.getElementById('current-winner').textContent = config.aeracraft_hall_of_fame;
        }

        // Start Countdown
        if (config.aeracraft_countdown) {
            startCountdown(config.aeracraft_countdown);
        }
    }
}

function startCountdown(targetDate) {
    const countDownDate = new Date(targetDate).getTime();
    setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById("days")) {
            document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
            document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
            document.getElementById("mins").innerHTML = minutes.toString().padStart(2, '0');
            document.getElementById("secs").innerHTML = seconds.toString().padStart(2, '0');
        }
    }, 1000);
}

// APPLE KEYNOTE STYLE ANIMATIONS
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry (Smooth scale & fade)
    gsap.from("#hero .hero-content", {
        scale: 1.1,
        opacity: 0,
        duration: 2,
        ease: "power3.out"
    });

    // Reveal Text Animation (Keynote style)
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 90%",
            },
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    });

    // Timeline Cards - Apple Reveal (Slide from bottom + Zoom)
    gsap.utils.toArray(".timeline-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 95%",
                toggleActions: "play none none reverse"
            },
            y: 150,
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            delay: i * 0.1,
            ease: "expo.out"
        });
    });

    // Feature Blocks Staggered Reveal
    gsap.from(".feature-block", {
        scrollTrigger: {
            trigger: ".feature-showcase",
            start: "top 80%"
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    // Parallax effect on Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.getElementById('hero');
        if (hero) {
            hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
        }
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 100) {
        nav.style.height = '60px';
        nav.style.background = 'rgba(3, 3, 5, 0.9)';
    } else {
        nav.style.height = '80px';
        nav.style.background = 'rgba(3, 3, 5, 0.7)';
    }
});

loadCloudConfig().catch(e => console.error(e)).finally(() => {
    initAnimations();
});
