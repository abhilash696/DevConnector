# DevConnector

Dev Connector is a social platform for developers to connect, collaborate, and share knowledge. Developers can sign up, update their profiles, connect with other developers, post content, and engage in discussions via comments.

# Features

User Authentication: Secure user registration and login using Passport.js and JWT authentication.

Developer Profiles: Create and update detailed profiles, including experience, skills, and social links.

Posts and Comments: Developers can create posts and comment on others' posts.

State Management: Redux is used for managing global application state.

Responsive Design: Ensures a seamless experience across devices.

# Tech Stack

# Frontend:

React

Redux for state management

Bootstrap for UI styling

# Backend:

Node.js with Express.js

MongoDB as the database

Mongoose for MongoDB object modeling

Passport.js for authentication

# API Endpoints

User Authentication:

POST /api/user/register: Register a new user.

POST /api/user/login: Login and receive a JWT token.

GET /api/user/CurrUser: Get current user.

Profiles:

GET /api/profile: Get the profile of the current user.

GET /api/profile/all : Get all profiles.

POST /api/profile: Create or update a user profile.

GET /api/profile/handle/:handlename : Get profile by handle name

DELETE /api/profile: Delete user profile and associated data.

Experience:

POST /api/profile/experience: Add experience to a user profile.

DELETE /api/profile/experience/delete/:experience_id: Remove an experience from a user profile.

Education:

POST /api/profile/education: Add education to a user profile.

DELETE /api/profile/education/delete/:education_id: Remove an educaiton from a user profile.

Posts:

GET /api/posts: Fetch all posts.

GET /api/posts/:id: Fetch a single post by ID.

POST /api/posts: Create a new post.

POST /api/posts/like/:post_id : like the post

POST /api/posts/unline/:post_id : unlike the post.

POST /api/posts/comment/:id: Add a comment to a post.

DELETE /api/posts/comment/:id : Delete comment to post only by owner of that post.

DELETE /api/posts/:id: Delete a post.

# Please use your own credentials for following:

MONGO_URI=<your-mongodb-uri>

JWT_SECRET=<your-jwt-secret>

# Installation

git clone https://github.com/abhilash696/DevConnector.git

cd DevConnector

Install dependencies : 

npm install

cd client

npm install


npm run server: Start the backend server.

npm start: Start the frontend development server.

npm run dev: Concurrently run both the frontend and backend servers.
