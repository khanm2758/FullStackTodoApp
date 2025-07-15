

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

---

## Code Explanation

### Backend (`server.js`)

The `server.js` file sets up the web server, connects to the database, and defines the API endpoints for handling CRUD operations.

#### **1. Dependencies and Initialization**

```javascript
const express = require("express");
const app = express();
let { MongoClient, ObjectId } = require("mongodb");
const sanitizeHtml = require("sanitize-html");
let db;
```

- **`express`**: The web framework for Node.js.
- **`mongodb`**: Imports the `MongoClient` for connecting to the database and `ObjectId` for converting string IDs to MongoDB's native BSON ObjectId format.
- **`sanitize-html`**: A library to strip potentially malicious HTML from user input.
- **`db`**: A global variable to hold the database connection object once established.

#### **2. Database Connection**

```javascript
// ... URI definition ...

async function go() {
  let client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  app.listen(3000);
}

go();
```

- The `go()` async function initializes the connection to the MongoDB Atlas cluster.
- `client.connect()` establishes the connection.
- `client.db()` gets a reference to the default database specified in the connection string (`TodoApp`).
- `app.listen(3000)` starts the Express server on port 3000 _only after_ the database connection is successful.

#### **3. Middleware**

```javascript
// Serves static files from the 'public' folder (e.g., browser.js, CSS)
app.use(express.static("public"));

// Parses incoming JSON request bodies
app.use(express.json());

// Parses incoming request bodies with URL-encoded payloads (from HTML forms)
app.use(express.urlencoded({ extended: true }));
```

Middleware functions process requests before they reach the route handlers.

#### **4. Password Protection**

```javascript
function passwordSecurity(req, res, next) {
  res.set("WWW-Authenticate", "basic realm = 'simple todo app' ");

  if (req.headers.authorization == "Basic dG9kb0FwcDoxMjM0NTY3ODk=") {
    next();
  } else {
    res.status(401).send("Authentication require");
  }
}

app.use(passwordSecurity);
```

- This custom middleware protects all routes.
- `res.set(...)` tells the browser to pop up a login prompt.
- It checks the `Authorization` header for a Base64 encoded string. `dG9kb0FwcDoxMjM0NTY3ODk=` decodes to `todoApp:123456789`.
- If the credentials are correct, `next()` passes the request to the next middleware or route handler. Otherwise, it sends a `401 Unauthorized` error.

#### **5. Routes (API Endpoints)**

- **`GET /` (Read Items)**

  ```javascript
  app.get("/", async function (req, res) {
    const items = await db.collection("items").find().toArray();
    res.send(/* HTML template with items data */);
  });
  ```

  Fetches all documents from the `items` collection and sends the main HTML file to the browser. The fetched `items` are stringified and embedded in a `<script>` tag so the client-side JavaScript can access them immediately on page load.

- **`POST /create-item` (Create Item)**

  ```javascript
  app.post("/create-item", async function (req, res) {
    let safeText = sanitizeHtml(req.body.text, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const info = await db.collection("items").insertOne({ text: safeText });
    res.json({ _id: info.insertedId, text: safeText });
  });
  ```

  Sanitizes the incoming text, inserts it into the database, and returns the new item's `_id` and text as JSON. This allows the frontend to add the new item to the list without a page refresh.

- **`POST /update-item` (Update Item)**

  ```javascript
  app.post("/update-item", async function (req, res) {
    let safeText = sanitizeHtml(req.body.text, {
      allowedTags: [],
      allowedAttributes: {},
    });
    await db
      .collection("items")
      .findOneAndUpdate(
        { _id: new ObjectId(req.body.id) },
        { $set: { text: safeText } }
      );
    res.send("success");
  });
  ```

  Finds a document by its `_id` and updates its `text` field with the sanitized user input.

- **`POST /delete-item` (Delete Item)**

  ```javascript
  app.post("/delete-item", async function (req, res) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId.createFromHexString(req.body.id) });
    res.send("successfully delete");
  });
  ```

  Deletes a document from the collection that matches the provided `_id`.

### Frontend (`public/browser.js`)

This file contains the client-side logic for interacting with the UI and communicating with the backend API.

#### **1. Initial Page Render**

```javascript
// Template function to generate HTML for one item
function addItem(dbItem) {
  /* ... returns HTML string ... */
}

// Map over the 'items' array from the server and generate the list
let ourHtml = items
  .map(function (item) {
    return addItem(item);
  })
  .join("");
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHtml);
```

- The `items` variable is available globally because it was embedded in the HTML by the server.
- The code iterates through this array, generates HTML for each item using the `addItem` helper function, and injects it into the `<ul>`.

#### **2. Event Handling**

```javascript
// Create Feature
document.getElementById("create-form").addEventListener("submit", function (e) {
  /* ... */
});

// Update & Delete Features (Event Delegation)
document.addEventListener("click", function (e) {
  /* ... */
});
```

- **Create:** A submit event listener on the form prevents the default browser submission, sends the new item's text to the `/create-item` endpoint via `axios.post`, and then updates the DOM with the new item returned by the server.
- **Update & Delete:** A single click listener is attached to the `document`. This technique, called **event delegation**, efficiently handles clicks on all edit and delete buttons, even those added after the initial page load.
  - If an **edit button** (`.edit-me`) is clicked, it prompts the user for new text and sends it to the `/update-item` endpoint. On success, it updates the item's text directly in the DOM.
  - If a **delete button** (`.delete-me`) is clicked, it shows a confirmation dialog. If confirmed, it sends the item's ID to the `/delete-item` endpoint and, on success, removes the corresponding `<li>` element from the DOM.
