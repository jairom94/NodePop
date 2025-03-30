import express from 'express';
import logger from 'morgan';
import path from 'node:path';
// import session from 'express-session';
import connectMongoose from './lib/connectMongoose.js';
import * as sessionManager from './lib/sessionManager.js';
import * as messagesManager from './lib/messageFlash.js';

import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import profileRouter from './routes/profile.js';
import logoutRouter from './routes/logout.js';
import productRouter from './routes/products.js';

await connectMongoose();
console.log('Success connect to MongoDB');

const app = express();




app.set('views','views');
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(express.static(path.join(import.meta.dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);
app.use(messagesManager.flashActivate);
app.use(messagesManager.useErrorMessages);

app.use('/',indexRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/register',registerRouter);
app.use(sessionManager.guard); //login required
app.use('/profile',profileRouter);
app.use('/products',productRouter);

app.use((err,req,res,next)=>{
    const we = {
        type: 'field',
        value: undefined,
        msg: 'must be choose min one tag',
        path: 'tags',
        location: 'body'
    }
    if(err.array){
        console.log(req.url)
        res.locals.errors = err.array().map(e =>`${e.path} ${e.msg}`)
        res.redirect('/products')
        return
    }
    res.status(404).render('404')
})


export default app;