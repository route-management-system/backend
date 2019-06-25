# Route Management System - backend

Route Management System was originally developed by a team of developers at
[Lambda School](https://github.com/LambdaSchool).


BACKEND ROUTES:

GET '/'
  - basic message to test if api is running
  - returns {"api": "up"}

POST '/users/register'
  - adds new entry to Users table in database (registers user)
  - requires { "username": string, "password": string }
  - Username must not already exist in the database
  - can include { "defaultLatitude": float, "defaultLongitude": float } in the body, though it is not necessary
  - returns back the user from the database (including id)

POST '/users/login'
  - attempts a login
  - requires { "username": string, "password": string } matching an entry in the database
  - if login is successful, returns { "message": "Welcome!", "token": json token }
  - for most of the following content, json token MUST be placed in the header

GET '/users'
  - gets a list of all users
  - requires a valid json token
  - returns [
    { "id": integer, "username": string "defaultLatitude": float, "defaultLongitude": float },
    { "id": integer, "username": string "defaultLatitude": float, "defaultLongitude": float }
    ]

GET '/users/:id'
  - gets a user by user id
  - requires a valid json token
  - returns { "id": integer, "username": string "defaultLatitude": float, "defaultLongitude": float }

PUT '/users/:id'
  - updates a users information (selected by user id)
  - requires a valid json token
  - accepts any of the following in the body: { "username": string, "password": string, "defaultLatitude": float, "defaultLongitude": float }

DELETE '/users/:id'
  - deletes a user from the database (selected by user id)
  - requires a valid json token
  - return status 204 if successful

GET '/users/:id/saves'
  - returns all saved locations associated with user id
  - requires a valid json token
  - returns [
  { "id": integer, "lat": float, "lon": float, "address": string },
  { "id": integer, "lat": float, "lon": float, "address": string }
  ]
  - "id" in return refers to save id

GET '/saves'
  - returns all saved locations in database
  - requires a valid json token
  - returns [
  { "id": integer, "user_id": integer, "lat": float, "lon": float, "address": string },
  { "id": integer, "user_id": integer, "lat": float, "lon": float, "address": string }
  ]

GET '/saves/:id'
  - gets a saved location by save id
  - requires a valid json token
  - returns { "id": integer, "user_id": integer, "lat": float, "lon": float, "address": string }

POST '/saves'
  - adds a saved location to the database
  - requires a valid json token
  - requires { "user_id": integer } matching the id of current user
  - can include { "lat": float, "lon": float, "address": string } in the body, though it is not necessary
  - returns back the save from the database

PUT '/saves/:id'
  - updates a saved location (selected by user id)
  - requires a valid json token
  - accepts any of the following in the body: { "user_id": integer, "lat": float, "lon": float, "address": string }

DELETE 'saves/:id'
  - deletes a saved location from the database (selected by save id)
  - requires a valid json token
  - return status 204 if successful