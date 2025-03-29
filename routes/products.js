import express from 'express';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import Product from '../models/Product.js';
import * as funcTools from '../lib/funcTools.js';
import { body, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';


const router = express.Router();

//View Porducts By User
router.get('/', async (req, res, next) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const items = 6;
        const user = req.session.userID;
        // res.locals.products
        // console.log(page)
        const products = await Product.find({ owner: user })
            .skip((page - 1) * items)
            .limit(items)
            .populate('tags', 'name -_id');
        const totalDocs = await Product.find({ owner: user }).countDocuments();
        const totalPages = Math.ceil(totalDocs / items);

        const [minMax] = await Product.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(user)
                }
            },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);
        res.locals.rangePrice = minMax
            ? { min: minMax.minPrice, max: minMax.maxPrice }
            : { min: 0, max: 100 }
        // console.log(minMax)
        res.locals.pagination = {
            products,
            page,
            totalPages,
            totalItems: totalDocs,
        }
        res.locals.tags = await Tag.find();
        res.render('products')
    } catch (error) {
        next(error)
    }
});

//Add product
router.post('/add', [
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
            if (!validations.isEmpty()) {
                console.log({ errors: validations.array() });
                res.redirect('/products')
                return
            }
            //lógica para add
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
                owner: req.session.userID,
                image,
                tags: tagsArray.map(tag_name => funcTools.getTagID(tagsDB, tag_name))
            }
            console.log(newProduct)
            const productInsert = await Product.insertOne(newProduct);
            console.log(productInsert)
            res.redirect('/products');
        } catch (error) {
            next(error)
        }
    });

//Delete product -> Falta implementar delegacion de errores
router.get('/delete/:id', [
    query('allow')
        .notEmpty()
        .withMessage('not must be empty')
        .custom((value) => value === 'true')
        .withMessage('not allow to delete product'),
],
    async (req, res, next) => {
        try {
            const resultValidations = validationResult(req);
            if (!resultValidations.isEmpty()) {
                console.log({ errors: resultValidations.array() })
                return
            }
            const { id } = req.params;
            const { allow } = req.query;
            if (allow) {
                const productDelete = await Product.deleteOne({ _id: id })
                console.log(productDelete)
                res.redirect('/products')
            }
        } catch (error) {
            next(error)
        }
    });

//Filter Products
router.get('/user/:userID/filter', async (req, res, next) => {
    try {
        const { name, tags } = req.query;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const items = 6;
        const tagsArray = (typeof tags === 'string')
            ? [tags]
            : tags
            ?? [];
        const regex = new RegExp(`^${name}`, "i");
        const user = req.session.userID;
        const tagsDB = await Tag.find();
        const query = { owner: user }
        if (name) {
            query.name = { $regex: regex };
        }
        if (name) {
            query.name = { $regex: regex };
        }
        if (tagsArray.length > 0) {
            query.tags = { $in: tagsArray.map(t_name => funcTools.getTagID(tagsDB, t_name)) }
        }
        const ProductsFilter = await Product.find(query)
            .skip((page - 1) * items)
            .limit(items)
            .populate('tags', 'name -_id');

        const [minMax] = await Product.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(user)
                }
            },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);
        res.locals.rangePrice = minMax
            ? { min: minMax.minPrice, max: minMax.maxPrice }
            : { min: 0, max: 100 }

        const totalDocs = await Product.find(query).countDocuments();
        const totalPages = Math.ceil(totalDocs / items)
        res.locals.pagination = {
            products: ProductsFilter,
            page,
            totalPages,
            totalItems: totalDocs,
        }
        // res.locals.products = ProductsFilter;
        res.locals.tags = tagsDB;
        res.render('products')
    } catch (error) {
        next(error)
    }
})

export default router;
