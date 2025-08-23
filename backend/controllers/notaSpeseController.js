const asyncHandler = require("express-async-handler");
const NotaSpese = require("../model/notaSpeseModel");
const User = require("../model/userModel");
const { removeNotaFromScheda } = require("../controllers/schedaSpeseController")

//@desc get goals
//@route GET /api/goals
//@access Private
const getNotaSpese = asyncHandler(async (req, res) => {
  const goals = await NotaSpese.find({ user: req.user.id });
  res.status(200).json(goals);
});

//@desc set goals
//@route POST /api/goals
//@access Private
const setNotaSpese = asyncHandler(async (req, res) => {
  console.log(req.body, "req.body ------------------- controller");
  
  if (!req.body.testo) {
    // return res.status(400).json({data: "add text in body"}) //soluzione mia con return
    res.status(400);
    throw new Error("add testo in body"); //restituisce l'errore in html per ricevere un json fare middleware
  }
  if (!req.body.importo) {
    res.status(400);
    throw new Error("add importo in body");
  }
  const notaSpese = await NotaSpese.create({
    testo: req.body.testo,
    inserimentoData: req.body.inserimentoData,
    importo: req.body.importo,
    categoria: req.body.categoria,
    user: req.user.id,
    inserimentoUser: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    },
  });

  res.status(200).json(notaSpese);
});

// //@desc update Nota
// //@route PUT/PATCH /api/goals/:id
// //@access Private
const updateNotaSpese = asyncHandler(async (req, res) => {
  const notaSpese = await NotaSpese.findById(req.params.id);

  //check user
  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  //check if user is owner
  if (notaSpese.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  const updatedNotaSpese = await NotaSpese.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedNotaSpese);
});
// //@desc cancel goals
// //@route DELETE /api/goals/:id
// //@access Private
const deleteNotaSpese = asyncHandler(async (req, res) => {
   
  const notaID = req?.params?.id;

  const notaSpese = await NotaSpese.findById(notaID);
  if (!notaSpese) {
    throw new Error("delete notaSpese not found");
  }
  //check user
  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  //check if user is owner
  if (notaSpese.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }


  // await notaSpese.findByIdAndDelete(req.params.id) //soluzione mia al volo rifaccio la query
  await notaSpese.deleteOne(); //remove() is not a function ??
  // res.status(200).json({ id: req.params.id }); //porta in FE solo ID dell'elemento eliminato
  res.status(200).json({ message: "Note succesfull deleted" }); //porta in FE solo ID dell'elemento eliminato
  await removeNotaFromScheda(req.body.schedaId, notaID);
});

// //@access Private
// non controllo quasi nulla perchè viene usata dalla delete della scheda spese
// svuota la relazione tra la scheda e le sue note
const deleteManyNotaSpese = asyncHandler(async (req, res) => {
  const idsToDelete = req.map((nota) => nota.id);
  await NotaSpese.deleteMany({ _id: { $in: idsToDelete } }).catch((error) =>
    console.log(error)
  );
  // res.status(200).json({message: "All user notes deleted"});
});

module.exports = {
  getNotaSpese,
  setNotaSpese,
  updateNotaSpese,
  deleteNotaSpese,
  deleteManyNotaSpese,
};
