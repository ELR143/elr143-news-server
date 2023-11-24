exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Error: 400 bad request" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.pathDoesNotExist = (req, res) => {
  res.status(404).send({ msg: "Error: 404 not found" }).next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(500).send({ msg: "Error: internal server error" });
  }
};
