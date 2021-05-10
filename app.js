const express = require("express"); // require express
const app = express();   // the server to use express
const port = 4000;  // port 


app.use(express.json())


const mongoose = require("mongoose")
const connectionString = "mongodb://localhost:27017/bookshop"
//connectionClient
mongoose.connect(connectionString, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}, (err) => {
   if(err) {
       console.log(err);
   }
   else {
       console.log("database connection is successful");
   }
})

//creation of the data schema
const bookSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String
})

const data = mongoose.model('data', bookSchema) // use of the data model


// the post request routes
app.post("/data", (req, res) => {
     const person = req.body.person;
     data.create({
         name:person.name,
         email:person.email,
         country:person.country
     }, (err, newPerson) => {
           if(err) {
               return res.status(500).json({message: err})
           }
           else {
               return res.status(200).json({message: "Your request is successful", newPerson})
           }
     })
})


// the get request routes
app.get('/data', (req,res) => {
    data.find({}, (err, people) => {
        if(err) {
       return   res.status(500).json({message: err})
        } 
        else {
          return  res.status(200).json({people})
        }
    })
})


//get the data by the id
app.get('/data/:id', (req, res) => {
    data.findById(req.params.id, (err, book) => {
        if (err) {
          return  res.status(500).json({message: err})
        } else {
          return  res.status(200).json({ book })
        }
    })
})
//get the data by id and update
app.put("/data/:id", (req, res) => {
    data.findByIdAndUpdate(req.params.id, {
        name:req.body.name, 
        email:req.body.email,
      country: req.body.country
    }, (err, person) => {
        if(err) {
         return res.status(500).json({message: err})
        } else if(!person) {
            return res.status(404).json({message: " person not found"})
        }
         else {
          person.save((err, updatedPerson) => {
              if(err) {
                  return res.status(400).json({message: err})
              }
              else {
                  return res.status(200).json({message: "The data has been updated successfully", updatedPerson})
              }
          })
        }
    })
})
//get the data by id and delete
app.delete("/data/:id", (req, res) => {
    data.findByIdAndDelete(req.params.id, (err, person) => {
        if(err) {
            return res.status(500).json({message: err})
        } else if (!person){
             return res.status(400).json({message: "Person not found"})
        } else {
            return res.status(200).json({message: "The data has been deleted successfully"})
        }
    })
})

app.listen(port, function () {
    console.log("server is up and running");
})