import express from 'express';
import { logginGet, logginPost } from '../controllers/loginController.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', logginGet);

router.post('/', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        console.log(email,password);
        
        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Invalid credentials'
            res.locals.email = email
            return res.render('login')            
        }
        req.session.fullname = `${user.name} ${user.lastname_1}`
        req.session.userID = user._id
        const to = req.query.from ?? '/'
        res.redirect(to)
    } catch (error) {
        next(error)
    }
});

export default router;



