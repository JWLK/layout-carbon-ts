const { Op } = require('sequelize')
const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

//middle wares
const { isNotLoggedIn, isLoggedIn } = require('./middlewares')

const { sequelize, User, Workspace } = require('../models')

const router = express.Router()

/* /users :: GET, POST */
router.get('/users', (req, res, next) => {
    return res.json(req.user || false)
})
router.post('/users', isNotLoggedIn, async (req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            },
        })
        if (exUser) {
            return res.status(403).send('이미 사용 중인 아이디입니다.')
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const user = await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        })
        const tutorialWorkspace = await Workspace.findOne({ where: { id: 1 } })
        // const channel = await Channel.findOne({ where: { id: 1 } })
        await tutorialWorkspace.addMembers(user)
        // await channel.addMembers(user)
        res.status(201).send('ok')
    } catch (error) {
        console.error(error)
        next(error) // status 500
    }
})
router.post('/users/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err)
            return next(err)
        }
        if (info) {
            return res.status(401).send(info.reason)
        }
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.error(loginErr)
                return next(loginErr)
            }
            return res.status(200).json(
                await User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'nickname', 'email'],
                }),
            )
        })
    })(req, res, next)
})

router.post('/users/logout', isLoggedIn, (req, res) => {
    req.logout()
    req.session.destroy()
    res.send('ok')
})

module.exports = router
