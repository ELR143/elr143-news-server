exports.handleCustomErrors = (err, req, res, next) => {
  res.status(400).send({ msg: "Error: 400 bad request" }).next(err);
};

exports.pathDoesNotExist = (req, res) => {
  res.status(404).send({ msg: "Error: 404 not found" });
};
