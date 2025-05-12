const mongoose = require('mongoose')
const schedaSpeseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    titolo: {
      type: String,
      required: [true, 'Please add a titolo value'],
    },
    inserimentoData: {
      type: Date,
      default: Date.now,
    },
    notaSpese: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotaSpese',
      },
    ],
    condivisoConList: [
      {
        email: {
          type: String,
          required: true,
          validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: (props) => `${props.value} non è un'email valida!`,
          },
        },
        role: {
          type: String,
          enum: ['write'],
          default: 'write',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)
module.exports = mongoose.model('SchedaSpese', schedaSpeseSchema)