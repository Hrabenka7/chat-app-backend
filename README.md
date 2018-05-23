# hackbook-social-network-server
MEAN stack app - social network and chat (in development). Server side.

# MVP
A user is able to sign up / log in / log out (secured by route guards, and 401 unauthorized status) <br/>
A user is able to view his own profile<br/>
A user is able to edit his own profile (edit, create, delete information)<br/>

@todo<br/>
A user is able to see profile of other users <br/>
A user is able to add/delete friends<br/>

# BACKLOG
A user can edit his profile picture (image upload)<br/>
A user can chat with all connected users in common conversation (broadcast)<br/>
A user can delete his profile<br/>

# App parts
List of all app server-side parts:

## Routes + Contollers
* auth.js
* user.js
* index.js (server-side home page)

## Models
* User
```javascript
const userSchema = new Schema({
  name: { type: String, required: true },
  cityOfResidence: { type: String, required: true },
  cohort: { type: String, required: true, enum: ['...'] },
  email: { type: String, required: true },
  password: { type: String, required: true },
  
  picture: { type: String, default: "..." },
  work: {type: String, default: '...'},
  about: {type: String, default: '...'},
  likes: {type: String, default: '...'},
  myStory: {type: String, default: '...'},

  skills: [String]

})
```

# LINK 
The app can be accessed here: https://hackbook-app.herokuapp.com/
