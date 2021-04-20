const express= require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const { UserRefreshClient, LoginTicket } = require('google-auth-library');
const { reseller } = require('googleapis/build/src/apis/reseller');
const app=express();


var corsOptions={
  origin:"http://localhost:3000"
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
const shopListSchema = new mongoose.Schema({
  image:String,
  order:String,
  buy:String,
  access:String,
  price:Number,
  quantity:String,
  email:String,
  catagory:String,
  location:String
})
const martListSchema = new mongoose.Schema({
  image:String,
  order:String,
  buy:String,
  access:String,
  price:Number,
  quantity:String,
  email:String,
  catagory:String,
  location:String
})



const User=new mongoose.model("User",userSchema);
const ShopList = new mongoose.model("ShopList",shopListSchema);
const MartList = new mongoose.model("MartListData",martListSchema);

app.use(cors(corsOptions));
app.use(express.json());




app.post("/deleteItems",function(req,res){
  ShopList.findOneAndDelete({_id:req.body.id},function(err,del){
    if(err){
      console.log(err);
    }
    else{
     ShopList.find({email:req.body.email},function(err,result){
       if(err){
         console.log(err);
       }
       else{
         res.send(result);
       }
     }) 
    }
  })
})










app.post("/cartData",(req,res)=>{
  ShopList.find({email:req.body.email},function(err,shopList){
    if(err){
      console.log(err);
    }
    else{
        const shop = new ShopList({
          image:req.body.image,
          order:req.body.order,
          buy:"Add to cart",
          access:"1",
          price:req.body.price,
          quantity:req.body.quantity,
          email:req.body.email,
          catagory:req.body.catagory,
          location:req.body.location
          });
          shop.save();
    }
  })
  MartList.find({order:req.body.order},function(err,martList){
    if(err){
      console.log(err);
    }
    else{
      console.log(martList.length);
      if(martList.length===0){
      const mart = new MartList({
        image:req.body.image,
        order:req.body.order,
        buy:"Add to cart",
        access:"1",
        price:req.body.price,
        quantity:req.body.quantity,
        email:req.body.email,
        catagory:req.body.catagory,
        location:req.body.location
        })
        mart.save();
      }
    }
  })
  res.send(true);
})
app.post("/",function(req,res){
ShopList.find({order:req.body.order},function(err,ans){
  if(err){
    console.log(err);
  }
  else{
    res.send(ans);
  }
})
})
app.get("/martListData",(req,res)=>{
  MartList.find({},function(err,martList){
    if(err){
      console.log(err);
    }
    else{
      res.send(martList);
    }
  })
})

app.get("/cartData",function(req,res){
  ShopList.find({},function(err,shopList){
    if(err){
      console.log(err);
    }
    else{
      console.log(shopList);
       res.send(shopList);
    }
  })
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
        user:"User"
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
app.post("/getcreds",function(req,res){
  User.findOne({email:req.body.email},function(err,userfun){
    if(err){
      console.log(err);
    }
    else{
      if(userfun){
        res.send(userfun);
      }
    }
  });
});
app.post("/updateUser",(req,res)=>{
  User.findOneAndUpdate({email:req.body.email},{user:req.body.user},(err,data)=>{
    if(err){
      console.log(err);
      res.send(false);
    }
    else{
      console.log(data);
      res.send(true);
    }
  })
})

app.post("/queryByOrder",function(req,res){

    ShopList.find({order:req.body.order},function(err,result){
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    })

})  



let port=process.env.PORT;
if(port===undefined || port ===null){
  port=9000;
}
app.listen(port||9000 ,function(){
    console.log(`im listening to the port ${port}`);
})

