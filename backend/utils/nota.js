const NotaSpese = require("../model/notaSpeseModel");

const deleteManyNotaSpese = async (notaObjData) => {
  const idsToDelete = notaObjData.map((nota) => nota.id);
  await NotaSpese.deleteMany({ _id: { $in: idsToDelete } }).catch((error) =>
    console.log(error)
  );
};

module.exports = { deleteManyNotaSpese };