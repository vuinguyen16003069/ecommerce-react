const Permission = require('../models/Permission');

exports.getAll = async (req, res) => {
  const permissions = await Permission.find();
  res.json(permissions);
};

exports.getById = async (req, res) => {
  const perm = await Permission.findById(req.params.id);
  if (!perm) return res.status(404).json({ error: 'Quyền không tìm thấy' });
  res.json(perm);
};

exports.create = async (req, res) => {
  const perm = new Permission(req.body);
  await perm.save();
  res.status(201).json(perm);
};

exports.update = async (req, res) => {
  const perm = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(perm);
};

exports.remove = async (req, res) => {
  await Permission.findByIdAndDelete(req.params.id);
  res.json({ message: 'Quyền đã xóa' });
};
