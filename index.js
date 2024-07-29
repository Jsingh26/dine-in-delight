const express=require("express")
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");
const bcrypt=require("bcrypt");
const { message } = require("antd");


const app=express();
dotenv.config();

const port=process.env.PORT || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://japinder2004:DoSfh0qu60GOnEMT@cluster0.jliedkg.mongodb.net/`,{
    
});


//registration Schema
const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String

});

//mode of registration schema
const Registration=mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded ({extended:true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('pages'));

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/pages/registration.html");
})

app.post("/register", async (req,res)=>{
    try{
        const {name,email,password}= req.body;

        const existingUser =await Registration.findOne({email:email});
        //check for existing user
        if(!existingUser){
            const registrationData=new Registration({
                name,
                email,
                password,
            });
            await registrationData.save();
            res.redirect("/success");

        } 
        else{
            console.log("User already exist");
            // alert("user already exists");
            res.redirect("/login");
        }
            
    }catch (error){
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success", (req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");

})

app.get("/login",(req,res)=>{
    res.sendFile(__dirname+"/pages/login.html");

})

app.get("/payment",(req,res)=>{
    res.sendFile(__dirname+"/pages/payment.html")
})



app.post("/login", async(req, res)=>{
    // Assuming Registration is a Mongoose model
const user = await Registration.findOne({ email: req.body.email });
if (!user) {
  // Handle the case where no user is found
  console.log('User not found');
  res.status(401).redirect('/error');
  return;
}

try {
  let isValidPassword = await Registration.find({ email: req.body.email },{password: req.body.password});
  if (isValidPassword) {
    // Password is valid, redirect to protected route
    console.log('User authenticated');
    res.redirect('/index');
  } else {
    // Password is invalid, send error response
    console.log('Invalid password');
    res.status(401).redirect('/error');
  }
} catch (error) {
  // Handle any errors that occur during password comparison
  console.error('Error authenticating user:', error);
  res.status(500).send('Internal Server Error');
}
});

app.get("/index",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})

app.get("/addtocart",(req,res)=>{
    res.sendFile(__dirname+"/pages/addtocart.html");
})


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})

