const asyncHandler = require('express-async-handler');
const User = require("../model/userModel");
const Categorie = require("../model/CategoriaModel");


const getAllCategories = asyncHandler(async (req, res) => {
    // Find all Categories
    const allCategories = await Categorie.find();
    // Map categories for react-select
    const options = allCategories.map(cat => ({
        ...cat._doc,
        value: cat.name,
        label: cat.name
    }));

    res.status(200).json(options);
    // res.status(200).json(allCategories);
})

module.exports = {
getAllCategories
}