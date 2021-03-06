//Node
const path = require('path')
//Express
const express = require('express')
const session = require('express-session')
//Security Tool
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
//Auth Tool
const passport = require('passport')
//Debug Tool
const morgan = require('morgan')

/* Init Parameter Setting */
dotenv.config()

/* Import Project Folder */
//Routes
const apiRouter = require('./routes/api')

//Passport Strategy
const passportConfig = require('./passport')

//Websocket
const webSocket = require('./socket')

/* Express Setting */
const app = express()
app.set('PORT', process.env.PORT || 3095)
//Express Path
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
//Express middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))

//Sequlize
const { sequelize, User, Workspace, WorkspaceMember } = require('./models')
const DB = async () => {
    await sequelize
        .sync({ force: true })
        .then(() => {
            console.log('DB 연결 성공')
        })
        .catch(console.error)
    //User
    await Workspace.bulkCreate([
        //
        {
            id: 1,
            name: 'Tutorial',
            url: 'tutorial',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ])
    await User.bulkCreate([
        {
            id: 1,
            email: 'admin@admin.com',
            nickname: 'ADMIN',
            password:
                '$2b$12$bss2W8Ak6rvvNUbNZ/2lHOuWqz.oVCBAFctyaRro7uczXDNTGKs3O',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ])
    await WorkspaceMember.bulkCreate([
        {
            id: 1,
            loggedInAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            UserId: 1,
            WorkspaceId: 1,
        },
    ])
}

DB()
//Env Check
const prod = process.env.NODE_ENV === 'production'
if (prod) {
    app.enable('trust proxy')
    app.use(morgan('combined'))
    app.use(helmet({ contentSecurityPolicy: false }))
    app.use(hpp())
} else {
    app.use(morgan('dev'))
    app.use(
        cors({
            origin: true,
            credentials: true,
        }),
    )
}
//Session
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
    },
}
if (prod) {
    sessionOption.cookie.secure = true
    sessionOption.cookie.proxy = true
}
app.use(session(sessionOption))

//Passport
passportConfig()
app.use(passport.initialize())
app.use(passport.session())

/* Route Setting */
//api
app.use('/api', apiRouter)

//default
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const server = app.listen(app.get('PORT'), () => {
    console.log(`listening on port ${app.get('PORT')}`)
})

//WebSoket
webSocket(server, app)
