import express from 'express';

const router = express.Router();

router.get('/', async (req, res, next) => {
    console.log(req.query);
})

export default router;