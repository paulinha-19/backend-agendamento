const middlewareValidate = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      // return res.json({ message: 'Successo na validação dos dados', data });
      return next();
    } catch (error) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        name: err.name,
        message: err.message,
        value: err.params.originalValue,
      }));
      return res.status(422).json(errors);
    }
  };
  
  module.exports = middlewareValidate;
  