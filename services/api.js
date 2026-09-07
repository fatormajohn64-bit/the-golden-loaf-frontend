// API Service Module
const ApiService = {
  baseURL: CONFIG.API_URL,
  
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  },
  
  // Products
  async getProducts() {
    try {
      const response = await this.fetch('/api/products');
      return response.data || response || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  async getProduct(id) {
    try {
      const response = await this.fetch(`/api/products/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },
  
  // Posts
  async getPosts() {
    try {
      const response = await this.fetch('/api/posts');
      return response.data || response || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },
  
  async getPost(id) {
    try {
      const response = await this.fetch(`/api/posts/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },
  
  // Orders
  async getOrders() {
    try {
      const response = await this.fetch('/api/orders');
      return response.data || response || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },
  
  async createOrder(orderData) {
    try {
      const response = await this.fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      return response.data || response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};
