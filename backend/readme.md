## Pokemon API Project - Backend Guide

The Pokemon API Project is a backend application built using the Flask framework, which allows you to access Pokemon data from a CSV file through various API endpoints. Below are the steps to install and run the project:

### Requirements

- Python 3.9 or above
- Pipenv

### Installation

1. Clone the repository from the GitHub source.
2. Open the terminal or command prompt in the project's root directory.
3. Run the following command to install the project dependencies:
4. Activate the virtual environment by running: `pipenv install`


### How to Run

1. Set the Flask application environment variable by running the following command in the terminal: `export FLASK_APP=backend/app.py`
2. Start the Flask development server by running the following command: `flask run`


The server will start running on `http://127.0.0.1:5000/`.

### API Endpoints

The following are the sample API endpoints to access the Pokemon data:

1. `GET /pokemons?page=1&per_page=15` - Returns a paginated list of Pokemon data with 15 records per page.

### How to Use the API

To access the API, you can use tools like cURL or Postman, or simply use a web browser.

Example: `GET` `http://127.0.0.1:5000/pokemons?page=1&per_page=15`

### Tests

The backend application includes test cases to ensure that the API endpoints are working correctly. To run the tests, follow these steps:

1. Navigate to the `backend` directory in the terminal.
2. Run the following command `pytest`
3. OR you can run redirectly from parent folder `pytest backend/test_app.py`


### Note

Make sure you have the Pokemon data CSV file named `pokemon_data.csv` in the project's root directory before running the application. The CSV file should contain the following information about Pokemon species:

- Name
- Base experience
- Height
- Weight
- Image URL

The application will load this data from the CSV file into a SQLite database using SQLAlchemy and serve it through the API endpoints.

Feel free to explore and interact with the Pokemon API!


