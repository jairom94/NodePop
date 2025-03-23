import express from 'express';
import logger from 'morgan';
import path from 'node:path';
// import session from 'express-session';
import connectMongoose from './lib/connectMongoose.js';
import * as sessionManager from './lib/sessionManager.js';

import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import profileRouter from './routes/profile.js';
import logoutRouter from './routes/logout.js';
import addProductRouter from './routes/addProduct.js';

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

app.use('/',indexRouter);
app.use('/login',loginRouter);
app.use((req,res,next)=>{
    if(!req.session.userID){
        res.redirect(`/login?from=${req.url}`)
        return
    }
    next()
})
app.use('/profile',profileRouter);
app.use('/logout',logoutRouter);
app.use('/products',addProductRouter);

export default app;