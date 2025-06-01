const express = require('express');
const app = express();
const productsRouter = require('./routes/products');
const sequelize = require('./models');
const PORT = process.env.PORT;

app.use(express.json());
app.use("/products", productsRouter);

sequelize.sync().then(() => {
    console.log("Database synchronized");


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

