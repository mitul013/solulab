# SolulabProject

This is a user login and registration app using Node.js, Express, Passport, Mongoose, EJS and some other packages.

### SetUp in Your Machine

For installing all dependncies which mention in package.json file 

```sh
$ npm install
```

### Run 

For development purpose

```sh
$ npm run dev
```

For running test 

```sh
$ npm run test
```

For production 

```sh
$ npm start
```

### Visit http://localhost:5007

Create .env file and add MONGO_URI = 'your mongodb database uri'


## Description
I have used node js for backed , for frontend i have used EJS template and for storing data i have used No-SQL database Mongodb and for unit test i have used jest framework.
For user Authenticatio I have used passport-local.

## Authentication Middleware
### auth.js
ensureAuthenticated is for checking user is authenticated or not
forwardAuthenticated -> if user already authenticate then user automatically redirect to dashboard

## Endpoints

### GET

  #### /users/login
  render login page where user enter useid and password to login

  #### /users/register
  render register form 

  #### /users/nearby
  it gives the all the users which is near ( < 500km ) by logged in user

  #### /followers
  it gives the all the followers of logged in user

  #### /following
  it gives the all the following of logged in user

  #### /logout
  its for logout 
  
 ### POST
  #### /login
  it check given email & password vombination present in db or not if present then passport local and express session create serialize & deserialize method
  
  #### /register
  it checck all the validation like password length, pswd pswd2 are ssame or not, email is already regoster or not if registered then it shows error otherwise registeres and       save into DB
  
  #### /follow
  this post request for follow other users. we add user id to other user's followers list and also update user's following list

  #### /unfollow
  this post request for unfollow other users. we remove user id to other user's followers list and also update user's following list

