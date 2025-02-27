# CRUD SERVER

## ⚠️ Note

There are some scripts and configurations in the source code that are not yet in use. However, I believe that building a solid base source is important, so I have included them for completeness. At my current level, simply building something that "works" is not enough—I aim for a more structured and scalable approach.

---

## 📌 Requirements

Before running this project, ensure you have the following installed:

- **Node.js** version **20.18.1**
- **npm** (comes with Node.js)

## 🚀 Installation and Setup

Follow these steps to set up and run the project:

### 1️⃣ Install Dependencies

Run the following command to install all necessary dependencies:

```sh
npm install
```

### 2️⃣ Run the Development Server

Start the development server with:

```sh
npm run dev
```

This will launch the application in development mode.

### 3️⃣ Run Database Migrations

Apply all migration files to set up the database schema:

```sh
npm run migrate:run
```

Ensure your database is properly configured in the `.env.development.local` file before running migrations.

---

## 🔧 Available Commands

Besides the main scripts above, you can use predefined scripts in `package.json` to perform other tasks.  
Check `package.json` for more available commands.

Some common commands include:

- **Start the application in production mode:**
  ```sh
  npm start
  ```
- **Run tests:**
  ```sh
  npm test
  ```
- **Lint the code:**
  ```sh
  npm run lint
  ```

---

## ⚙️ Environment Configuration

Make sure to set up a `.env` file according to your environment needs.  
Example `.env` file:

```env
POSTGRES_USER = postgres
POSTGRES_PASSWORD = 024680
POSTGRES_HOST = localhost
POSTGRES_PORT = 5432
POSTGRES_DB = crud_server
```

Modify the values according to your actual setup.

---

## 📄 API Documentation

### 🔹 Postman Collection
You can access the API documentation via Postman using the following link:

📌 **[Postman Documentation](https://documenter.getpostman.com/view/18992337/2sAYdfqrMi)**

### 🔹 Swagger Documentation
If you prefer using Swagger, you can access the API documentation when the server is running at:

📌 **[Swagger UI](http://localhost:3000/api-docs)** _(Replace `3000` with your actual port if different)_

---

## 📄 License

This project is licensed under the **[ISC]**.  
Refer to the `LICENSE` file for more details.

---

## 🤝 Contribution

Contributions are welcome!  
If you want to contribute, please fork the repository and submit a pull request.

---

## 📞 Contact

For any issues or questions, feel free to reach out:

- **Email:** tannam0811@gmail.com
- **GitHub:** [Your GitHub Profile](https://github.com/BiaDN)

---

_✨ Happy coding! ✨_
