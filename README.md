# Whiskery & Frost — Artisan Bakery Web Application

Whiskery & Frost is a production-grade full stack bakery web application built using a modern 3-tier architecture. Customers can browse a live menu, manage cart items, complete checkout, and place orders stored securely in the cloud database.

---

## Features

### User Features
- Live menu fetched from MongoDB Atlas database  
- Category filtering: Breads, Pastries, Muffins, Cakes, Beverages  
- Add to cart with quantity management  
- Real-time subtotal and total calculation  
- Multi-step checkout: Basket → Address → Payment → Confirmation  
- Saved addresses and new address form with validation  
- Payment options: UPI or Cash on Delivery  
- Unique order ID generation  
- Fully responsive UI for mobile, tablet, and desktop  

### Technical Features
- 3-tier architecture (Frontend → Backend → Database)  
- RESTful API design with proper HTTP methods and status codes  
- Schema-based modelling with Mongoose  
- Environment-based configuration using `.env`  
- Secure handling of credentials  
- Order snapshot persistence for accuracy  
- Backend-controlled database communication  

---

## Technology Stack

### Frontend
- React 18  
- Vite  
- Custom CSS3 design system  
- Google Fonts integration  

### Backend
- Node.js  
- Express.js  
- MongoDB Atlas (NoSQL database)  
- Mongoose ODM  
- CORS middleware  
- dotenv configuration  

---


---

## Setup Instructions

### Install Dependencies
```bash
npm install
cd server
npm install