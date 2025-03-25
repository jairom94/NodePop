import express from 'express';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import Product from '../models/Product.js';
import * as funcTools from '../lib/funcTools.js';
import { body,matchedData,validationResult } from 'express-validator';

const router = express.Router();

//View Porducts By User
router.get('/', async (req,res,next)=> {
    try {
        const user = req.session.userID;        
        res.locals.products = await Product.find({ owner: user }).populate('tags', 'name -_id');
        res.locals.tags = await Tag.find()
        res.render('products')
    } catch (error) {
        next(error)
    }
});

//Add product
router.post('/add',[
        body('name')
        .notEmpty()
        .withMessage('name is required'),
        body('price')
        .notEmpty()
        .withMessage('price is required'),
        body('image')
        .notEmpty()
        .withMessage('image is required'),
        body('tags')
        .notEmpty()
        .withMessage('must be choose min one tag')
    ], 
    async (req, res, next) => {
    try {
        //validaciones
        const validations = validationResult(req);
        if(!validations.isEmpty()){
            console.log({errors:validations.array()});            
            res.redirect('/products')
            return
        }
        //logica para add
        const { name, price, image, tags } = req.body
        const tagsArray = (typeof tags === 'string')
        ? [tags] 
        : tags 
        ?? []; 
        const user = await User.findById(req.session.userID);
        const tagsDB = await Tag.find();        
        const newProduct = {
            name,
            price,
            owner: user._id,
            image,
            tags: tagsArray.map(tag_name => funcTools.getTagID(tagsDB,tag_name))
        }
        const productInsert = await User.insertOne(newProduct);
        console.log(productInsert)
        res.redirect('/products');
    } catch (error) {
        next(error)
    }
});

//Delete product
router.get('/delete/:id', (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    console.log(req.path)
    // next()
    //console.log('Delete product')

    //res.redirect('/profile')
});

//Filter Products
router.get('/user/:userID/filter', async (req, res, next) => {
    try {
        const { name,tags } = req.query;
        const tagsArray = (typeof tags === 'string')
        ? [tags] 
        : tags 
        ?? [];                    
        const regex = new RegExp(`^${name}`, "i");
        const user = req.session.userID;
        const tagsDB = await Tag.find();
        const query = {owner:user}
        if(name){
            query.name = { $regex: regex };
        }
        if(tagsArray.length > 0){
            query.tags = {$in:tagsArray.map(t_name => funcTools.getTagID(tagsDB,t_name))}
        }
        const ProductsFilter = await Product.find(query)
            .populate('tags', 'name -_id');
        res.locals.products = ProductsFilter;
        res.locals.tags = tagsDB;
        res.render('profile')
    } catch (error) {
        next(error)
    }
})

export default router;
