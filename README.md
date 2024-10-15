# Simple Blog Server

## Description

This project is a simple Node.js server that allows you to create, read, update, and delete blog posts. The server responds to HTTP requests and handles CRUD operations for blog posts, which are stored in memory (i.e., not persisted across server restarts).

The server provides responses in JSON format for the `blogs` endpoint, and text for the root route.

## Features

- **GET** `/blogs`: Retrieve all blog posts.
- **POST** `/blogs`: Create a new blog post (requires `title` and `content` fields).
- **PUT** `/blogs/:id`: Update a specific blog post by ID (requires `title` and `content` fields).
- **PATCH** `/blogs/:id`: Partially update a specific blog post by ID.
- **DELETE** `/blogs/:id`: Delete a specific blog post by ID.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Xoli-Nxiweni/ServerProject.git
   ```

2. Navigate into the project directory:

   ```bash
   cd ServerProject
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and set the `PORT` variable (optional):

   ```bash
   PORT=3000
   ```

   If `PORT` is not set, the server will default to port 3000.

## Running the Server

Start the server by running:

```bash
node index.js
```

The server will listen on the port defined in your `.env` file or on port 3000 if no `PORT` is specified.

## Usage

The server provides the following routes:

### Root Route

- **GET** `/`: Returns a greeting message.

### Blog Routes

1. **GET** `/blogs`

   - Fetches all blogs.
   - Example response:

     ```json
     {
       "message": "Fetched blogs",
       "data": [
         {
           "id": 1,
           "title": "Sample Blog",
           "content": "This is a sample blog post."
         }
       ]
     }
     ```

2. **POST** `/blogs`

   - Creates a new blog post. Requires a JSON body with `title` and `content`.
   - Example request body:

     ```json
     {
       "title": "New Blog Post",
       "content": "This is the content of the new blog."
     }
     ```

3. **PUT** `/blogs/:id`

   - Updates an entire blog post by its ID.
   - Requires a JSON body with `title` and `content`.

4. **PATCH** `/blogs/:id`

   - Partially updates a blog post (e.g., you can update just the `title` or `content`).

5. **DELETE** `/blogs/:id`

   - Deletes a blog post by its ID.

### Error Handling

- `405 Method Not Allowed`: When an unsupported HTTP method is used on a valid endpoint.
- `404 Not Found`: When an invalid endpoint or non-existent blog post is accessed.
- `400 Bad Request`: When invalid or missing data is provided.
- `500 Internal Server Error`: When an unexpected server error occurs.

## Dependencies

- **dotenv**: Loads environment variables from a `.env` file.

Install it with:

```bash
npm install dotenv
```

## Author

**Xoli Nxiweni**  
Email: xolinxiweni@gmail.com  
GitHub: [Xoli-Nxiweni](https://github.com/Xoli-Nxiweni)
