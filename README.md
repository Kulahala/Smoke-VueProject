# BestLinksz.com - E-cigarette Product Showcase

This is a Vue.js project for BestLinksz.com, a showcase for e-cigarette products. It is built with Vite, Vue 3, and Vue Router.

## Features

*   **Responsive Design:** The website is designed to work on both desktop and mobile devices.
*   **Dark Mode:** Users can switch between light and dark themes.
*   **Product Showcase:** Products are organized by categories and each product has its own detail page.
*   **Modern Tooling:** The project uses Vite for fast development and bundling, ESLint for code linting, and Prettier for code formatting.

## Project Setup

To get the project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Kulahala/vue-project.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd vue-project
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder. It correctly bundles Vue in production mode and optimizes the build for the best performance.

### `npm run preview`

Serves the production build locally to preview it before deployment.

### `npm run lint`

Lints and fixes files based on the ESLint configuration.

### `npm run format`

Formats files with Prettier.

## Project Structure

The project has the following structure:

```
.
├── public/         # Static assets
├── src/
│   ├── assets/     # CSS and other assets
│   ├── components/ # Reusable Vue components
│   ├── router/     # Vue Router configuration
│   ├── store/      # State management
│   ├── views/      # Page components
│   ├── App.vue     # Root component
│   └── main.js     # Application entry point
├── .gitignore      # Git ignore file
├── index.html      # Main HTML file
├── package.json    # Project dependencies and scripts
└── README.md       # This file
```

## Dependencies

The main dependencies of the project are:

*   **Vue.js:** A progressive framework for building user interfaces.
*   **Vue Router:** The official router for Vue.js.
*   **Vite:** A build tool that aims to provide a faster and leaner development experience for modern web projects.