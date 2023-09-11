# Exercise Tracker Project

## Table of Contents

- [Exercise Tracker Project](#exercise-tracker-project)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
    - [User](#user)
    - [Log](#log)
  - [Prerequisites](#prerequisites)
  - [Setting Up MongoDB](#setting-up-mongodb)
  - [Getting Started](#getting-started)
  - [License](#license)
  - [Disclaimer](#disclaimer)

## Overview

This project is a web service for tracking exercises and users. It provides endpoints to create and manage user accounts, log exercises, and retrieve exercise logs. The main entities in this system are User, Exercise, and Log.

## Features

- Generate a user
- Create and retrieve an exercise logger

### User

A User represents an individual user of the service.
It has properties like username and _id.
Users can be created by making POST requests to /api/users with a username in the form data.
The response from this POST request will include the newly created User's username and _id.
Exercise:

An Exercise represents a specific exercise performed by a user.
It has properties like username, description, duration, date, and _id.
Exercises can be logged by making POST requests to /api/users/:_id/exercises with form data including description and duration, optionally date.
The response from this POST request will include the User object with the added exercise fields.

### Log

A Log represents the exercise history of a user.
It has properties like username, count, _id, and an array of log items.
Users can retrieve their exercise log by making GET requests to /api/users/:_id/logs.
The response will include the user's username, count (number of exercises), _id, and an array of exercise logs.
Each item in the exercise log has properties like description, duration, and date.
You can customize the log response by adding from, to, and limit parameters to the GET request to filter and limit the logs.

This project is designed to help users track their exercises and view their exercise history. It follows RESTful API conventions and provides endpoints for creating users, logging exercises, and retrieving exercise logs.

## Prerequisites

Before getting started, make sure you have the following software installed:

- Node.js (Version 14 or higher)
- MongoDB (Version 4 or higher) [Only required for local or self-hosted MongoDB instances]

## Setting Up MongoDB

For the trigger functionality, you'll need to use a MongoDB Cloud cluster, as triggers are not supported with local or self-hosted MongoDB instances. If you prefer using local or self-hosted MongoDB, refer to the [MongoDB Change Streams documentation](https://www.mongodb.com/docs/manual/changeStreams/) for more information.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-project.git
   ```

2. Change to the project directory:
   ```bash
   cd your-project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the project root.
   - Define any necessary environment variables in the `.env` file.

5. Start the development server:
   ```bash
   npm start
   ```

6. Access the project in your web browser:
   - Open a web browser and navigate to http://localhost:3000.
   - You can now interact with the project on your local machine.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project/app/tool is based on the freeCodeCamp community and platform, which is open source and available under the BSD-3 license. While this project utilizes freeCodeCamp's resources, it's important to note the following:

- This project is not officially endorsed by freeCodeCamp.
- The creators of this project do not represent freeCodeCamp itself.
- While most non-sensitive freeCodeCamp data is publicly available and can be used in accordance with the terms of the BSD-3 license, it's crucial to respect the privacy and terms of use of the freeCodeCamp community and platform.
- Any modifications, use of data, or interactions with the freeCodeCamp platform should be in compliance with the freeCodeCamp's terms of use and any relevant policies.

By using this project/app/tool, you acknowledge that it is not an official product of freeCodeCamp, and any support or issues related to this project should be directed to the project's maintainers, rather than the freeCodeCamp organization.

For more information about freeCodeCamp's terms of use and licensing, please refer to the [freeCodeCamp License](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/LICENSE.md).
