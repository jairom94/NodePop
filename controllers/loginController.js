export const logginPost = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })

        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Invalid credentials'
            res.locals.email = email
            return res.render('login')            
        }

        req.session.username = user.name
        req.session.userID = user._id
        res.redirect('/profile')
    } catch (error) {
        next(error)
    }
}

export const logginGet = (req, res, next) => {       
    if(req.session.userID){
        res.redirect('/profile');
        return
    }
    res.render('login');
}

export const logout = (req,res,next)=>{
    req.session.regenerate((err)=>{
        if(err){
            next(err)
            return
        }
        res.redirect("/login");       
    })
}