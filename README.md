# 10x-crm--George-Egnatashvili

## About
10X CRM is a lightweight customer relationship management web application built with vanilla JavaScript, HTML, and CSS. It helps users manage client pipelines, track leads, and monitor key metrics through an intuitive dashboard interface. The application features authentication, session-based route protection, local storage persistence, and dynamic API data integration.

## Features
- **Authentication & Validation**: User registration and login forms featuring real-time input validation and password strength checks.
- **Protected Routes**: Navigation guard system ensuring unauthenticated users cannot access dashboard or client pages without logging in.
- **Client Management**: Complete CRUD operations for client entries, including custom status tags, deal values, and interactive confirmation modals.
- **Search & Filtering**: Instant client searching, status filtering chips, and multi-criteria sorting capabilities.
- **Theme Persistence**: Light and dark mode toggle with preference stored in `localStorage`.
- **API Integration**: Asynchronous fetching (`fetch` + `async/await`) to retrieve and synchronize external mock client data from DummyJSON.

## How to Run
Follow these steps to run the project locally on your machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/maxstylee/10x-crm--George-Egnatashvili-.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd 10x-crm--George-Egnatashvili-
   ```

3. **Launch the application**:
   - Open `index.html` directly in your web browser, OR
   - Use the **Live Server** extension in VS Code to launch a local development server.


> 💡 **Important Note**: To access the application dashboard and client list, please **Sign Up / Register** a new account on the landing page first. Inner pages are protected by session guards, so an active session is required to log in and explore the app features.
