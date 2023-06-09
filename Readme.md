# Central Water Management

## Introduction
This project is a part of the final year graduating project at Addis Ababa Institute of Technology. 
The goal of this project is to create a software for the management of water in a central water supply 
system. The software should be able to manage the water supply and the water demand of a city. The software 
should also be able to simulate the water supply and demand of the city.

## Installation
This Project is written in Node.js and uses MongoDB as a database. To install the project, you need to have
Node.js and MongoDB installed on your computer. You can install Node.js from [here](https://nodejs.org/en/download/).
You can install MongoDB from [here](https://www.mongodb.com/try/download/community).

After installing Node.js and MongoDB, you need to clone the project from GitHub. You can clone the project by
running the following command in your terminal.

```bash
git clone https://github.com/Euaell/CWM.git
```

After cloning the project, you need to install the dependencies of the project. You can install the dependencies
by running the following command in your terminal.(From the root directory of the project)

1. to install the dependencies of the server
```bash
cd backend
npm install
```
2. to install the dependencies of the client or web application
```bash
cd web2
npm install
```

## Running the project
To run the project, you first need to provide the environment variables. You can do this by creating a file named
`.env` in the root directory of both `./web2` and `./backend`. You can copy the content of the `.env.example` file and paste it in the
`.env` file. After that, you need to provide the values for the environment variables. The values for the environment
variables are provided in the `.env.example` file. You can change the values of the environment variables in the `.env` file.

After providing the environment variables, you can run the project by running the following command in your terminal.
1. to run the server
```bash
cd backend
npm start
```

2. to run the client or web application
```bash
cd web2
npm start
```

## Features
The software has the following features:
1. The software can manage the water supply and demand of a city.
2. The software can simulate the water supply and demand of a city.
3. The software can manage the water supply and demand of a city in real-time.
4. The software can calculate the water bill of a customer.
5. Display the water supply and demand of a city in a graph.

## Technologies
The software is written in Node.js and uses MongoDB as a database. The software uses the following technologies:
1. Node.js
2. MongoDB
3. Express.js
4. React.js
5. React Flow
6. Ant Design
7. React Chart.js 2
