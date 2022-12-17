const express = require('express')
const mysql = require('mysql')
const app = express()
var cors = require('cors')
const port = 5000
app.use(express.json())
app.use(cors())

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'time_tracker'
  }); 
   
  db.connect((err)=>{
       console.log('db connection success')
  });
  
  
 

  app.get('/',(req,res)=>{
       db.query('SELECT* FROM session',(err,result)=>{
       let hour = 0
       let minute = 0 
        result.map(data=>{
              hour += parseInt(data.hour)
              minute += parseInt(data.minute)
        })
      
           res.status(200).json({
             message:'Showing results',
             length: result.length,
             data: result,
             hour: hour, 
             minute: minute,
             error: false
           })
       })
    
  })
  
 app.post('/session/create',(req,res)=>{
   
    let sql = 'INSERT INTO session SET?'
  
      db.query(sql,req.body,(err,result)=>{
         if(err) throw err
          
         res.status(200).json({
             message:'Sucessfully created session',
             error: false
         })
         
      })    
    
 })
  

 app.get('/getById/:id',(req,res)=>{
     const sql = `SELECT * FROM session WHERE id = ${req.params.id}`
     db.query(sql,(err,result)=>{
         if(err){console.log(err)}
         else{
            res.status(200).json(result)
         }
     })
   
 })  
   
app.get('/getBetween/:from/:to',(req,res)=>{
  
    const sql = `SELECT * FROM session WHERE sessionDate BETWEEN '${req.params.from}' AND '${req.params.to}'`

    db.query(sql,(err,result)=>{
          if(err){res.status(500).send(err)}
          else{
              res.status(200).send(result)
          }
    }) 
})



//SERVER LISTENING
app.listen(port,()=>{
    console.log(`Backend server is listening at port ${port}`)
})


