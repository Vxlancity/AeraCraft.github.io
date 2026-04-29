// AeraCraft Main Logic - Premium Motion Edition
// Powered by GSAP & Supabase

const initAeraCraft = () => {
    // 1. Supabase Configuration (Hardcoded for convenience)
    const SUPABASE_URL = 'https://iutdotykpgrdhgvqtnjx.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dGRvdHlrcGdyZGhndnF0bmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDM1NzAsImV4cCI6MjA5Mjk3OTU3MH0.q2zkK2ob_ohmG_o7o4q2r2_DbgLgWivTZ6Z-UVXoEJg';
    
    // Fallback check
    const sb = (window.supabase) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    // 2. IP Copy Functionality
    window.copyIP = function() {
        const ip = "play.aeracraft.net";
        navigator.clipboard.writeText(ip).then(() => {
            const ipElements = [document.getElementById('ip-text'), document.getElementById('ip-text-large')];
            ipElements.forEach(el => {
                if (el) {
                    const original = el.textContent;
                    el.textContent = "KOPIERT!";
                    el.style.color = "#a855f7";
                    setTimeout(() => {
                        el.textContent = original;
                        el.style.color = "";
                    }, 2000);
                }
            });
        });
    }

    // 3. Admin Shortcut (Alt + A) - Fixed for reliability
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            window.location.href = 'admin.html';
        }
    });

    // 4. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5. Cloud Configuration Loader
    async function loadConfig() {
        if (!sb) {
            console.warn("Supabase not initialized. Using defaults.");
            return;
        }
        try {
            const { data } = await sb.from('site_config').select('*');
            if (data) {
                const config = {};
                data.forEach(item => config[item.key] = item.value);

                if (config.aeracraft_current_phase) {
                    document.querySelectorAll('.timeline-entry').forEach(c => c.classList.remove('active'));
                    const active = document.getElementById(`phase-card-${config.aeracraft_current_phase}`);
                    if (active) active.classList.add('active');
                }
                if (config.aeracraft_discord_url) {
                    const discordLink = document.getElementById('discord-link');
                    if (discordLink) discordLink.href = config.aeracraft_discord_url;
                }
                if (config.aeracraft_season_theme) {
                    const themeEl = document.getElementById('current-theme');
                    if(themeEl) themeEl.textContent = config.aeracraft_season_theme;
                }
                if (config.aeracraft_hall_of_fame) {
                    const winnerEl = document.getElementById('current-winner');
                    if(winnerEl) winnerEl.textContent = config.aeracraft_hall_of_fame;
                }
                if (config.aeracraft_countdown) startCountdown(config.aeracraft_countdown);
            }
        } catch (e) { console.error("Cloud Error:", e); }
    }

    // 6. Countdown Timer
    function startCountdown(date) {
        const target = new Date(date).getTime();
        const update = () => {
            const now = new Date().getTime();
            const diff = target - now;
            if (diff < 0) return;
            
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            const dEl = document.getElementById('days');
            const hEl = document.getElementById('hours');
            const mEl = document.getElementById('mins');
            const sEl = document.getElementById('secs');

            if(dEl) dEl.innerText = d.toString().padStart(2, '0');
            if(hEl) hEl.innerText = h.toString().padStart(2, '0');
            if(mEl) mEl.innerText = m.toString().padStart(2, '0');
            if(sEl) sEl.innerText = s.toString().padStart(2, '0');
        };
        update();
        setInterval(update, 1000);
    }

    // 7. Advanced GSAP Animations
    function animate() {
        if (!window.gsap) return;
        gsap.registerPlugin(ScrollTrigger);

        // --- Mouse Parallax for Hero ---
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            
            gsap.to('.layer-1', {
                x: x * -1,
                y: y * -1,
                duration: 2,
                ease: "power2.out"
            });
            
            gsap.to('.layer-2', {
                x: x * 0.5,
                y: y * 0.5,
                duration: 2,
                ease: "power2.out"
            });
        });

        // --- Hero Reveal Timeline (Vxlancity Style) ---
        const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 }});
        
        tl.from(".badge-new", { 
            y: 30, 
            opacity: 0 
        }, "+=0.2") // Small delay instead of navbar animation
        .from(".hero-title", { 
            y: 100, // Deep reveal
            opacity: 0,
            duration: 1.4
        }, "-=1")
        .from(".hero-desc", { 
            y: 30, 
            opacity: 0 
        }, "-=1.1")
        .from(".countdown-glass", { 
            scale: 0.9, 
            opacity: 0,
            duration: 1
        }, "-=1")
        .from(".hero-btns", { 
            y: 20, 
            opacity: 0 
        }, "-=0.9")
        .from(".scroll-indicator", { 
            opacity: 0 
        }, "-=0.5");

        // --- Scroll Triggers for Sections ---
        gsap.utils.toArray(".section-header").forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // --- Timeline Entry Unfold ---
        gsap.utils.toArray(".timeline-entry").forEach((entry, i) => {
            gsap.from(entry, {
                scrollTrigger: {
                    trigger: entry,
                    start: "top 90%",
                },
                x: i % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 1.2,
                ease: "expo.out"
            });
        });

        // --- Phase Comparison Table Reveal ---
        gsap.from(".phase-comparison", {
            scrollTrigger: {
                trigger: ".phase-comparison",
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });

        // --- Hall of Fame Reveal ---
        gsap.from(".hall-glass", {
            scrollTrigger: {
                trigger: ".hall-glass",
                start: "top 80%",
            },
            scale: 0.95,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });

        // --- Background Parallax on Scroll ---
        gsap.to(".layer-1", {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: true
            },
            y: "20%",
            ease: "none"
        });
    }

    // 8. Live Minecraft Status
    async function fetchPlayerCount() {
        const ip = "play.aeracraft.net";
        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${ip}`);
            const data = await response.json();
            const countEl = document.getElementById('player-count');
            if (countEl && data.online) {
                countEl.innerText = data.players.online;
                document.getElementById('online-status').style.opacity = '1';
            } else if (countEl) {
                countEl.innerText = "0";
            }
        } catch (e) { console.error("MC Status Error:", e); }
    }

    // Initialize logic then animations
    loadConfig().finally(() => {
        animate();
        fetchPlayerCount();
        setInterval(fetchPlayerCount, 60000); // Update every minute
    });
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initAeraCraft);
