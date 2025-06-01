const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const redisClient = require('../redis');


router.post('/', async(req, res) => {
    try {
        const {name, price, stock} = req.body
        await Product.create({name, price, stock});
        // Invalidate cache because a new product has been added
        await redisClient.del("products:all");

        res.status(201).json({message: "Product created"});
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/', async(req, res) => {
    try {
        const cacheKey = "products:all";
        const cachedData = await redisClient.get(cacheKey);
    
        if (cachedData) {
            console.log('Extracting values from Redis...');
            return res.json(JSON.parse(cachedData));
        }
    
        console.log("Extracting values from MySQL...");
    
        const rows = await Product.findAll();
        await redisClient.set(cacheKey, JSON.stringify(rows), {
            EX: process.env.REDIS_EXPIRE_SECONDS || 1800
        });
        res.json(rows);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `products:${id}`;

    try {
        const cachedProduct = await redisClient.get(cacheKey);

        if (cachedProduct) {
            console.log(`Product found through cache: ${id}`);
            return res.json(JSON.parse(cachedProduct));
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await redisClient.set(cacheKey, JSON.stringify(product), {
            EX: process.env.REDIS_EXPIRE_SECONDS || 1800
        });

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.update({ name, price, stock });

         // Invalidate and update cache
        await redisClient.del("products:all");
        await redisClient.set(`products:${id}`, JSON.stringify(product), {
            EX: process.env.REDIS_EXPIRE_SECONDS || 1800
        });

        res.json({ message: 'Product updated', product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.destroy();

        // Invalidate cache
        await redisClient.del("products:all");
        await redisClient.del(`products:${id}`);
        
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;