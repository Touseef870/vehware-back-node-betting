import Model from "../models/index.js";

const getAll = async () => await Model.find();

const addData = (data) => new Model(data).save().then((user) => user.toObject());

const getData = async (id) => await Model.findOne({ userId: id });

const deleteById = async (id) => await Model.findByIdAndDelete(id)

const updateById = async (id, data) => await Model.findByIdAndUpdate(id, data, { new: true });

const getById = async (id) => await Model.findById({ _id: id })

export {
    getAll,
    addData,
    deleteById,
    updateById,
    getById,
    getData
}