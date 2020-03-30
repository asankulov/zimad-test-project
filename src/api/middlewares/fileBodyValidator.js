module.exports = (req, res, next) => {
  if (req.file === undefined) {
    return res.status(400).json({
      errors: [
        {
          file: "Missed file",
        },
      ],
    });
  }
  next();
};
