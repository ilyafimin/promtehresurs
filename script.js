// ========================================
// Cookie Notice
// ========================================
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieNotice').style.display = 'none';
}

(function initCookieNotice() {
    if (localStorage.getItem('cookiesAccepted')) {
        document.getElementById('cookieNotice').style.display = 'none';
    }
})();

// ========================================
// Header Scroll Effect
// ========================================
(function headerScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
})();

// ========================================
// Mobile Menu
// ========================================
(function mobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    
    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            btn.classList.toggle('active');
        });
        
        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                btn.classList.remove('active');
            });
        });
    }
})();

// ========================================
// Smooth Scroll
// ========================================
(function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

// ========================================
// Phone Mask
// ========================================
(function phoneMask() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                
                let formatted = '+7';
                
                if (value.length > 0) {
                    formatted += ' (' + value.substring(0, 3);
                }
                if (value.length > 3) {
                    formatted += ') ' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formatted += '-' + value.substring(6, 8);
                }
                if (value.length > 8) {
                    formatted += '-' + value.substring(8, 10);
                }
                
                e.target.value = formatted;
            }
        });
    }
})();

// ========================================
// Form Submission
// ========================================
(function formSubmit() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Validate required fields
            if (!data.name || !data.phone) {
                showNotification('Пожалуйста, заполните обязательные поля: Имя и Телефон', 'error');
                return;
            }
            
            // Get submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            try {
                const response = await fetch('/api/send-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.', 'success');
                    this.reset();
                } else {
                    showNotification(result.message || 'Ошибка отправки. Попробуйте позже.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Ошибка отправки. Попробуйте позже.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
})();

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease forwards;
        max-width: 400px;
    `;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            .notification-icon {
                font-size: 18px;
            }
            .notification-message {
                font-size: 14px;
                font-weight: 500;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}


// ========================================
// Modal Functions
// ========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Product Details Data
const productDetailsData = {
    aluminum: {
        title: 'Алюминий',
        description: 'Алюминий — легкий, коррозионностойкий металл с высокой электропроводностью. Широко используется в машиностроении, строительстве, электротехнике и упаковочной промышленности.',
        specs: {
            'Марки сплавов': ['А5', 'А7', 'А85', 'АД0', 'АД1', 'АМц', 'АМг2', 'Д1', 'Д16'],
            'Формы выпуска': ['Чушки весом 15-20 кг', 'Слитки', 'Заготовки', 'Вторичные сплавы'],
            'ГОСТ': ['ГОСТ 11069-2001', 'ГОСТ 295-98', 'ГОСТ 1583-93'],
            'Чистота': ['99.5% - 99.85%', 'Первичный алюминий']
        },
        applications: ['Машиностроение и авиация', 'Строительные конструкции', 'Электротехника', 'Упаковочные материалы', 'Посуда и бытовая техника']
    },
    copper: {
        title: 'Медь',
        description: 'Медь — пластичный металл с высокой электро- и теплопроводностью. Незаменима в электротехнике, строительстве и производстве теплообменного оборудования.',
        specs: {
            'Марки сплавов': ['М0', 'М1', 'М2', 'М3', 'М1р', 'М2р', 'М3р'],
            'Формы выпуска': ['Катоды', 'Слитки', 'Лом и отходы производства', 'Заготовки'],
            'ГОСТ': ['ГОСТ 859-2014', 'ГОСТ 2112-98', 'ГОСТ 193-79'],
            'Чистота': ['99.99% катоды', '99.9% - 99.95% слитки']
        },
        applications: ['Электротехника и кабельное производство', 'Строительство (кровля, фасады)', 'Теплообменники и радиаторы', 'Ювелирное дело', 'Химическая промышленность']
    },
    zinc: {
        title: 'Цинк',
        description: 'Цинк — металл с хорошей коррозионной стойкостью. Основное применение — гальваническое покрытие стали и производство сплавов для литья.',
        specs: {
            'Марки сплавов': ['Ц0', 'Ц1', 'Ц2', 'Ц3', 'Ц4', 'ЦА4', 'ЦАМ'],
            'Формы выпуска': ['Чушки весом 19-25 кг', 'Аноды', 'Изделия', 'Сплавы под заливку'],
            'ГОСТ': ['ГОСТ 3640-79', 'ГОСТ 21437-95', 'ГОСТ 25140-93'],
            'Чистота': ['99.995% - 99.99%']
        },
        applications: ['Гальванизация стали', 'Литейное производство', 'Химическая промышленность', 'Производство аккумуляторов', 'Оцинкованный прокат']
    },
    lead: {
        title: 'Свинец',
        description: 'Свинец — тяжелый металл с высокой плотностью и радиационной защитой. Используется в аккумуляторной промышленности, химии и защите от излучения.',
        specs: {
            'Марки сплавов': ['С0', 'С1', 'С2', 'С3', 'Свинцово-сурьмянистые'],
            'Формы выпуска': ['Чушки весом 30-40 кг', 'Аноды', 'Гранулы', 'Лом аккумуляторный'],
            'ГОСТ': ['ГОСТ 3778-98', 'ГОСТ 1293-2014', 'ГОСТ 15467-79'],
            'Чистота': ['99.99% - 99.94%']
        },
        applications: ['Аккумуляторное производство', 'Защита от радиации', 'Припои и припоечные сплавы', 'Химическая промышленность', 'Кабельное производство']
    }
};

// Show Product Details Modal
function showProductDetails(productId) {
    const product = productDetailsData[productId];
    if (!product) return;
    
    const modalBody = document.getElementById('productModalBody');
    
    // Icon based on product type
    let iconSvg = '';
    switch(productId) {
        case 'aluminum':
            iconSvg = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
            </svg>`;
            break;
        case 'copper':
            iconSvg = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>`;
            break;
        case 'zinc':
            iconSvg = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
            </svg>`;
            break;
        case 'lead':
            iconSvg = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path>
            </svg>`;
            break;
    }
    
    let specsHtml = '';
    for (const [category, values] of Object.entries(product.specs)) {
        specsHtml += `
            <div class="spec-group">
                <h4>${category}</h4>
                <ul class="spec-list">
                    ${Array.isArray(values) ? values.map(v => `<li><span></span><span>${v}</span></li>`).join('') : `<li><span></span><span>${values}</span></li>`}
                </ul>
            </div>
        `;
    }
    
    const applicationsHtml = product.applications.map(app => `<li>${app}</li>`).join('');
    
    modalBody.innerHTML = `
        <div class="product-modal-header">
            ${iconSvg}
            <div>
                <h2>${product.title}</h2>
                <p>Оптовая торговля цветными металлами</p>
            </div>
        </div>
        
        <div class="product-specs">
            ${specsHtml}
        </div>
        
        <div class="product-description">
            <h4>Описание</h4>
            <p>${product.description}</p>
        </div>
        
        <div class="product-description">
            <h4>Области применения</h4>
            <ul style="margin: 0; padding-left: 20px;">
                ${applicationsHtml}
            </ul>
        </div>
        
        <div class="product-order">
            <p>Для получения актуальных цен и условий поставки оставьте заявку или свяжитесь с нами</p>
            <a href="#contacts" class="btn btn-primary" onclick="closeProductModal()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Получить консультацию
            </a>
        </div>
    `;
    
    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Product Modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
(function closeModalOnOverlay() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();

// ========================================
// Counter Animation
// ========================================
(function counterAnimation() {
    const counters = document.querySelectorAll('.hero-stat-num, .stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent;
                const isPercentage = target.includes('%');
                const isPlus = target.includes('+');
                const numericValue = parseInt(target.replace(/\D/g, ''));
                
                if (!isNaN(numericValue)) {
                    animateCounter(counter, numericValue, isPercentage, isPlus);
                }
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
})();

function animateCounter(element, target, isPercentage, isPlus) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += step;
        
        if (current >= target) {
            element.textContent = isPercentage ? `${target}%` : 
                                  isPlus ? `${target}+` : `${target}`;
            clearInterval(timer);
        } else {
            element.textContent = isPercentage ? `${Math.floor(current)}%` : 
                                  isPlus ? `${Math.floor(current)}+` : `${Math.floor(current)}`;
        }
    }, 15);
}

// ========================================
// Initialize on DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // All initializations are done above
    console.log('Site initialized');
});
