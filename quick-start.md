# Quick Start Guide: Gestion-Stages Internship Management System

This Quick Start guide will help you get the Gestion-Stages internship management system up and running in minutes. This full-stack application combines a Laravel 11 backend with an Angular 17 frontend to provide a comprehensive platform for managing student internships, organizational partnerships, and academic supervision.

**Laravel + Angular Architecture**

The system supports multiple user roles including Students, Teachers, Responsables, and Administrators, each with tailored workflows for internship lifecycle management. By the end of this guide, you'll have both the backend API server and frontend development environment running locally.


## System Architecture

The application follows a modern API-first architecture with clear separation of concerns between the backend and frontend layers. The Laravel backend exposes RESTful endpoints that the Angular frontend consumes through HTTP services.

### Key Architectural Components:

| Component | Technology | Purpose |
|-----------|------------|---------|
| Backend Framework | Laravel 11 | RESTful API, authentication, business logic |
| Frontend Framework | Angular 17.2 | Single-page application with SSR support |
| UI Library | PrimeNG 17.13 | Pre-built components and responsive design |
| Database | SQLite | Local development data storage (configurable) |
| Build Tool | Vite + Angular CLI | Fast development builds and hot reload |
| PDF Generation | Laravel DomPDF | Convention and report document generation |


## Prerequisites

Before proceeding with the installation, ensure your development environment meets these minimum requirements:

| Requirement | Minimum Version | Purpose |
|-------------|----------------|---------|
| PHP | 8.2+ | Backend runtime environment |
| Composer | 2.x | PHP dependency management |
| Node.js | 18.x | Frontend runtime environment |
| npm | 9.x | JavaScript package management |

The project uses Laravel 11 which requires PHP 8.2 or higher. If you're using an older PHP version, upgrade before continuing. On Windows, you can use XAMPP or WAMP, while macOS and Linux users can use Homebrew or native package managers.


## Quick Installation

Follow these streamlined steps to set up the complete development environment:

### Step 1: Clone the Repository

Begin by cloning the repository to your local machine:

```bash
git clone https://github.com/af38/gestion-stages.git
cd gestion-stages
```
This creates a local copy containing both the Laravel backend (root directory) and Angular frontend
Here's the content formatted as a coherent Markdown document:

## Step 2: Install Backend Dependencies

Navigate to the project root and install PHP dependencies using Composer:

```bash
composer install
```

This process will download all required packages including Laravel framework 11, Eloquent composite-key support, DomPDF for PDF generation, and PhpSpreadsheet for Excel operations. The installation may take several minutes depending on your internet connection.

*Sources: composer.json*

## Step 3: Configure Environment

Copy the example environment file and create your own configuration:

```bash
cp .env.example .env
```

The default configuration uses SQLite for database storage (`.env.example`), which is ideal for local development. Key configuration options include:

| Setting | Default Value | Description |
|---------|---------------|-------------|
| APP_URL | http://localhost | Application base URL |
| DB_CONNECTION | sqlite | Database driver |
| APP_DEBUG | true | Enable debug mode for development |
| APP_TIMEZONE | UTC | Application timezone |

For production deployment, change `DB_CONNECTION` to `mysql` or `pgsql` and provide your database credentials. The project supports multiple database backends through Laravel's database abstraction layer.

*Sources: .env.example*

## Step 4: Setup Database

Initialize the database by running migrations and seeding initial data:

```bash
php artisan migrate
php artisan db:seed
```

The migration process creates all necessary database tables including users, sessions, and password reset tokens (`0001_01_01_000000_create_users_table.php`). The seeder creates a test user account with credentials:

- **Email:** test@example.com
- **Name:** Test User
- **Password:** (Generated hashed password)

Additional migrations create tables for stages, organisms, etudiants, enseignants, and other domain-specific entities managed by the system.

*Sources: database/migrations/0001_01_01_000000_create_users_table.php, database/seeders/DatabaseSeeder.php*

## Step 5: Generate Application Key

Generate a unique application encryption key:

```bash
php artisan key:generate
```

This key is used for session encryption, CSRF protection, and other security features. The command automatically updates the `APP_KEY` value in your `.env` file.

*Sources: composer.json*

## Step 6: Install Frontend Dependencies

Navigate to the frontend directory and install Angular dependencies:

```bash
cd frontend
npm install
```

This downloads Angular 17.2, PrimeNG UI components, FullCalendar for scheduling, FontAwesome icons, and all other frontend dependencies specified in `frontend/package.json`. The installation creates a `node_modules/` directory with all required packages.

*Sources: frontend/package.json*

## Running the Application

With all dependencies installed, you can now start both the backend API server and frontend development server. Each runs in a separate terminal process.

### Start the Backend Server

In the project root directory, launch the Laravel development server:

```bash
php artisan serve
```

The backend server starts on `http://localhost:8000` by default. All API endpoints are prefixed with `/api` as defined in `routes/api.php`. Key endpoints include:

| Endpoint | Controller | Purpose |
|----------|------------|---------|
| /api/etudiant | StudentController | Student management |
| /api/enseignant | EnseignantController | Teacher management |
| /api/resp | RespController | Responsable management |
| /api/admin | AdminController | Admin functions |
| /api/stage | StageController | Internship operations |
| /api/reclamation | ReclamationController | Issue reporting |

*Sources: routes/api.php*

### Start the Frontend Server

Open a new terminal window, navigate to the frontend directory, and start the Angular development server:

```bash
cd frontend
ng serve
```

The Angular application launches on `http://localhost:4200/` (`frontend/README.md`). The application automatically reloads when you make changes to source files, providing an efficient development workflow.

### Access the Application

Once both servers are running, open your browser and navigate to:

```
http://localhost:4200
```

The Angular application will communicate with the Laravel backend API at `http://localhost:8000/api` for all data operations.

*Sources: frontend/README.md, frontend/src/main.ts*

## Project Structure Overview

The repository follows a monorepo structure with distinct directories for backend and frontend code.

### Backend Structure (Laravel)

| Directory | Contents |
|-----------|----------|
| app/Models/ | Eloquent models (Etudiant, Enseignant, Stage, etc.) |
| app/Http/Controllers/ | API controllers for each domain entity |
| app/Observers/ | Model event observers (e.g., StageObserver) |
| routes/ | API and web route definitions |
| database/migrations/ | Database schema definitions |
| resources/views/ | Blade templates for PDF generation |

### Frontend Structure (Angular)

| Directory | Contents |
|-----------|----------|
| src/app/ | Main application module and components |
| src/pages/ | Page components for different user roles |
| src/services/ | HTTP services for API communication |
| src/assets/ | Static assets (images, styles) |

*Sources: app/Models/User.php, routes/api.php, frontend/src/main.ts*

## What's Next?

You now have the development environment running locally. To deepen your understanding of the system:

- **System Architecture** - Explore the detailed architectural patterns and design decisions
- **Backend Installation** - Learn advanced backend configuration options
- **Frontend Installation** - Understand frontend setup in depth
- **Laravel Project Structure** - Dive into backend code organization
- **Angular 17 Project Structure** - Explore frontend architecture

For hands-on development, begin by exploring the authentication flow in `AuthController.php` and the corresponding Angular services in the `frontend/src/services/` directory. The system uses Laravel Sanctum for API authentication, providing a secure token-based authentication mechanism.

*Sources: routes/api.php*

## Troubleshooting

If you encounter issues during setup:

| Issue | Solution |
|-------|----------|
| Composer install fails | Ensure PHP 8.2+ is installed and composer is in your PATH |
| npm install fails | Update Node.js to version 18.x or higher |
| Database connection error | Verify database credentials in .env file |
| Port already in use | Use --port flag: `php artisan serve --port=8080` |
| CORS errors | Configure config/cors.php to allow frontend origin |

For additional support, consult the Laravel documentation at [laravel.com/docs](https://laravel.com/docs) or Angular documentation at [angular.io/docs](https://angular.io/docs).
```