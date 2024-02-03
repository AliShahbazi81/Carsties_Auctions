<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carsties Auctions README</title>
</head>
<body>
    <h1>Carsties Auctions</h1>
    <p>Carsties Auctions is a comprehensive auction platform designed to facilitate online car auctions. This platform enables users to list their cars for auction, place bids on available cars, and manage auctions with ease. Built with a microservices architecture, it leverages the latest technologies for a robust, scalable, and user-friendly experience.</p>
    <h2>Features</h2>
    <ul>
        <li><strong>User Authentication and Authorization</strong>: Secure user registration, login, and access control, ensuring that only authorized users can create auctions and place bids.</li>
        <li><strong>Auction Management</strong>: Users can list cars for auction, providing detailed descriptions, images, and auction terms.</li>
        <li><strong>Real-time Bidding</strong>: The platform supports real-time bidding, allowing users to see the latest bids instantly.</li>
        <li><strong>Auction Listings and Filters</strong>: Users can browse active auctions, applying filters to find cars that meet their criteria.</li>
        <li><strong>Notifications</strong>: Real-time notifications inform users about auction updates, bid statuses, and auction outcomes.</li>
    </ul>
    <h2>Architecture</h2>
    <p>Carsties Auctions is built on a microservices architecture, consisting of several key services:</p>
    <ul>
        <li><strong>Auction Service</strong>: Manages auction listings, including creation, updates, and deletions.</li>
        <li><strong>Bidding Service</strong>: Handles all aspects of placing and managing bids on auctions.</li>
        <li><strong>Identity Service</strong>: Responsible for user authentication and authorization.</li>
        <li><strong>Notification Service</strong>: Sends real-time notifications to users regarding auction activity.</li>
        <li><strong>Search Service</strong>: Provides advanced search functionality for auctions.</li>
        <li><strong>Gateway Service</strong>: Acts as a reverse proxy, routing requests to the appropriate services.</li>
    </ul>
    <h2>Technologies</h2>
    <ul>
        <li><strong>Frontend</strong>: React, Next.js, Tailwind CSS for a dynamic and responsive UI.</li>
        <li><strong>Backend</strong>: .NET 7 for microservices, Entity Framework Core for ORM, MassTransit with RabbitMQ for messaging, gRPC for inter-service communication.</li>
        <li><strong>Database</strong>: PostgreSQL for relational data storage, MongoDB for bid management.</li>
        <li><strong>Deployment</strong>: Docker and Docker Compose for containerization and orchestration.</li>
    </ul>
    <h2>Getting Started</h2>
    <h3>Prerequisites</h3>
    <ul>
        <li>Docker and Docker Compose</li>
        <li>.NET SDK 7.0</li>
        <li>Node.js and npm</li>
    </ul>
    <h3>Setup</h3>
    <ol>
        <li>Clone the repository:
            <pre><code>git clone https://github.com/AliShahbazi81/Carsties_Auctions.git</code></pre>
        </li>
        <li>Navigate to the project directory and start the services using Docker Compose:
            <pre><code>docker-compose up --build</code></pre>
        </li>
        <li>Install frontend dependencies:
            <pre><code>cd client/web-app
npm install</code></pre>
</li>
<li>Start the frontend application:
<pre><code>npm run dev</code></pre>
</li>
</ol>
<p>The application will be available at <a href="http://localhost:3000">http://localhost:3000</a>.</p>
    <h2>Contributing</h2>
    <p>Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.</p>
    <h2>License</h2>
    <p>This project is licensed under the MIT License - see the LICENSE file for details.</p>
</body>
</html>
