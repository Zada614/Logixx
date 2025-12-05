// ============================================
// DataHub ВУЗ РК — JavaScript
// Interactive University Catalog Platform
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initAnimatedCounters();
    initFilterButtons();
    initMapInteraction();
    initCompareSlots();
    initCalculator();
    initQuizModal();
    initReviewsSlider();
    initSmoothScroll();
    initScrollAnimations();
    initChatDemo();
});

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        }
    });
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenuBtn.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// ============================================
// Animated Counters
// ============================================
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    requestAnimationFrame(update);
}

function formatNumber(num) {
    if (num >= 1000) {
        return num.toLocaleString('ru-RU');
    }
    return num.toString();
}

// ============================================
// Filter Buttons
// ============================================
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            // Filter animation
            const cards = document.querySelectorAll('.uni-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    });
}

// ============================================
// Map Interaction
// ============================================
function initMapInteraction() {
    const cityDots = document.querySelectorAll('.city-dot');
    const mapPopup = document.getElementById('mapPopup');
    const popupClose = document.querySelector('.popup-close');
    
    const cityData = {
        'astana': { name: 'Астана қаласы', unis: 18, programs: '800+' },
        'almaty': { name: 'Алматы қаласы', unis: 32, programs: '1500+' },
        'shymkent': { name: 'Шымкент қаласы', unis: 8, programs: '350+' },
        'karaganda': { name: 'Қарағанды қаласы', unis: 12, programs: '500+' },
        'aktobe': { name: 'Ақтөбе қаласы', unis: 5, programs: '200+' },
        'turkestan': { name: 'Түркістан қаласы', unis: 4, programs: '180+' }
    };
    
    cityDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const city = dot.getAttribute('data-city');
            const data = cityData[city];
            
            if (data && mapPopup) {
                const header = mapPopup.querySelector('.popup-header h4');
                const content = mapPopup.querySelector('.popup-content');
                
                header.textContent = data.name;
                content.innerHTML = `
                    <p><strong>${data.unis}</strong> университет</p>
                    <p><strong>${data.programs}</strong> бағдарлама</p>
                    <button class="popup-btn">Университеттерді көру</button>
                `;
                
                // Position popup near the dot
                const rect = dot.getBoundingClientRect();
                const mapDisplay = document.querySelector('.map-display');
                const mapRect = mapDisplay.getBoundingClientRect();
                
                mapPopup.style.left = (rect.left - mapRect.left + 20) + 'px';
                mapPopup.style.top = (rect.top - mapRect.top - 50) + 'px';
                mapPopup.classList.add('active');
            }
        });
        
        // Hover effect
        dot.addEventListener('mouseenter', () => {
            dot.style.transform = 'scale(1.3)';
            dot.style.filter = 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.5))';
        });
        
        dot.addEventListener('mouseleave', () => {
            dot.style.transform = 'scale(1)';
            dot.style.filter = 'none';
        });
    });
    
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            mapPopup.classList.remove('active');
        });
    }
    
    // Map result items
    const resultItems = document.querySelectorAll('.map-result-item');
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            resultItems.forEach(i => i.style.background = 'white');
            item.style.background = 'var(--primary)';
            item.style.color = 'white';
        });
    });
}

// ============================================
// Compare Slots
// ============================================
function initCompareSlots() {
    const emptySlots = document.querySelectorAll('.compare-slot.empty');
    const removeBtns = document.querySelectorAll('.remove-btn');
    const compareBtns = document.querySelectorAll('.btn-compare');
    
    // Empty slot click
    emptySlots.forEach(slot => {
        slot.addEventListener('click', () => {
            showNotification('Университетті таңдау үшін карточкадағы "Салыстыру" батырмасын басыңыз');
        });
    });
    
    // Remove button
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const slot = btn.closest('.compare-slot');
            
            // Animate removal
            slot.style.transform = 'scale(0.8)';
            slot.style.opacity = '0';
            
            setTimeout(() => {
                slot.classList.remove('filled');
                slot.classList.add('empty');
                slot.innerHTML = `
                    <div class="add-slot">
                        <i class="fas fa-plus"></i>
                        <span>Қосу</span>
                    </div>
                `;
                slot.style.transform = 'scale(1)';
                slot.style.opacity = '1';
            }, 300);
        });
    });
    
    // Compare buttons on cards
    compareBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.uni-card');
            const uniName = card.querySelector('h3').textContent;
            
            // Find empty slot
            const emptySlot = document.querySelector('.compare-slot.empty');
            if (emptySlot) {
                emptySlot.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    emptySlot.classList.remove('empty');
                    emptySlot.classList.add('filled');
                    emptySlot.innerHTML = `
                        <button class="remove-btn"><i class="fas fa-times"></i></button>
                        <div class="slot-logo">
                            <i class="fas fa-university"></i>
                        </div>
                        <h4>${uniName.substring(0, 15)}...</h4>
                    `;
                    emptySlot.style.transform = 'scale(1)';
                    
                    // Re-init remove buttons
                    initCompareSlots();
                }, 200);
                
                showNotification(`${uniName} салыстыруға қосылды!`, 'success');
            } else {
                showNotification('Салыстыру тізімі толы! Алдымен біреуін өшіріңіз.', 'warning');
            }
        });
    });
}

// ============================================
// Cost Calculator
// ============================================
function initCalculator() {
    const expensesRange = document.getElementById('calcExpenses');
    const rangeValue = document.querySelector('.range-value');
    const calcBtn = document.querySelector('.calc-btn');
    
    // Update range value display
    if (expensesRange) {
        expensesRange.addEventListener('input', () => {
            const value = parseInt(expensesRange.value).toLocaleString('ru-RU');
            rangeValue.textContent = value + ' ₸';
        });
    }
    
    // Calculate button
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateCost);
    }
}

function calculateCost() {
    const university = document.getElementById('calcUniversity').value;
    const years = parseInt(document.getElementById('calcYears').value);
    const living = document.getElementById('calcLiving').value;
    const expenses = parseInt(document.getElementById('calcExpenses').value);
    
    // Tuition costs
    const tuitionCosts = {
        'kaznu': 800000,
        'nu': 0,
        'satbayev': 900000,
        'kimep': 2500000
    };
    
    // Living costs per month
    const livingCosts = {
        'dorm': 15000,
        'rent': 120000,
        'home': 0
    };
    
    const tuition = tuitionCosts[university] * years;
    const livingTotal = livingCosts[living] * 12 * years;
    const expensesTotal = expenses * 12 * years;
    const total = tuition + livingTotal + expensesTotal;
    
    // Update display with animation
    const totalAmount = document.querySelector('.total-amount');
    const breakdownItems = document.querySelectorAll('.breakdown-value');
    
    animateValue(totalAmount, total);
    
    if (breakdownItems.length >= 3) {
        breakdownItems[0].textContent = tuition.toLocaleString('ru-RU') + ' ₸';
        breakdownItems[1].textContent = livingTotal.toLocaleString('ru-RU') + ' ₸';
        breakdownItems[2].textContent = expensesTotal.toLocaleString('ru-RU') + ' ₸';
    }
    
    // Update tip
    const tip = document.querySelector('.result-tip p');
    if (tip && tuition > 0) {
        tip.textContent = `Грант алсаңыз, ~${tuition.toLocaleString('ru-RU')} ₸ үнемдейсіз!`;
    } else if (tip) {
        tip.textContent = 'Сіз грантпен оқисыз — тамаша таңдау!';
    }
}

function animateValue(element, target) {
    const duration = 1000;
    const start = parseInt(element.textContent.replace(/\D/g, '')) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString('ru-RU');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================
// Quiz Modal
// ============================================
function initQuizModal() {
    const quizModal = document.getElementById('quizModal');
    const aiStartBtn = document.querySelector('.btn-ai-start');
    const modalClose = document.querySelector('.modal-close');
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    // Open modal
    if (aiStartBtn) {
        aiStartBtn.addEventListener('click', () => {
            quizModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            quizModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on outside click
    if (quizModal) {
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                quizModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Quiz options
    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected from all
            quizOptions.forEach(o => {
                o.style.borderColor = 'var(--border)';
                o.style.background = 'var(--bg-primary)';
            });
            
            // Add selected
            option.style.borderColor = 'var(--primary)';
            option.style.background = 'rgba(37, 99, 235, 0.1)';
            
            // Animate progress
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.quiz-progress span');
            
            setTimeout(() => {
                progressFill.style.width = '40%';
                progressText.textContent = '2/5 сұрақ';
                
                showNotification('Жақсы таңдау! Келесі сұраққа өтіңіз.', 'success');
            }, 500);
        });
    });
}

// ============================================
// Reviews Slider
// ============================================
function initReviewsSlider() {
    const prevBtn = document.querySelector('.reviews-nav .prev');
    const nextBtn = document.querySelector('.reviews-nav .next');
    const dots = document.querySelectorAll('.nav-dots .dot');
    const reviewCards = document.querySelectorAll('.review-card');
    
    let currentSlide = 0;
    
    function updateSlider(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // On mobile, animate cards
        if (window.innerWidth < 768) {
            reviewCards.forEach((card, i) => {
                card.style.display = i === index ? 'block' : 'none';
            });
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide > 0 ? currentSlide - 1 : 2;
            updateSlider(currentSlide);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = currentSlide < 2 ? currentSlide + 1 : 0;
            updateSlider(currentSlide);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider(currentSlide);
        });
    });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .uni-card, .timeline-item, .review-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// AI Chat Demo
// ============================================
function initChatDemo() {
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');
    const quickReplies = document.querySelectorAll('.quick-replies button');
    
    // Quick replies
    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            addUserMessage(btn.textContent);
            
            setTimeout(() => {
                addBotMessage(getBotResponse(btn.textContent));
            }, 1000);
        });
    });
    
    // Send message
    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            
            setTimeout(() => {
                addBotMessage(getBotResponse(message));
            }, 1000);
        }
    }
    
    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message user';
        msg.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message bot';
        msg.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getBotResponse(input) {
        const lower = input.toLowerCase();
        
        if (lower.includes('математика') || lower.includes('информатика')) {
            return 'IT саласы сізге өте сай келеді! Назарбаев Университеті мен ҚазҰУ-дың Computer Science бағдарламаларын қараңыз.';
        } else if (lower.includes('биология') || lower.includes('медицина')) {
            return 'Медицина саласы тамаша таңдау! ҚазҰМУ және Астана медицина университетін ұсынамын.';
        } else if (lower.includes('тарих') || lower.includes('тіл')) {
            return 'Гуманитарлық бағыт қызықты! ҚазҰУ мен ЕНУ-дың филология факультеттерін қараңыз.';
        } else if (lower.includes('экономика') || lower.includes('бизнес')) {
            return 'Бизнес саласы перспективалы! КИМЭП, Нархоз және КАЗГЮУ университеттерін ұсынамын.';
        } else {
            return 'Сізге көмектесуге дайынмын! Қандай пәндер ұнайды немесе қай салада жұмыс істегіңіз келетінін айтыңыз.';
        }
    }
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#2563eb',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        fontFamily: 'Outfit, sans-serif'
    });
    
    document.body.appendChild(notification);
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Search Functionality
// ============================================
document.querySelector('.search-btn')?.addEventListener('click', function() {
    const searchInput = document.querySelector('.search-box input');
    const query = searchInput.value.trim();
    
    if (query) {
        showNotification(`"${query}" бойынша іздеу жүргізілуде...`, 'info');
        
        // Scroll to universities section
        setTimeout(() => {
            document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    } else {
        showNotification('Іздеу сөзін енгізіңіз', 'warning');
    }
});

// Search tags
document.querySelectorAll('.search-tags .tag').forEach(tag => {
    tag.addEventListener('click', function() {
        const searchInput = document.querySelector('.search-box input');
        searchInput.value = this.textContent;
        showNotification(`"${this.textContent}" бойынша іздеу...`, 'info');
    });
});

// ============================================
// Details Buttons
// ============================================
document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.uni-card');
        const uniName = card.querySelector('h3').textContent;
        showNotification(`${uniName} туралы толық ақпарат жүктелуде...`, 'info');
    });
});

// ============================================
// Video Review Play
// ============================================
document.querySelectorAll('.review-video').forEach(video => {
    video.addEventListener('click', function() {
        showNotification('Видео-пікір жүктелуде...', 'info');
    });
});

// ============================================
// Newsletter Form
// ============================================
document.querySelector('.newsletter-form button')?.addEventListener('click', function() {
    const input = this.previousElementSibling;
    const email = input.value.trim();
    
    if (email && email.includes('@')) {
        showNotification('Сіз жаңалықтарға сәтті жазылдыңыз!', 'success');
        input.value = '';
    } else {
        showNotification('Дұрыс email мекенжайын енгізіңіз', 'warning');
    }
});

// ============================================
// Gamification Banner
// ============================================
document.querySelector('.gamification-btn')?.addEventListener('click', function() {
    showNotification('🎮 Жетістіктер жүйесі жақында қосылады!', 'info');
});

// ============================================
// 3D Tour Button (if exists)
// ============================================
document.querySelectorAll('[data-action="3d-tour"]').forEach(btn => {
    btn.addEventListener('click', function() {
        showNotification('🏛️ 3D-тур жүктелуде...', 'info');
    });
});

console.log('🎓 DataHub ВУЗ РК initialized successfully!');
