import Product from "../models/Product.js";
import Tag from "../models/Tag.js";


export const index = (req, res, next) => {
    res.render('home');
}

export const profile = async (req, res, next) => {
    try {
        const user = req.session.userID;        
        res.locals.products = await Product.find({ owner: user }).populate('tags', 'name -_id');
        res.locals.tags = await Tag.find()
        res.render('profile');
    } catch (error) {
        next(error)
    }
}

