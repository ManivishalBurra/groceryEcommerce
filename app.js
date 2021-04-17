const express= require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const { UserRefreshClient, LoginTicket } = require('google-auth-library');
const app=express();

var loginStatus = false;
var creds ="";


var corsOptions={
  origin:"https://vast-oasis-03078.herokuapp.com"
};


//MONGODB
mongoose.connect("mongodb+srv://admin-manivishal:Muddup3ru!@cluster0.qe2uy.mongodb.net/groceriesDB?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set("useCreateIndex",true);



const userSchema = new mongoose.Schema({
  email:String,
  username:String,
  image:String,
  googleId:String,
  user:String
});

const User=new mongoose.model("User",userSchema);


app.use(cors(corsOptions));
app.use(express.json());

const shopList=[
    {
        id:1,
        image:"images/pineapple.jpeg",
        order:"Pineapple",
        buy:"Add to cart",
        access:"1",
        price:100,
        quantity:"1pc"
      },
      {
        id:2,
        image:"https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/chicken-eggs-in-eggbox-gerard-lacz.jpg",
        order:"Eggs",
        buy:"Add to cart",
        access:"1",
        price:60,
        quantity:"12pc"
      },
      {
        id:2,
        image:"https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/chicken-eggs-in-eggbox-gerard-lacz.jpg",
        order:"Eggs",
        buy:"Add to cart",
        access:"1",
        price:60,
        quantity:"12pc"
      },
      {
        id:2,
        image:"https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/chicken-eggs-in-eggbox-gerard-lacz.jpg",
        order:"Eggs",
        buy:"Add to cart",
        access:"1",
        price:60,
        quantity:"12pc"
      },
      {
        id:2,
        image:"https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/chicken-eggs-in-eggbox-gerard-lacz.jpg",
        order:"Eggs",
        buy:"Add to cart",
        access:"1",
        price:60,
        quantity:"12pc"
      },
      
];





app.get("/cartData",function(req,res){
    res.send(shopList);
});
app.get("/loginStatus",function(req,res){
  res.send(loginStatus);
})
app.get("/accountCreds",function(req,res){
  res.send(creds);
});

app.post("/googlelogin",(req,res)=>{
  User.findOne({email:req.body.email},function(err,userfun){
    if(err){
      console.log(err);
    }
    else{
      if(!userfun){
      const user = new User({
        username:req.body.name,
        image:req.body.image,
        email:req.body.email,
        googleId:req.body.googleId,
        user:"user"
        });
        user.save();
        res.send("notuser");
      }
      else{
        res.send("user");
      }
    }
  });
});
app.post("/login",(req,res)=>{
  User.findOne({email:req.body.email},function(err,userfun){
    if(err){
      console.log(err);
    }
    else{
      if(!userfun){
        res.send("fail");
      }
      else{
        creds=userfun;
        const num = parseInt(Math.random()*100000);
        
        var transporter = nodemailer.createTransport({
          
          service: 'hotmail',
          auth: {
            user: 'groceries.me@outlook.com',
            pass: 'Muddup3ru!'
          },
          tls:{
            rejectUnauthorized:false
        }
        });        
        var mailOptions = {
          from: 'groceries.me@outlook.com',
          to: req.body.email,
          subject: 'verification OTP from groceries',
          text: num.toString()
        };
        console.log(mailOptions);
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        email=req.body.email;
        res.send(num.toString());
      }
    }
  });
});
app.post("/loginStatusUpdate",function(req,res){
  
  loginStatus=req.body.status;
  console.log(loginStatus);
});
let port=process.env.PORT;
app.listen(port||9000 ,function(){
    console.log(`im listening to the port ${port}`);
})

