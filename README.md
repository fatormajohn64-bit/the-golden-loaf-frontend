# The Golden Loaf Bakery - Frontend

## Overview

Public customer-facing website for The Golden Loaf Bakery. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Responsive Design** - Works on all devices
- **Home Page** - Hero section with featured products
- **Shop** - Browse all products from the backend
- **About** - Learn about the bakery
- **Contact** - Get in touch with us
- **Dynamic Content** - All data comes from the backend API

## Setup

### Prerequisites
- A modern web browser
- Backend API running (see backend repository)

### Installation

1. Clone the repository
2. Update `config.js` with your API URL and business information:
```javascript
const CONFIG = {
  API_URL: "http://your-backend-url:5000",
  PHONE_NUMBER: "123-456-7890",
  EMAIL: "info@goldenloaf.com",
  // ... other config
};
```

### Running

Serve the files using a local server:

```bash
# Using Python 3
python -m http.server 3000

# Or using Node.js
npx http-server -p 3000
```

Access at: `http://localhost:3000`

## Configuration

Edit `config.js` to update:
- API URL
- Business name and tagline
- Contact information (phone, email, address)
- Social media links
- Operating hours
- Currency settings

## Architecture

```
the-golden-loaf-frontend/
├── index.html
├── config.js
├── css/
│   ├── app.css
│   └── (component CSS files)
├── js/
│   └── app.js
├── components/
│   ├── navbar/
│   ├── footer/
│   └── ...
├── pages/
│   ├── home/
│   ├── shop/
│   ├── about/
│   └── contact/
└── services/
    └── api.js
```

## Notes

- No fake data - all products come from the backend
- Mobile-first responsive design
- Accessible navigation and forms
- Dynamic configuration system

## License

MIT
