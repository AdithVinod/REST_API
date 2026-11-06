const express = require("express");

const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

// let users = [{id:1, name:"Anu", email:"anu@gmail.com"},
//     {id:2, name:"Rahul", email:"rahul@gmail.com"}
// ];


mongoose.connect('mongodb+srv://adithvinod23_db_user:BFP3Ham6J1DIvAZM@cluster0.ckou8y5.mongodb.net/RestApi')
.then(()=>{
    console.log('Connected to MongoDB!!!');
})
.catch(err=>{
    console.log("Error connecting to MongoDB", err);
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    createdAt: {type: Date, default: Date.now}
});

const User = mongoose.model('User', userSchema);

//create users
app.post('/users', async(req, res)=>{
    try {
        const {name, email} = req.body;

        if(!name || !email){
            return res.status(400).json({
                message: 'Name and email are required'
            });
        }

        const newUser = await User.create({
            name,
            email
        });

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//get users
app.get('/users', async(req, res)=>{
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
});


//get user by id
app.get('/users/:id', async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({
            message:"Invalid user ID"
        });
    }
});


//update user
app.put('/users/:id', async (req, res)=>{
    try {
        const {name, email} = req.body;

        const user = await User.findByIdAndUpdate(req.params.id, {name, email}, {new:true});

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message:"User updated successfully",
            user
        });
    } catch (error) {
        res.status(400),json({
            message:error.message
        });
    }
});


//delete user
app.delete('/users/:id', async (req, res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message:"User deleted successfully",
            user
        });
    } catch (error) {
        res.status(400),json({
            message:error.message
        });
    }
});




// //GET Method
// app.get("/",(req,res)=>{
//     res.send("REST API is working");
// });

// app.get("/users",(req,res)=>{
//     res.json(users);
// });

// app.get("/users/:id",(req,res)=>{
//     const user = users.find(item=> item.id === Number(req.params.id));

//     if(!user){
//         return res.status(404).json({message:"User not found"});
//     }

//     res.json(user);
// });


// //POST method
// app.post("/users", (req,res)=>{
//     const {name, email} = req.body;

//     if(!name || !email){
//         return res.status(400).json({
//             message: "Name and Email are required"
//         });
//     }

//     const newUser = {
//          id:users.length? Math.max(...users.map(item => item.id))+1:1, name, email
//     };

//     users.push(newUser);

//     res.status(201).json({
//         message:"User created successfully",
//         user: newUser
//     });
// });


// //PUT Method
// app.put("/users/:id",(req,res)=>{
//     const user = users.find(item=> item.id === Number(req.params.id))

//     if(!user){
//         return res.status(404).json({message:"User not found"});
//     }

//     const {name, email} = req.body;
//     if(!name || !email) {
//         return res.status(404).json({
//             message:"Name and Email are required"
//         });
//     }

//     user.name = name;
//     user.email = email;

//     res.json({
//         message:"User updated successfully",
//         user
//     });
// });


// //DELETE Method
// app.delete("/users/:id",(req,res)=>{
//     const index = users.findIndex(item => item.id === Number(req.params.id));
//     if(index === -1){
//         return res.status(404).json({
//             message:"User not found"
//         });
//     }

//     users.splice(index,1);

//     res.json({
//         message:"Users deleted successfully"
//     });
// });


app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})