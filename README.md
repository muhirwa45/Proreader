# ReadEra: Offline Book Reader - How It Works

## Overview

ReadEra is a client-side web application built with React and TypeScript that allows users to upload, manage, and read their digital books and documents directly in the browser. It's designed to be a personal, offline-first library with a clean, modern, and themeable user interface. All user data, including uploaded books, remains on the user's device and is not sent to any server.

## Core Features

*   **Personal Library:** Upload and manage PDF documents. The app intelligently extracts metadata like title and author from PDFs when available.
*   **Advanced PDF Reader:** A feature-rich, built-in reader for a seamless experience. It includes:
    *   Page navigation (previous, next, and direct page input).
    *   Zoom controls.
    *   Full-text search with result highlighting and navigation.
    *   Bookmarking system to save and quickly jump to important pages.
*   **Book Organization:**
    *   **Favorites:** Mark books as favorites for quick access.
    *   **Collections:** Create custom collections (e.g., "Work," "Fantasy," "Textbooks") and assign books to multiple collections.
    *   **Dynamic Views:** The sidebar provides multiple ways to filter and view your library, such as "Reading Now," "Favorites," and by individual collection.
*   **Customizable Interface:**
    *   **Multiple Themes:** Choose between Light, Dark, and Dark Blue themes from the settings menu.
    *   **Persistent Settings:** Your chosen theme is saved locally, so the app remembers your preference.
*   **Responsive Design:** A fluid layout that works across various screen sizes, with a collapsible sidebar for smaller devices.

## Application Architecture

The application is built as a single-page application (SPA) using React. Here’s a breakdown of its structure and data flow:

#### 1. Main Component (`App.tsx`)

This is the root component that acts as the "brain" of the application. It manages all the primary state using React hooks (`useState`, `useEffect`):

*   **`books`**: An array of `Book` objects, representing the user's entire library.
*   **`collections`**: An array of `Collection` objects.
*   **`bookmarks`**: An object mapping book IDs to an array of bookmarked page numbers.
*   **`theme`**: The currently active UI theme (`light`, `dark`, or `dark-blue`). This state is synchronized with the browser's `localStorage` to persist between sessions.

All functions that modify this state (e.g., adding a book, creating a collection, toggling a favorite) are defined here and passed down as props to child components.

#### 2. Component Breakdown

The UI is divided into several reusable components:

*   **`Header.tsx`**: The top bar of the application, displaying the app's name and a menu button to toggle the sidebar on mobile.
*   **`Sidebar.tsx`**: The main navigation panel. It lists all available views (like "Favorites," "Collections") and allows users to switch between them. It also dynamically renders the list of user-created collections and allows for renaming them.
*   **`MainContent.tsx`**: This component renders the main view area. Based on the `activeView` selected in the sidebar, it filters the master list of books and displays them. It also contains the "Upload Book" button and sorting controls.
*   **`BookCard.tsx`**: Represents a single book in the library view. It displays the book's title, author, progress, and provides controls to open the reader, mark it as a favorite, and add it to collections via the `CollectionMenu`.
*   **`BookReader.tsx`**: This is the core reading interface. When a user opens a book, this component is displayed as a full-screen modal. It leverages the **`pdf.js`** library to render the pages of an uploaded PDF file onto an HTML `<canvas>` element. It manages its own internal state for the current page, zoom level, and search results.
*   **`Settings.tsx`**: A simple view that allows the user to change the application's theme. It uses React's Context API (`ThemeContext`) to update the theme globally.

#### 3. Data Flow and State Management

*   **Unidirectional Data Flow:** The app follows React's standard top-down data flow. State is held in the `App` component and flows down to child components through props.
*   **Event Handling:** When a user interacts with a child component (e.g., clicks the "Favorite" button on a `BookCard`), the component calls a function passed down via props (e.g., `onToggleFavorite`). This function, defined in the `App` component, updates the central state, causing the UI to re-render with the new data.

#### 4. PDF Handling

*   When a user uploads a PDF file, the `MainContent` component reads it using the browser's `FileReader` API.
*   It then uses `pdf.js` to parse the file's metadata (title, author) to pre-fill the book details.
*   The raw `File` object is stored within the `Book` object in the application's state.
*   When the `BookReader` is opened, it receives this `File` object, reads it as an `ArrayBuffer`, and uses `pdf.js` to render its pages. This entire process happens on the client-side.
