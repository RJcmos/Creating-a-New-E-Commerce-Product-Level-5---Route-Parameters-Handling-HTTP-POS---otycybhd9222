const fs = require('fs');
const express = require('express');
const app = express();

// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);

// Middlewares
app.use(express.json())

// Write POST endpoint for creating new product here
app.post('/api/v1/products', (req, res) => {
  const { name, price, quantity } = req.body;

  // Validate the product data
  if (!name || typeof price !== 'number' || typeof quantity !== 'number' || price < 0 || quantity < 0) {
    return res.status(400).json({
      status: 'Error',
      message: 'Invalid product data. Please provide a valid name, price, and quantity.',
    });
  }

  // Generate a new unique ID for the product
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  // Create a new product object
  const newProduct = {
    id: newId,
    name,
    price,
    quantity,
  };

  // Add the new product to the products array
  products.push(newProduct);

  // Update the products data in the JSON file
  fs.writeFileSync(`${__dirname}/data/product.json`, JSON.stringify(products, null, 2));

  // Return a 201 Created status along with the newly created product
  res.status(201).json({
    status: 'Success',
    message: 'Product added successfully',
    data: {
      newProduct,
    },
  });
});
// Endpoint /api/v1/products

// GET endpoint for sending the details of users
app.get('/api/v1/products', (req,res) => {
    res.status(200).json({
    status:'Success',
    message:'Details of products fetched successfully',
    data:{
        products
    }
});
});
app.get('/api/v1/products/:id', (req,res) => {
    let {id} = req.params;
    id *=1;

    const product = products.find(product => product.id===id);
    if(!product){
        return res.status(404).send({status:"failed", message: "Product not found!"});
    }
 
    res.status(200).send({
        status : 'success',
        message : "Product fetched successfully",
        data: {
            product
        }
});
});
    
module.exports = app;

