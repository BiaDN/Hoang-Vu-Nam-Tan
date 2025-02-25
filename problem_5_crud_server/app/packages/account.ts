import express from 'express'
import { AcountController } from '@controllers/AccountController';
const { verifyToken } = require('../middleware/auth');

const accountRoute = express.Router()

accountRoute.post('/login', verifyToken, AcountController.login);

accountRoute.get('/test/test', (req, res) => {
    res.send("Hello World")
})


export default accountRoute;
