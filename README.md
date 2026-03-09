# BoomArt - Art Sales Platform

A sales platform for Boomika's paintings, raising funds for Neural teaching students.

## Features

- **Home Page** - About Boomika (high school student), her mission, and artwork stats
- **Gallery** - Browse paintings with description, price, and Add to Cart
- **Pay Now** - QR Code for payment, Print Bill, Clear Cart
- **Manage** - Full CRUD (Create, Read, Update, Delete) for paintings
- **Monthly Sales Report** - Filter by month/year, print report

## Theme

Elegant design with Green, White, and Sea Blue colors. Logo: BoomArt

## How to Run

1. Open `index.html` in a web browser, or
2. Use a local server (recommended for best experience):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (npx)
   npx serve .
   ```
3. Visit http://localhost:8000

## Data Storage

All data (paintings, cart, sales) is stored in browser localStorage. No backend required.

## Adding Your Paintings

1. Go to **Manage** page
2. Fill in: Title, Description, Price, Image URL
3. Click "Add Painting"

Use image URLs from your own hosting, Unsplash, or other image services.
