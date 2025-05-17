# ProjectShelf Backend API

This is the backend API for ProjectShelf, a platform where designers, developers, and writers can create dynamic portfolios with modular case studies.

## Technologies Used

- **Node.js & Express** - Server framework
- **JavaScript** - Server-side language
- **PostgreSQL** - Database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by creating a `.env` file in the root directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/projectshelf"
   PORT=4000
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Initialize database:
   ```bash
   npm run dev
   ```
   This will create the necessary tables using Sequelize's sync functionality.

### Running the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "role": "VISITOR" // Optional, defaults to VISITOR
  }
  ```
- **Response**: User object with JWT token

#### Login
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with JWT token

### User Management

#### Get Current User
- **URL**: `/api/users/me`
- **Method**: `GET`
- **Authentication**: Required
- **Response**: User object

#### Get User Profile
- **URL**: `/api/users/profile/:username`
- **Method**: `GET`
- **Response**: User object with projects

#### Update Profile
- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "bio": "New bio",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
  ```
- **Response**: Updated user object

#### Upgrade to Creator
- **URL**: `/api/users/upgrade-to-creator`
- **Method**: `POST`
- **Authentication**: Required
- **Response**: Updated user object with new token

### Projects

#### Get All Projects
- **URL**: `/api/projects?page=1&limit=10`
- **Method**: `GET`
- **Response**: List of projects with pagination info

#### Get Project by Slug
- **URL**: `/api/projects/:slug`
- **Method**: `GET`
- **Response**: Project with media and user details

#### Create Project
- **URL**: `/api/projects`
- **Method**: `POST`
- **Authentication**: Required (Creator role)
- **Body**:
  ```json
  {
    "title": "Project Title",
    "description": "Short description",
    "overview": "Detailed overview",
    "tools": ["Tool1", "Tool2"],
    "outcomes": "Project outcomes"
  }
  ```
- **Response**: Created project object

#### Update Project
- **URL**: `/api/projects/:id`
- **Method**: `PUT`
- **Authentication**: Required (Project owner)
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "overview": "Updated overview",
    "tools": ["Tool1", "Tool2", "Tool3"],
    "outcomes": "Updated outcomes"
  }
  ```
- **Response**: Updated project object

#### Delete Project
- **URL**: `/api/projects/:id`
- **Method**: `DELETE`
- **Authentication**: Required (Project owner)
- **Response**: Success message

#### Get User's Projects
- **URL**: `/api/projects/user/me`
- **Method**: `GET`
- **Authentication**: Required
- **Response**: List of user's projects with analytics

## Authorization

The API implements two levels of authorization:

1. **Authentication**: JWT-based authentication for private routes
2. **Role-based Authorization**: Certain routes require the CREATOR role
3. **Resource Ownership**: Users can only modify their own resources

## Data Models

### User
- id (UUID)
- email (unique)
- password (hashed)
- username (unique)
- name
- bio (optional)
- avatarUrl (optional)
- role (CREATOR or VISITOR)
- createdAt
- updatedAt

### Project
- id (UUID)
- title
- description
- slug (unique)
- overview
- timeline (JSON)
- tools (array)
- outcomes
- createdAt
- updatedAt
- userId (FK to User)

### Media
- id (UUID)
- url
- type (IMAGE or VIDEO)
- caption (optional)
- order
- projectId (FK to Project)
- createdAt
- updatedAt

### Analytics
- id (UUID)
- views
- engagement
- clickThroughs
- date
- projectId (FK to Project, optional)
- userId (FK to User, optional) 