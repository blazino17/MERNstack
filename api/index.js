var Express = require("express");
var { MongoClient } = require("mongodb");
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());

var CONNECTION_STRING =
  "mongodb+srv://blazino17:Amakasin1.@cluster0.a53q7kc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

var DATABASENAME = "todoappdb";
var database;

app.listen(5038, async () => {
  const client = new MongoClient(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Assign the database to the `database` variable
    database = client.db(DATABASENAME);
    console.log(`Connected to database: ${DATABASENAME}`);
  } catch (e) {
    console.error(e);
  }
});

app.get("/api/todoapp/GetNotes", (request, response) => {
  database
    .collection("todoappcollection")
    .find({})
    .toArray((error, result) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.send(result);
      }
    });
});

app.post("/api/todoapp/AddNotes", multer().none(), (request, response) => {
  database
    .collection("todoappcollection")
    .countDocuments({}, function (error, numOfDocs) {
      if (error) {
        response.status(500).send(error);
      } else {
        database.collection("todoappcollection").insertOne(
          {
            id: (numOfDocs + 1).toString(),
            description: request.body.newNotes,
          },
          (err, result) => {
            if (err) {
              response.status(500).send(err);
            } else {
              response.json("Added Successfully");
            }
          }
        );
      }
    });
});

app.delete("/api/todoapp/DeleteNotes", (request, response) => {
  database.collection("todoappcollection").deleteOne(
    {
      id: request.query.id,
    },
    (err, result) => {
      if (err) {
        response.status(500).send(err);
      } else {
        response.json("Deleted Successfully");
      }
    }
  );
});

// var Express = require("express");
// var {MongoClient}=require("mongodb")
// var cors=require("cors");
// const multer=require("multer");

// var app=Express();
// app.use(cors());

// var CONNECTION_STRING =
//   "mongodb+srv://loanerAdmin:loanerAdminPass@muzingo.hulnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// var DATABASENAME="todoappdb";
// var database;

// app.listen(5038,async()=>{

//     const client = new MongoClient(CONNECTION_STRING);

//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();

//         // Make the appropriate DB calls
//         await  listDatabases(client);

//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
//     })

//     app.get('/api/todoapp/GetNotes',(request,response)=>{
//         database.collection("todoappcollection").find({}).toArray((error,result)=>{
//             response.send(result);
//         });
//     })

//     app.post('/api/todoapp/AddNotes',multer().none(),(request,response)=>{
//         database.collection("todoappcollection").count({},function(error,numOfDocs){
//             database.collection("todoappcollection").insertOne({
//                 id:(numOfDocs+1).toString(),
//                 description:request.body.newNotes
//             });
//             response.json("Added Successfully");
//         });
//     })

//     app.delete('/api/todoapp/DeleteNotes',(request,response)=>{
//         database.collection("todoappcollection").deleteOne({
//             id:request.query.id
//         });
//         response.json("Delete Successfully"); ``
//     })
