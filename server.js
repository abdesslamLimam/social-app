import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import user from './dbUser.js'
import jwt from 'jsonwebtoken'

const port = process.env.PORT || 9000
const app = express()

const ACCESS_TOKEN_SECRET = "e86wxv8hmmo8cbz8gk2bjzb4xaNs78xksdld"
const REFRESH_TOKEN_SECRET = "blablaa"
const ip="mongodb+srv://admin:sidislouma@cluster0.13yt1.mongodb.net/appdb?retryWrites=true&w=majority"
mongoose.connect(ip,{
    useCreateIndex : true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// mongoose.conct = ()=>{
// const ip="mongodb+srv://admin:sidislouma@cluster0.13yt1.mongodb.net/appdb?retryWrites=true&w=majority"
// mongoose.connect(ip,{
//     useCreateIndex : true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// }
// mongoose.disconnect()
app.use(express.json())
app.use(cors())



app.get('/allusers',(req,res)=>{
    // mongoose.conct()
    user.find((err,data)=>{
        res.json(data)
    })
   
    // mongoose.disconnect()
    
})

app.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    if(username && password){
    user.findOne({username:username},(err,data)=>{
        if (err) {res.sendStatus(404)}
        else {
            const accessToken = jwt.sign(data.toJSON(),ACCESS_TOKEN_SECRET)
            res.json({accessToken:accessToken})
        }
    })  
    
        // const accessToken = jwt.sign(logeduser.toJSON(),ACCESS_TOKEN_SECRET)
        
    }
    else {res.send("no body")}
    
    
})

app.post('/signup',(req,res)=>{
    const newUser = req.body
    if (newUser) {
        // mongoose.conct()
        user.create(newUser,(err,user)=>{
            if (err) return res.send({"something wrong with database: ":err})
            if (user) return res.sendStatus(200)
        })
        // mongoose.disconnect()
    }
})
app.get('/test',auth_token,(req,res)=>{
    const logedUser = req.user
    if(logedUser) return res.send('Worked fine')
})

app.listen(port,()=>{
    console.log(`server is listening at localhost:${port}`)
})

function auth_token(req,res,next) {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader.split(" ")[1]
    if ( accessToken == null) return res.sendStatus(403)
    jwt.verify(accessToken,ACCESS_TOKEN_SECRET,(err,user)=>{
        if (err) return res.sendStatus("403")
        req.user=user
        next()
    })
}