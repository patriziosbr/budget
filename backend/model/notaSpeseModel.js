const mongoose = require('mongoose')
const notaSpeseSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        testo: {
            type: String,
            require: [true, 'Please add a testo value']
        },
        inserimentoData: {
            type: Date,
            default: Date.now 
        },
        importo: {
            type: Number,
            require: [true, 'Please add a importo value']
        },
        categoria: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Categoria'
        },
        inserimentoUser: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            email: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('NotaSpese', notaSpeseSchema)