const mongoose = require('mongoose')
const categoriaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    default: null   // null = top-level (like Housing, Transportation)
  },
  isDefault: {
    type: Boolean,
    default: true   // seeded categories are true, user-created false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null   // filled in for personal categories
  }
})

module.exports = mongoose.model('Categoria', categoriaSchema)