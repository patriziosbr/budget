const asyncHandler = require("express-async-handler");
const SchedaSpese = require("../model/schedaSpeseModel");
const User = require("../model/userModel");
const NotaSpese = require("../model/notaSpeseModel");
// const nodemailer = require("nodemailer");
const { Types } = require("mongoose");
const ObjectId = Types.ObjectId;
const { all } = require("axios");
const baseUrl = "https://budget-fe.onrender.com/";
const {
  condivisioneSchedaSpese,
  rimossoSchedaSpese,
} = require("../utils/mailTemplate/condivisioneSchedaSpese");
const { deleteManyNotaSpese } = require("../utils/nota");
const Categoria = require("../model/CategoriaModel");

//@desc get goals
//@route GET /api/goals
//@access Private
const singleSchedaSpeseGet = asyncHandler(async (req, res) => {
  const { schedaId, orderKind, orderState } = req.query;
  const id = req.params.id || schedaId; // fallback for param or query

  const schedaSpese = await SchedaSpese.findById(id);

  const noteSpeseResolved = await Promise.all(
    schedaSpese.notaSpese.map((notaId) => NotaSpese.findById(notaId))
  );

  const categoryIds = [
    ...new Set(noteSpeseResolved.map((nota) => nota.categoria).filter(Boolean)),
  ];
  const categories = await Categoria.find({ _id: { $in: categoryIds } });
  const categoryMap = {};
  categories.forEach((cat) => {
    categoryMap[cat._id.toString()] = cat.name;
  });

  // Default: sort by date
  let sortedNotes = noteSpeseResolved;

  if (orderKind && orderState) {
    if (orderKind === "dateOrder") {
      sortedNotes = noteSpeseResolved.sort((a, b) =>
        orderState === "asc"
          ? new Date(a?.inserimentoData) - new Date(b?.inserimentoData)
          : new Date(b?.inserimentoData) - new Date(a?.inserimentoData)
      );
    } else if (orderKind === "priceOrder") {
      sortedNotes = noteSpeseResolved.sort((a, b) =>
        orderState === "asc" ? a.importo - b.importo : b.importo - a.importo
      );
    } else if (orderKind === "userOrder") {
      sortedNotes = noteSpeseResolved.sort((a, b) =>
        orderState === "asc"
          ? (a.inserimentoUser?.name || "").localeCompare(
              b.inserimentoUser?.name || ""
            )
          : (b.inserimentoUser?.name || "").localeCompare(
              a.inserimentoUser?.name || ""
            )
      );
    } else if (orderKind === "categoryOrder") {
      sortedNotes = noteSpeseResolved.sort((a, b) => {
        const aCatName = categoryMap[a.categoria?.toString()] || "";
        const bCatName = categoryMap[b.categoria?.toString()] || "";
        return orderState === "asc"
          ? aCatName.localeCompare(bCatName)
          : bCatName.localeCompare(aCatName);
      });
    }
  } else {
    // Default sort by date desc
    sortedNotes = noteSpeseResolved.sort(
      (a, b) => new Date(b?.inserimentoData) - new Date(a?.inserimentoData)
    );
  }

  schedaSpese.notaSpese = sortedNotes;

  res.status(200).json(schedaSpese);
});

//@desc get goals
//@route GET /api/goals
//@access Private
const getSchedaSpese = asyncHandler(async (req, res) => {
  // Find all schedaSpese for the current user
  const schedaSpese = await SchedaSpese.find({ user: req.user.id });
  const allSchedaSpese = await SchedaSpese.find();
  const user = await User.findById(req.user.id);

  //add la gli utenti condivisi alla schedaSpese
  allSchedaSpese.forEach((scheda) => {
    scheda.condivisoConList.forEach((sharedUser) => {
      if (sharedUser.email === user.email) {
        schedaSpese.push(scheda);
      }
    });
  });

  // Map over each scheda and resolve the promises for each notaSpese
  const schedaSpeseWithNota = await Promise.all(
    schedaSpese.map(async (scheda) => {
      // Resolve all the NotaSpese promises for the current scheda
      const notaSpeseResolved = await Promise.all(
        scheda.notaSpese.map((notaId) => {
          return NotaSpese.findById(notaId);
        })
      );
      // You might want to attach the resolved notaSpese to the scheda
      notaSpeseResolved.sort(
        (a, b) => new Date(b?.inserimentoData) - new Date(a?.inserimentoData)
      );
      // Replace nulls with a mock object
      const notaSpeseWithMock = notaSpeseResolved.map((nota, idx) => {
        if (nota === null) {
          // You can customize the mock as needed
          return {
            _id: scheda.notaSpese[idx],
            testo: null,
            importo: 0,
            categoria_id: null,
            inserimentoData: null,
            user: null,
            deleted: true,
          };
        }
        return nota;
      });
      // if (notaSpeseResolved.length > 5) {
      //     // notaSpeseResolved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // da fare chiamata per ordinamento
      //     notaSpeseResolved.splice(5, Infinity);
      // }

      return { ...scheda.toObject(), notaSpese: notaSpeseWithMock };
    })
  );

  // Sort by createdAt descending (newest first)
  schedaSpeseWithNota.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json(schedaSpeseWithNota);

  //sort standard
  // res.status(200).json(schedaSpeseWithNota.reverse());
});

//@desc set schedaSpese
//@route POST /api/schedaSpese
//@access Private
const setSchedaSpese = asyncHandler(async (req, res) => {
  if (!req.body.titolo) {
    res.status(400);
    throw new Error("add titolo in body"); //restituisce l'errore in html per ricevere un json fare middleware
  }

  const notaSpese = await SchedaSpese.create({
    titolo: req.body.titolo,
    inserimentoData: req.body.inserimentoData,
    notaSpese: req.body.notaSpese,
    condivisoConList: req.body.condivisoConList,
    user: req.user.id,
  });

  const emailList = req.body.condivisoConList.map((email) => email.email);
  if (req.body.condivisoConList.length > 0) {
    condivisioneSchedaSpese(req, User, emailList, baseUrl);
  }

  res.status(200).json(notaSpese);
});

// //@desc update schedaSpese
// //@route PUT/PATCH /api/goals/:id
// //@access Private
const updateSchedaSpese = asyncHandler(async (req, res) => {
  const {
    notaSpese,
    titolo,
    condivisoConList = [],
    removedEmails = [],
  } = req.body;
  const schedaId = req.params.id;

  // Find the schedaSpese by ID
  const scheda = await SchedaSpese.findById(schedaId);
  if (!scheda) {
    res.status(404);
    throw new Error("Scheda not found");
  }

  // Check if user exists
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Check if the user is the owner or has write access
  const isOwner = scheda.user.toString() === req.user.id;
  const isSharedUser = scheda.condivisoConList?.some(
    (entry) => entry.email === req.user.email && entry.role === "write"
  );
  if (!isOwner && !isSharedUser) {
    res.status(403);
    throw new Error("User not authorized");
  }

  // 1. Remove emails if needed
  if (removedEmails.length > 0) {
    const removedIds = removedEmails.map((e) => e.mailId);
    const removedEmailsClean = removedEmails.map((e) => e.email);
    await SchedaSpese.updateOne(
      { _id: schedaId },
      {
        $pull: {
          condivisoConList: {
            _id: { $in: removedIds.map((id) => new ObjectId(id)) },
          },
        },
      }
    );
    await rimossoSchedaSpese(req, User, removedEmailsClean);
  }

  // 2. Build update object for additions/updates
  const updateFields = {};
  if (notaSpese) {
    updateFields.$push = { notaSpese };
  }
  if (titolo) {
    updateFields.$set = { titolo };
  }
  if (condivisoConList.length > 0) {
    updateFields.$push = updateFields.$push || {};
    updateFields.$push.condivisoConList = { $each: condivisoConList };
    await condivisioneSchedaSpese(req, User, condivisoConList, baseUrl);
  }

  // 3. Apply additions/updates if any
  let updatedScheda = null;
  if (Object.keys(updateFields).length > 0) {
    updatedScheda = await SchedaSpese.findByIdAndUpdate(
      schedaId,
      updateFields,
      { new: true, runValidators: true }
    );
  } else {
    updatedScheda = await SchedaSpese.findById(schedaId);
  }

  res.status(200).json(updatedScheda);
});

//@ remove nota from scheda
const removeNotaFromScheda = asyncHandler(async (schedaId, notaId) => {
  await SchedaSpese.updateOne(
    { _id: schedaId },
    { $pull: { notaSpese: notaId } }
  );
});
// //@desc cancel SchedaSpese
// //@route DELETE /api/schedaSpese/:id
// //@access Private
const deleteSchedaSpese = asyncHandler(async (req, res) => {
  let schedaSpese = null;
  if (req.params.id) {
    schedaSpese = await SchedaSpese.findById(req.params.id);
  }
  if (!schedaSpese) {
    throw new Error("scheda not found");
  }
  //check user
  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  //check if user is owner
  if (schedaSpese.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  const notaObjData = [];
  schedaSpese.notaSpese.map((notaId) => {
    notaObjData.push({ id: notaId.toString(), user: req.user });
  });

  await deleteManyNotaSpese(notaObjData);

  await schedaSpese.deleteOne(); //remove() is not a function ??

  res.status(200).json({ message: "List deleted" });
});

module.exports = {
  singleSchedaSpeseGet,
  getSchedaSpese,
  setSchedaSpese,
  updateSchedaSpese,
  deleteSchedaSpese,
  removeNotaFromScheda,
};
