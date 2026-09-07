// Main Application Entry Point
document.addEventListener('DOMContentLoaded', function() {
  console.log('🍞 Golden Loaf Bakery Frontend initialized');
  console.log('Config:', CONFIG);
  
  // Initialize app
  App.init();
});

const App = {
  currentPage: 'home',
  
  init() {
    this.renderNavbar();
    this.renderFooter();
    this.setupRouting();
    this.loadPage('home');
  },
  
  renderNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;
    
    navbarContainer.innerHTML = `
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a href="#home" onclick="App.navigate('home')" class="logo">
              🍞 ${CONFIG.APP_NAME}
            </a>
          </div>
          <div class="navbar-menu">
            <a href="#home" onclick="App.navigate('home')" class="nav-link">Home</a>
            <a href="#shop" onclick="App.navigate('shop')" class="nav-link">Shop</a>
            <a href="#about" onclick="App.navigate('about')" class="nav-link">About</a>
            <a href="#contact" onclick="App.navigate('contact')" class="nav-link">Contact</a>
          </div>
        </div>
      </nav>
    `;
  },
  
  renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;
    
    const year = new Date().getFullYear();
    
    footerContainer.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-section">
              <h3>🍞 ${CONFIG.APP_NAME}</h3>
              <p>${CONFIG.TAGLINE}</p>
            </div>
            <div class="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>${CONFIG.PHONE_NUMBER || 'Phone: TBD'}</li>
                <li>${CONFIG.EMAIL || 'Email: TBD'}</li>
                <li>${CONFIG.ADDRESS || 'Address: TBD'}</li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Follow Us</h4>
              <div class="social-links">
                ${CONFIG.FACEBOOK_URL ? `<a href="${CONFIG.FACEBOOK_URL}" target="_blank">Facebook</a>` : ''}
                ${CONFIG.INSTAGRAM_URL ? `<a href="${CONFIG.INSTAGRAM_URL}" target="_blank">Instagram</a>` : ''}
                ${CONFIG.TIKTOK_URL ? `<a href="${CONFIG.TIKTOK_URL}" target="_blank">TikTok</a>` : ''}
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; ${year} ${CONFIG.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  },
  
  setupRouting() {
    // Hash-based routing
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'home';
      this.loadPage(hash);
    });
  },
  
  navigate(page) {
    window.location.hash = page;
  },
  
  loadPage(page) {
    const pageContainer = document.getElementById('page-container');
    if (!pageContainer) return;
    
    this.currentPage = page;
    
    switch(page) {
      case 'home':
        this.loadHome();
        break;
      case 'shop':
        this.loadShop();
        break;
      case 'about':
        this.loadAbout();
        break;
      case 'contact':
        this.loadContact();
        break;
      default:
        this.loadHome();
    }
  },
  
  loadHome() {
    const pageContainer = document.getElementById('page-container');
    if (!pageContainer) return;
    
    pageContainer.innerHTML = `
      <section class="hero">
        <div class="hero-content">
          <h1>Made With Passion</h1>
          <h2>Freshly Baked</h2>
          <p>Every Single Day</p>
          <p class="hero-description">We bake with passion, using the finest ingredients to bring you the most delicious experience.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="App.navigate('shop')">Shop Now</button>
            <button class="btn btn-outline" onclick="App.navigate('about')">Our Story</button>
          </div>
        </div>
      </section>
      
      <section class="services" style="padding: 3rem 0;">
        <div class="container">
          <h2 style="text-align: center; margin-bottom: 2rem;">Why Choose Us</h2>
          <div class="grid grid-4">
            <div class="service-card">
              <div class="service-icon">🌾</div>
              <h3>Quality Ingredients</h3>
              <p>We use only the finest, freshest ingredients</p>
            </div>
            <div class="service-card">
              <div class="service-icon">❤️</div>
              <h3>Made With Care</h3>
              <p>Every product is made with love and attention</p>
            </div>
            <div class="service-card">
              <div class="service-icon">⚡</div>
              <h3>Fresh Daily</h3>
              <p>Baked fresh every morning for you</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🚚</div>
              <h3>Easy Ordering</h3>
              <p>Quick and convenient ordering process</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="best-sellers" style="padding: 3rem 0; background: var(--soft-beige);">
        <div class="container">
          <h2 style="text-align: center; margin-bottom: 2rem;">Best Sellers</h2>
          <div id="bestsellers-container" class="grid grid-3">
            <div class="loading">Loading products...</div>
          </div>
        </div>
      </section>
    `;
    
    // Load best sellers
    this.loadBestSellers();
  },
  
  async loadBestSellers() {
    try {
      const container = document.getElementById('bestsellers-container');
      const products = await ApiService.getProducts();
      const bestSellers = products.filter(p => p.bestSeller);
      
      if (bestSellers.length === 0) {
        container.innerHTML = '<div class="empty-state">No products available right now.</div>';
        return;
      }
      
      container.innerHTML = bestSellers.map(product => `
        <div class="product-card">
          <div class="product-image">📦</div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="product-price">${CONFIG.CURRENCY} ${product.price}</p>
          <button class="btn btn-primary" onclick="App.navigate('shop')">View Details</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading best sellers:', error);
      const container = document.getElementById('bestsellers-container');
      if (container) {
        container.innerHTML = '<div class="error-message">Unable to load products. Please try again.</div>';
      }
    }
  },
  
  loadShop() {
    const pageContainer = document.getElementById('page-container');
    if (!pageContainer) return;
    
    pageContainer.innerHTML = `
      <section style="padding: 2rem 0;">
        <div class="container">
          <h1>Shop</h1>
          <p>Browse our delicious selection of freshly baked goods</p>
          
          <div id="products-container" class="grid grid-3" style="margin-top: 2rem;">
            <div class="loading">Loading products...</div>
          </div>
        </div>
      </section>
    `;
    
    this.loadProducts();
  },
  
  async loadProducts() {
    try {
      const container = document.getElementById('products-container');
      const products = await ApiService.getProducts();
      
      if (products.length === 0) {
        container.innerHTML = '<div class="empty-state">No products available right now.</div>';
        return;
      }
      
      container.innerHTML = products.map(product => `
        <div class="product-card">
          <div class="product-image">📦</div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="product-price">${CONFIG.CURRENCY} ${product.price}</p>
          ${product.featured ? '<span class="badge">Featured</span>' : ''}
          ${product.bestSeller ? '<span class="badge">Best Seller</span>' : ''}
          <button class="btn btn-primary">Add to Cart</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading products:', error);
      const container = document.getElementById('products-container');
      if (container) {
        container.innerHTML = '<div class="error-message">Unable to load products. Please try again.</div>';
      }
    }
  },
  
  loadAbout() {
    const pageContainer = document.getElementById('page-container');
    if (!pageContainer) return;
    
    pageContainer.innerHTML = `
      <section style="padding: 2rem 0;">
        <div class="container">
          <h1>About Us</h1>
          
          <div class="card" style="margin: 2rem 0;">
            <h2>Our Story</h2>
            <p>The Golden Loaf Bakery was founded with a simple mission: to bring freshly baked, high-quality bakery products to our community. We believe in the power of traditional baking methods combined with modern convenience.</p>
          </div>
          
          <div class="card" style="margin: 2rem 0;">
            <h2>Our Values</h2>
            <ul style="padding-left: 1.5rem;">
              <li>Quality - Only the finest ingredients</li>
              <li>Freshness - Baked daily with care</li>
              <li>Tradition - Respecting time-honored recipes</li>
              <li>Community - Serving with passion</li>
            </ul>
          </div>
          
          <div class="card" style="margin: 2rem 0;">
            <h2>Why Choose Us</h2>
            <p>Every product that leaves our kitchen is made with love and attention to detail. We source our ingredients carefully to ensure the best taste and quality for our customers.</p>
          </div>
        </div>
      </section>
    `;
  },
  
  loadContact() {
    const pageContainer = document.getElementById('page-container');
    if (!pageContainer) return;
    
    pageContainer.innerHTML = `
      <section style="padding: 2rem 0;">
        <div class="container">
          <h1>Contact Us</h1>
          
          <div class="grid grid-2" style="margin-top: 2rem;">
            <div class="card">
              <h2>Get In Touch</h2>
              <p><strong>Phone:</strong> ${CONFIG.PHONE_NUMBER || 'Not available'}</p>
              <p><strong>Email:</strong> ${CONFIG.EMAIL || 'Not available'}</p>
              <p><strong>Address:</strong> ${CONFIG.ADDRESS || 'Not available'}</p>
              <p><strong>Hours:</strong> ${CONFIG.OPENING_HOURS || 'Not available'}</p>
            </div>
            
            <div class="card">
              <h2>Connect With Us</h2>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${CONFIG.FACEBOOK_URL ? `<button class="btn btn-secondary" onclick="window.open('${CONFIG.FACEBOOK_URL}')">Facebook</button>` : ''}
                ${CONFIG.INSTAGRAM_URL ? `<button class="btn btn-secondary" onclick="window.open('${CONFIG.INSTAGRAM_URL}')">Instagram</button>` : ''}
                ${CONFIG.WHATSAPP_NUMBER ? `<button class="btn btn-secondary" onclick="window.open('https://wa.me/${CONFIG.WHATSAPP_NUMBER}')">WhatsApp</button>` : ''}
                ${CONFIG.TIKTOK_URL ? `<button class="btn btn-secondary" onclick="window.open('${CONFIG.TIKTOK_URL}')">TikTok</button>` : ''}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
};
