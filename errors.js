exports.handleCustomErrors = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "Error: 400 bad request" }).next(err);
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.pathDoesNotExist = (req, res) => {
  res.status(404).send({ msg: "Error: 404 not found" });
};
