const asyncHandler = require('express-async-handler');
const User = require("../model/userModel");
const Categorie = require("../model/CategoriaModel");


const getAllCategories = asyncHandler(async (req, res) => {
    // Find all Categories
    const allCategories = await Categorie.find();

    res.status(200).json(allCategories);
})

module.exports = {
getAllCategories
}