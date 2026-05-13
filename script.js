document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SPA ROUTING LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');

    function switchView(targetId) {
        navLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        viewSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(e.target.dataset.target);
        });
    });

    document.getElementById('nav-logo').addEventListener('click', (e) => {
        e.preventDefault();
        switchView('view-catalog');
    });

    // --- 2. REST API INTEGRATION ---
    const productGrid = document.getElementById('product-grid');
    const loader = document.getElementById('catalog-loader');
    const statusBadge = document.getElementById('api-status-badge');
    const statusText = document.getElementById('api-status-text');

    function updateStatus(message, isError = false) {
        statusText.textContent = message;
        if (isError) {
            statusBadge.classList.add('status-err');
            statusBadge.classList.remove('status-ok');
            statusBadge.style.borderColor = 'var(--error-color)';
        } else {
            statusBadge.classList.add('status-ok');
            statusBadge.classList.remove('status-err');
            statusBadge.style.borderColor = 'var(--success-color)';
        }
    }

    let allProducts = [];

    async function fetchHardware() {
        try {
            const response = await fetch('products.json');
            if (response.ok) {
                await new Promise(r => setTimeout(r, 800));
                updateStatus('SYSTEM OK // REST API SYNCHRONIZED');
                allProducts = await response.json();
                renderHardware(allProducts);
                setupFilters();
            } else {
                throw new Error(`ERR: HTTP_${response.status}`);
            }
        } catch (error) {
            console.error('Core Exception:', error);
            // Seamless offline/local fallback if opened directly via file:// protocol
            if (window.location.protocol === 'file:') {
                console.warn('Running via file:// protocol. Activating offline fallback catalog.');
                updateStatus('SYSTEM OK // LOCAL MODE ACTIVATED');
                allProducts = [
                    {
                        "id": "prod_01",
                        "title": "Grovemade Desk Shelf",
                        "category": "Workspace",
                        "price": 240.00,
                        "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000",
                        "description": "Crafted from premium walnut. Elevates your monitor and organizes your essentials.",
                        "badge": "Classic"
                    },
                    {
                        "id": "prod_02",
                        "title": "NuPhy Air75 Keyboard",
                        "category": "Peripherals",
                        "price": 129.00,
                        "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
                        "description": "Ultra-slim wireless mechanical keyboard with low-profile Gateron switches.",
                        "badge": "Popular"
                    },
                    {
                        "id": "prod_03",
                        "title": "MX Master 3S",
                        "category": "Peripherals",
                        "price": 99.00,
                        "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=1000",
                        "description": "Ergonomic precision mouse with quiet clicks and an electromagnetic scroll wheel."
                    },
                    {
                        "id": "prod_04",
                        "title": "Minimalist Desk Pad",
                        "category": "Workspace",
                        "price": 45.00,
                        "image": "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=1000",
                        "description": "Premium matte leather desk mat. Provides a smooth, non-slip surface for deep work."
                    },
                    {
                        "id": "prod_05",
                        "title": "Lamy 2000 Pen",
                        "category": "Stationery",
                        "price": 199.00,
                        "image": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=1000",
                        "description": "An iconic Bauhaus design. Brushed Makrolon and stainless steel fountain pen."
                    },
                    {
                        "id": "prod_06",
                        "title": "reMarkable 2",
                        "category": "Focus",
                        "price": 299.00,
                        "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000",
                        "description": "The next-generation paper tablet. Zero distractions, purely designed for thinking.",
                        "badge": "Bestseller"
                    },
                    {
                        "id": "prod_07",
                        "title": "TP-7 Field Recorder",
                        "category": "Audio",
                        "price": 1499.00,
                        "image": "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=1000",
                        "description": "A pocket-sized engineering marvel. Tactile motorized tape reel and studio-grade sound.",
                        "badge": "Limited"
                    },
                    {
                        "id": "prod_08",
                        "title": "Nothing Phone (2)",
                        "category": "Tech",
                        "price": 599.00,
                        "image": "https://images.unsplash.com/photo-1688649102473-099b9d16aa32?auto=format&fit=crop&q=80&w=1000",
                        "description": "Experience the Glyph Interface. A unique approach to light and sound notifications.",
                        "badge": "New"
                    },
                    {
                        "id": "prod_09",
                        "title": "Sony WH-1000XM5",
                        "category": "Audio",
                        "price": 349.00,
                        "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1000",
                        "description": "Industry-leading noise cancellation. Crystal-clear hands-free calling and Alexa voice control."
                    },
                    {
                        "id": "prod_10",
                        "title": "Keychron Q1 Pro",
                        "category": "Peripherals",
                        "price": 199.00,
                        "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1000",
                        "description": "Fully customizable QMK/VIA wireless mechanical keyboard in a solid aluminum body.",
                        "badge": "Premium"
                    },
                    {
                        "id": "prod_11",
                        "title": "Nomad Base One Max",
                        "category": "Power",
                        "price": 149.00,
                        "image": "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&q=80&w=1000",
                        "description": "Official MagSafe charging at 15W. Weighted glass and metal design for your bedside."
                    },
                    {
                        "id": "prod_12",
                        "title": "Apple Vision Pro",
                        "category": "Computing",
                        "price": 3499.00,
                        "image": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1000",
                        "description": "The ultimate spatial computer. Blend digital content with your physical world seamlessly.",
                        "badge": "Futuristic"
                    }
                ];
                renderHardware(allProducts);
                setupFilters();
            } else {
                updateStatus('ERR: CONNECTION REFUSED', true);
                productGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px; font-family: var(--font-mono); color: var(--error-color);">
                        FATAL_ERROR: Failed to establish REST handshake. Check products.json availability.
                    </div>
                `;
            }
        } finally {
            loader.style.display = 'none';
        }
    }

    function setupFilters() {
        const filterContainer = document.getElementById('category-filters');
        const categories = ['all', ...new Set(allProducts.map(p => p.category))];
        
        filterContainer.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
        `).join('');

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                const filtered = category === 'all' 
                    ? allProducts 
                    : allProducts.filter(p => p.category === category);
                
                renderHardware(filtered);
            });
        });
    }

    function renderHardware(products) {
        if (products.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; font-family: var(--font-mono); color: var(--text-muted);">
                    NO_PRODUCTS_FOUND: Refine your search filters.
                </div>
            `;
            return;
        }

        productGrid.innerHTML = products.map((product, index) => `
            <div class="product-card" style="--animation-order: ${index}">
                <div class="product-content">
                    <div class="product-meta">
                        <div class="product-tag">${product.category}</div>
                        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                    </div>
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.title}" loading="lazy">
                    </div>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        <button class="btn-action">Purchase</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-attach mouse tracking
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // Initialize
    setTimeout(fetchHardware, 500);

    // --- 3. AUTHENTICATION & DASHBOARD ---
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const authErrorMsg = document.getElementById('auth-error-msg');
    
    // Elements to toggle post-login
    const authFormContainer = document.getElementById('auth-form-container');
    const postLoginDashboard = document.getElementById('post-login-dashboard');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const jwtString = document.getElementById('jwt-string');

    authForm.addEventListener('submit', () => {
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();
        
        if (user === 'admin' && pass === 'nit-secure') {
            // Success State
            authErrorMsg.style.display = 'none';
            
            // Generate mock JWT
            const header = btoa(JSON.stringify({alg: "HS256", typ: "JWT"}));
            const payload = btoa(JSON.stringify({usr: "admin", role: "super_user", iat: Date.now()}));
            const sig = "a1b2c3d4e5f6g7h8i9j0";
            jwtString.textContent = `${header}.${payload}.${sig}`;
            
            // UI Transitions
            authFormContainer.style.display = 'none';
            authTitle.textContent = 'DASHBOARD';
            authSubtitle.textContent = 'Welcome back. Architecture specs and active tokens are listed below.';
            
            // Reveal dashboard
            postLoginDashboard.style.display = 'block';
            
        } else {
            // Error State
            authErrorMsg.style.display = 'block';
            usernameInput.style.borderColor = 'var(--error-color)';
            passwordInput.style.borderColor = 'var(--error-color)';
            setTimeout(() => {
                usernameInput.style.borderColor = 'var(--border-color)';
                passwordInput.style.borderColor = 'var(--border-color)';
            }, 1500);
        }
    });

});
