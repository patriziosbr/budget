import SchedaSpese from '../models/schedaSpese.model';

export const checkSpesaAccess = (accessType) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const spesaId = req.params.id;

    const spesa = await SchedaSpese.findById(spesaId);
    if (!spesa) return res.status(404).json({ message: 'Scheda non trovata' });

    const isOwner = spesa.user.toString() === userId;
    const isShared = spesa.scheda.condivisoConList.includes(userEmail);

    if (
      (accessType === 'write' && (isOwner || isShared)) ||
      (accessType === 'owner' && isOwner)
    ) {
      req.schedaSpesa = spesa;
      req.isOwner = isOwner;
      return next();
    }

    return res.status(403).json({ message: 'Accesso negato' });
  };
};
