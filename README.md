# AirClip ⚡

**Real-Time, Cross-Device Clipboard Syncing.**

![AirClip Banner](https://user-images.githubusercontent.com/73386121/211533314-1e7a5518-8686-4f35-802c-471206b13247.png) [![License](https://img.shields.io/badge/License-Custom-blue.svg)](https://github.com/VanshWebDev/AirClip/blob/main/README.md#%EF%B8%8F-license--usage-policy)
[![GitHub stars](https://img.shields.io/github/stars/VanshWebDev/AirClip?style=social)](https://github.com/VanshWebDev/AirClip/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/VanshWebDev/AirClip?style=social)](https://github.com/VanshWebDev/AirClip/network/members)
[![GitHub issues](https://img.shields.io/github/issues/VanshWebDev/AirClip)](https://github.com/VanshWebDev/AirClip/issues)

LiveClipboard is a cloud-based clipboard service that lets you instantly share copied text across all your devices—laptop, phone, or tablet—in real time. Once logged in, every copy action on one device automatically appears on others within seconds, creating a seamless, encrypted, real-time clipboard experience that makes moving text between devices as easy as copy and paste.

## 🚀 Key Features

-   🔄 **Instant Clipboard Sync**: Copy on one device, and paste on another instantly.
-   💻 **Multi-Device Connection**: Link multiple devices under one account with a simple pairing code.
-   🕐 **Clipboard History**: Access a history of your recently copied items anytime.
-   🔒 **End-to-End Encryption**: Your copied text stays private and secure during transit.
-   ⚙️ **Real-Time Architecture**: Built with WebSockets (Socket.io) for lightning-fast synchronization.
-   ☁️ **Cloud Backup**: Optional cloud storage for pinned or important clipboard items.

## 🛠️ Tech Stack

-   **Frontend**: React.js, TailwindCSS
-   **Backend**: Node.js, Express.js
-   **Real-Time Engine**: Socket.io
-   **Database**: MongoDB
-   **Authentication**: JSON Web Tokens (JWT) / Google Auth
-   **Hosting**: Vercel (Frontend) & Render/Railway (Backend)

## 🖼️ Screenshots

*A screenshot of the main dashboard.*
![App Screenshot 1](https://via.placeholder.com/468x300?text=App+Dashboard+Screenshot)

*A screenshot showing clipboard history.*
![App Screenshot 2](https://via.placeholder.com/468x300?text=Clipboard+History+Screenshot)

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or higher)
-   npm or yarn
-   Git
-   MongoDB (local instance or a cloud URI from MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/VanshWebDev/AirClip.git](https://github.com/VanshWebDev/AirClip.git)
    cd AirClip
    ```

2.  **Setup Backend:**
    ```sh
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add the following environment variables:
    ```env
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    CORS_ORIGIN=http://localhost:5173
    ```
    Start the backend server:
    ```sh
    npm start
    ```

3.  **Setup Frontend:**
    ```sh
    cd client # from the root directory
    npm install
    ```
    Create a `.env` file in the `client` directory and add the backend API URL:
    ```env
    VITE_API_BASE_URL=http://localhost:4000
    ```
    Start the frontend development server:
    ```sh
    npm run dev
    ```

The application should now be running on `http://localhost:5173`.

## 🤝 How to Contribute

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

When contributing, please ensure your commit messages or PR descriptions give credit to the original project, **AirClip**, and its creator, **Vansh Kumar**.

## 📜 License & Usage Policy

This project is released under a custom license managed by **Vansh Kumar**.

* **Attribution**: Any derivative works, forks, or significant use of this project's source code must include a clear and visible attribution to the original author, **Vansh Kumar**, and a link back to this original repository: `https://github.com/VanshWebDev/AirClip`.

* **Commercial Use**: The use of this software for commercial (money-making) purposes is neither explicitly granted nor forbidden. If you wish to use this software for commercial activities, you must contact the owner, **Vansh Kumar**, to discuss terms and seek permission.

* **Enforcement**: Unauthorized copying, rebranding, or direct redistribution of this project as your own without significant modification and proper attribution is strictly prohibited. The original author, **Vansh Kumar**, reserves the right to pursue legal action, including but not limited to, issuing takedown notices (e.g., under the DMCA) and seeking financial compensation for damages incurred due to such violations.

## 👤 Project Creator

**Vansh Kumar**

-   **GitHub**: [@VanshWebDev](https://github.com/VanshWebDev)
-   **LinkedIn**: [@Linkedin](https://www.linkedin.com/in/vansh-kumar-/)
*This README was generated with care ☘️.*