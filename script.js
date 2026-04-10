// Theme Management
const themeToggle = document.getElementById('theme-toggle');

if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.remove('light-mode');
    if(themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
} else {
    document.body.classList.add('light-mode');
    if(themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    });
}

// Global Chatbot Widget (used on index.html)
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const closeChat = document.getElementById('close-chat');
const sendChat = document.getElementById('send-chat');
const chatInput = document.getElementById('chat-input');
const chatMsgs = document.getElementById('chatbot-messages');

if(chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
        chatbotToggle.style.display = 'none';
    });

    closeChat.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        chatbotToggle.style.display = 'flex';
    });

    const appendMsg = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg msg-${type}`;
        msgDiv.textContent = text;
        chatMsgs.appendChild(msgDiv);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    };

    const handleSend = () => {
        const text = chatInput.value.trim();
        if(text) {
            appendMsg(text, 'user');
            chatInput.value = '';
            
            // Simulate AI typing
            setTimeout(() => {
                const responses = [
                    "We specialize in automated bookkeeping and strategic tax planning.",
                    "Our AI systems can integrate and analyze data from QuickBooks, Xero, and more.",
                    "To consult a dedicated advisor, please register via our Client Portal.",
                    "Reducing liabilities legally is one of our core competencies. I can help you schedule a meeting."
                ];
                const reply = responses[Math.floor(Math.random() * responses.length)];
                appendMsg(reply, 'ai');
            }, 1000);
        }
    };

    if(sendChat) sendChat.addEventListener('click', handleSend);
    if(chatInput) chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleSend();
    });

    // Talk to AI CTA mapping
    const openAIChat = document.getElementById('open-ai-chat');
    if(openAIChat) {
        openAIChat.addEventListener('click', () => {
            chatbotToggle.click();
        });
    }
}

// Number Counters
const counters = document.querySelectorAll('.counter');
if(counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / 200;
                    
                    if(count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target + (target === 99 ? '%' : '+');
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Canvas Background for Hero Section
const canvas = document.getElementById('canvas-bg');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', (e) => {
        if(e.relatedTarget === null) {
            mouse.x = null;
            mouse.y = null;
        }
    });
    
    const initCanvas = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = canvas.offsetHeight > 0 ? canvas.offsetHeight : window.innerHeight; // dynamic height
        particles = [];
        const numParticles = width < 768 ? 60 : 150;
        
        for(let i=0; i<numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1,
                baseX: Math.random() * width,
                baseY: Math.random() * height
            });
        }
    };
    
    initCanvas();
    window.addEventListener('resize', initCanvas);
    
    const animateCanvas = () => {
        ctx.clearRect(0, 0, width, height);
        
        const isLight = document.body.classList.contains('light-mode');
        const color = isLight ? '15, 28, 46' : '201, 162, 39'; // Navy in light, Gold in dark
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;

            // Mouse interaction (intense repulsion/attraction)
            if(mouse.x != null) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 150) {
                    p.x -= dx * 0.1;
                    p.y -= dy * 0.1;
                }
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, 0.8)`;
            ctx.fill();
            
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if(dist < 200) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${color}, ${0.25 - dist/800})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateCanvas);
    };
    
    animateCanvas();
}

// Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-bounce');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Sticky Navbar Shrink Effect
const navbar = document.querySelector('.navbar');
if(navbar) {
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.style.padding = '0.8rem 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.boxShadow = 'none';
        }
    });
}
