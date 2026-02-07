# 🚗 CARSALE - Premium Automotive Marketplace & Ride Service

![CARSALE Demo](https://carsale-sigma.vercel.app/car.png)

**Live Demo:** [https://carsale-sigma.vercel.app](https://carsale-sigma.vercel.app)

## 📖 About The Project

**CARSALE** is a full-stack Next.js application that serves as a dual-purpose platform: a marketplace for buying/selling premium used cars and a booking service for intercity cab rides.

Built with a **Mobile-First** approach, it features a robust **Admin Dashboard** for managing inventory and bookings, secure authentication, and direct WhatsApp integration for service requests.

### ✨ Key Features

* **🛒 Marketplace:**
    * Browse verified used cars with high-quality image sliders.
    * "Book Now" feature with UPI/UTR payment verification.
    * Mobile-optimized 2-column grid layout for easy browsing.
* **🚖 Intercity Rides:**
    * Service to book cabs (Sedan/SUV) between cities.
    * **Smart WhatsApp Integration:** Automatically opens the WhatsApp app on mobile with pre-filled trip details to contact the admin.
* **🛡️ Admin Dashboard:**
    * **Role-Based Access Control (RBAC):** Admin-only routes.
    * **Inventory Management:** Add, Edit, or Delete car listings.
    * **Booking Management:** View customer phone numbers & verify payment transactions.
    * **Ride Requests:** Track incoming intercity ride queries.
* **🔐 Security:**
    * Secure User & Admin login via **NextAuth.js**.
    * Protected API routes to prevent unauthorized access.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Deployment:** [Vercel](https://vercel.com/)
* **Version Control:** Git & GitHub

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18+)
* MongoDB URI

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/carsale.git](https://github.com/YOUR_USERNAME/carsale.git)
    cd carsale
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_secret_key
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.


---

##  Contributing

Contributions, issues, and feature requests are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 👤 Author

**Sukumar Poddar**
* **GitHub:** https://github.com/6206297928
* **LinkedIn:** https://www.linkedin.com/in/sukumarpoddar/

---

