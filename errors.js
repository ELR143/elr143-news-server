exports.pathDoesNotExist = (req, res) => {
  res.status(404).send({ msg: "Error: path does not exist" });
};
