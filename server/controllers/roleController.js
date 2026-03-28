const Role = require('../models/Role');

exports.getAll = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};

exports.getById = async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) return res.status(404).json({ error: 'Vai trò không tìm thấy' });
  res.json(role);
};

exports.create = async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.status(201).json(role);
};

exports.update = async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(role);
};

exports.remove = async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: 'Vai trò đã xóa' });
};
