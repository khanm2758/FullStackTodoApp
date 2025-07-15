const express = require("express");
const app = express();
let { MongoClient, ObjectId } = require("mongodb");
const sanitizeHtml = require("sanitize-html")
let db;

// give public folder access to express.
app.use(express.static("public")); // (This way we can connect js file)

// 🔁 Step 1: Split credentials for encoding
const username = encodeURIComponent("mohammadmohiuddin2758");
const password = encodeURIComponent("iBP#S4Ukct.pzgM"); // <-- This had special chars

// 🔗 Step 2: Use encoded values in URI
const uri = `mongodb+srv://${username}:${password}@cluster.ytiwmnz.mongodb.net/TodoApp?retryWrites=true&w=majority&appName=Cluster`;

async function go() {
  let client = new MongoClient(uri);
  await client.connect();
  db = client.db();

  app.listen(3000);
}

go();

// specify the async operation at express
app.use(express.json());

/*
Now we need to tell express that add all form values to the body object and add that body object to the request object 

 Middleware to parse URL-encoded bodies (as sent by HTML forms)
 
*/
app.use(express.urlencoded({ extended: true }));

// password protection feature build
function passwordSecurity(req, res, next){
    
  res.set("WWW-Authenticate", "basic realm = 'simple todo app' ")
    
   if(req.headers.authorization == "Basic dG9kb0FwcDoxMjM0NTY3ODk="){
    next()
   }else{
    res.status(401).send("Authentication require")
   }
}

app.use(passwordSecurity)


//app.get(): Handle incoming requests from the home page URL
app.get("/", async function (req, res) {
  // Load data from the database
  const items = await db.collection("items").find().toArray();

  res.send(`
         <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css " integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  <script src="https://unpkg.com/axios/dist/axios.min.js" defer></script>
  <script src="/browser.js" defer></script>
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method="POST">
        <div class="d-flex align-items-center">
          <input id="create-field" name="userInputValue" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">
        
    </ul>
    
  </div>
  
</body>

<script>
     let items =   ${JSON.stringify(items)}
</script>
</html>
      
        
        `);
});

// store user data in the mongo db
app.post("/create-item", async function (req, res) {
 
  // html sanitization. we are not allow any html tags or attribute by this piece of code: {allowedTags: [], allowedAttributes: {}}
  let safeText = sanitizeHtml(req.body.text, {allowedTags: [], allowedAttributes: {}})


  const info = await db.collection("items").insertOne({ text: safeText });

  // send back the newly created mongodb data and id to the client-side
  res.json({_id: info.insertedId, text: safeText})
});


// connection established between js file and node server
app.post("/update-item", async function (req, res) {

  // html sanitization. we are not allow any html tags or attribute by this piece of code: {allowedTags: [], allowedAttributes: {}}
  let safeText = sanitizeHtml(req.body.text, {allowedTags: [], allowedAttributes: {}})

  // update user data in the database
  await db.collection("items").findOneAndUpdate({ _id: new ObjectId(req.body.id) },{ $set: { text: safeText } }); // (filter, update, options)
  res.send("success");

  //  console.log(req.body.text);
  //  res.send('success')
});

// delete item
app.post("/delete-item", async function(req, res){
    await db.collection('items').deleteOne({_id:  ObjectId.createFromHexString(req.body.id)})
    res.send('successfully delete')
})