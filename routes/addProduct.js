import express from 'express';

const router = express.Router();

router.post('/add',(req,res,next)=>{
    const {name,price,image,tags} = req?.body
    // console.log(req.body);    
    const newProducts = [...req.session.products,{
        id:crypto.randomUUID(),
        name,
        brand: "Samsung",
        price:parseFloat(price),
        image:image,
        tags,
        user_id:req.session.user.id
    }]
    req.session.products = newProducts
    
    res.redirect('/profile')
});

router.post('/:id',(req,res,next)=>{    
    console.log('Delete product')
    res.render('profile')
});

export default router;