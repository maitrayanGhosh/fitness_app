if(process.env.NODE_ENV  !== 'production'){
    require('dotenv').config()
}


const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const methodOverride = require('method-override')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(passport, 
    email => users.find(user=> user.email === email ),
    id => users.find(user=> user.id === id )
)

const app = express()


const users=[]

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static('assets'))

var excerciseList= [
    {
        weight : "20",
        reps : "12345678"
    },
    {
        weight : "25",
        reps : "435262313"
    },
    {
        weight : "30",
        reps : "321223"
    }
]

app.get('/',checkAuthenicated ,(req,res)=>{
    res.render('index.ejs' , { 
        name : req.user.name ,
        excercise_list : excerciseList
    })
})


app.post('/create-set', (req,res)=>{
    // excerciseList.push({
    //     weight:req.body.weight,
    //     reps:req.body.reps
    // })

    excerciseList.push(req.body)

    return res.redirect('back')
})

app.get('/delete-set',(req,res)=>{
    let set = req.query.weight

    let contactIndex = excerciseList.findIndex( contact => contact.weight == set )


    if(contactIndex != -1 ){
        excerciseList.splice(contactIndex,1)
    }

    return res.redirect('back')
})


// authetencation part start
app.get('/login', checkNotAuthenicated  ,(req,res)=>{
    res.render('login.ejs')
})

app.get('/register', checkNotAuthenicated ,(req,res)=>{
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenicated  ,async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name : req.body.name,
            email : req.body.email,
            password:hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.post('/login'  ,checkNotAuthenicated , passport.authenticate('local' , {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
} ))
function checkAuthenicated(req,res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenicated(req,res,next){
    if(req.isAuthenticated()){
       return res.redirect('/')
    }
    next()
}
app.delete('/logout' , (req,res)=>{
    req.logOut()
    res.redirect('/')
})

// authentication part end


app.listen(3000)


