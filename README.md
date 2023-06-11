<h1>Project Overview</h1>

<h2>Project Purpose</h2>
The purpose of this api is to create users that can then be logged in, logged out, updated, and deleted
along with an endpoint that will showcase each created user, their individual information, and whether or not they're logged in

<h2>server.js</h2>

create a server.js file to set up which domain we'll connect to
we'll need to require in our server the dependencies such as mongoose to connect our app to our Mongodb database that will hold our created users
we connect our database using mongoose.connect and in the parameters of connect input the connection string with dot notation from nodejs
we'll establish the port we'll use to listen for server pings(this one will be 3000)
since we created a separate app.js to separate what logic our app will be using, we will require our app.js file that's exported to be able to apply it's functionality to our server
we can console.log a message to confirm that it connects


<h2>app.js</h2>

we then create an app.js
in app.js we require the needed dependencies such as express(to send json data) morgan(to log the http requests) and mongoose(to connect to the database)
since we created a separate folder that holds our user routes we'll need to require that to utilize their functions in each endpoint in our app
we use express.static to prime our website with information to stylize our application once views engine is implemented in creating the HTML webpage
we created a separate directory called 'public' that holds the static css file that will be used for that stylization 
then we export our app file so it can be accessed by other files such as server.js

<h2>User Routes</h2>

we create a folder called routes and inside create a userRoutes.js
we require the needed dependencies in the case that would just be express
we create a variable called router that utilizes the express router method that calls the endpoints to the functions they will run and also the type of request they will send
since we utilize mvc architecture we created a file named userController.js that holds each endpoints logic that will direct the flow of our routes
we then export router so it can be accessed by app.js

<h2>Controllers</h2>

we create a controller.js file

we require the needed dependencies like our schema from our user model, bcrypt for the hashing algorithm for our password security, our jsonwebtoken to require authorization before certain endpoints are reached

<h3>Authorization</h3>
we created an auth function and we're telling it to try to create a variable named token that will be equal to the web token we put in the bearer field in the authorization header
we then create a variable called data that'll verify the web token and our secret key
then we create a user variable that'll search in our database to find a specific user to compare it's web token to the one put into the authorization header but if a user does not exist that matches it, it will throw an error, but if one exists it will be equal to the user it then moves on to the next function for that path that's specified in the routes

<h3>Create User</h3>
for the createUser function it will make a new user based on the user schema based off of what we send in the request body that follows the schema blueprint, it then saves them to a database, generates a web token, and responding with  the user and generated token

<h3>Get Users</h3>
for the getUsers function it will create a function that finds all users in our database and responds with them

<h3>Log In Users</h3>
for the loginUsers function we create a user variable that stores the user whose email equals what is sent in the request body
we place an if statement that states if no user or the password we send in the request body doesn't equal the password then send  a status code error 400
if they do match the users logged in property will equal showing that they're logged, the logged in user will then be saved into the database to show the updated logged in status
we then generate a new token and the response will then give the user and the new token

<h3>Log Out Users</h3>
for the logoutUsers function it is essentially the reverse process of logged in, changing the logged in property to false and then saving that update to the user

<h3>Update Users</h3>
for the updateUser function we create a variable called updates that will hold the new updated data that will pull from the request body
we then create a variable called user that'll hold the specified user that is found by the id posted in the url
we then iterate each property in the update variable and replace the specified  users properties with the updated data and save the changes in the database to be shown in the response

<h3>Delete Users</h3>
for the deleteUser function we delete whatever user is specified that matches the id posted in the url

<h2>Models</h2>
we create a models folder for the m in mvc architecture and inside make user.js file
in this file we make the schema which is a blueprint for how we want the data structured
it is also gonna encrypt any passwords sent into has using the bcrypt dependency that we installed
the model will hold logic to generate a web token that will be called when authorization is needed
we then create a User(capital u) variable that export all this logic to be accessed by other files

<h2>Testing With Supertest and Jest</h2>

we created a directory called tests that holds our file called user.test.js and in this is our test suite
for this we'll have to set these tests to a new port separate from the one our api is using
we require mongodb memory server here because we want to make sure the users created for the are pushed into a memory server and not our actual main database
we set before All and after All functions to make sure that a memory server database is created before the test suite and to close and stop the server after the testing is done
we then create test cases for each route to make sure they are properly functioning

<h2>Load Testing With Artillery</h2>

we create scenarios for each of our routes beginning with config, then choose localhost:3000 which is the port our api is using
we then set the phases to be 20 users arriving per second for a minute straight before all scenarios
for our index and create user routes we only need to make one http request because we don't need authorization unlike the other routes
for the routes that require authorization we begin by creating a user to be able to capture the web token and assign it to a variable that will be used for the request that we are initially testing for