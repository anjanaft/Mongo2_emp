const Express=require('express');
var bodyparser=require('body-parser');
var request=require('request');
var app=new Express();
var Mongoose=require('mongoose');
const EmpModel=Mongoose.model("empdetails",
{
    name:String,
    designation:String,
    salary:String
});


Mongoose.connect("mongodb://localhost:27017/empdb");

app.set('view engine','ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.get('/',(req,res)=>
{
 res.render('index');
});
app.post('/read',(req,res)=>
{

console.log(req.body);
var emp=new EmpModel(req.body);
emp.save((error,data)=>
{
    if(error)
    {
        throw error;
    }
    else{
        res.send("succesfully inserted"+data);
    }
});


});
app.get('/getdatas',(req,res)=>{

var result=EmpModel.find((error,data)=>
{
 if(error)
 {
     throw error;
 }
 else{
     res.send(data);
 }
})

});
const getdataApi="http://localhost:3000/getdatas";
app.get('/view',(req,res)=>
{
    request(getdataApi,(error,response,body)=>{
         
        var data=JSON.parse(body);
        console.log(data);
        res.render('view',{"data":data});
    });
    
});
app.get('/getAstudent/:name',(req,res)=>
{
    var ename=req.params.name;
    var result=EmpModel.find({name:ename},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(data);
        }
    });
});



app.listen(process.env.PORT || 3000,()=>
{
    console.log("Server is running");
});