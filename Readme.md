

# Simple To-Do App

This is a full-stack web application that provides a simple and intuitive interface for managing a to-do list. It is built with **Node.js**, **Express**, and **MongoDB** and demonstrates fundamental CRUD (Create, Read, Update, Delete) operations in a single-page application (SPA) style.

The application is protected by basic HTTP authentication.

---

## Features

- **Add Items:** Users can add new tasks to their list.
- **View Items:** All existing to-do items are displayed on page load.
- **Edit Items:** In-place editing of existing tasks with a real-time update.
- **Delete Items:** Remove tasks from the list after a confirmation prompt.
- **Security:**
  - Input sanitization to prevent Cross-Site Scripting (XSS) attacks.
  - Basic authentication to restrict access.

---

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with MongoDB Atlas)
- **Frontend:** HTML5, CSS3 (Bootstrap 4), Vanilla JavaScript
- **Key Libraries:**
  - `axios`: For making HTTP requests from the client-side.
  - `mongodb`: Official MongoDB driver for Node.js.
  - `sanitize-html`: For cleaning user input on the server.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js and npm](https://nodejs.org/en/download/)
- A MongoDB database (either a local instance or a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

---

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    Run the following command in your terminal to install the necessary packages listed in `package.json`.

    ```bash
    npm install
    ```

3.  **Configure Database:**
    Open the `server.js` file and replace the MongoDB connection string with your own.

    ```javascript
    // server.js

    // ...
    const username = encodeURIComponent("YOUR_MONGO_USERNAME");
    const password = encodeURIComponent("YOUR_MONGO_PASSWORD");
    const uri = `YOUR_MONGODB_ATLAS_CONNECTION_STRING`; // Replace with your full string
    // ...
    ```

    > **Note**: Using `encodeURIComponent` is crucial for passwords containing special characters (e.g., `@`, `#`, `/`) to ensure they are parsed correctly in the URI.

4.  **Run the application:**

    ```bash
    node server.js
    ```

5.  **Access the App:**
    Open your web browser and navigate to `http://localhost:3000`. You will be prompted for a username and password. Based on the current code, they are:

    - **Username:** `todoApp`
    - **Password:** `123456789`




