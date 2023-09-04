const cron = require("node-cron");
const logger = require("../../../logger");
const currencyModel = require("../../models/currency/cryptocurrency");
const currencyPairs = require("../../models/pairModel/currencyPairs");


const addNewPair = async (req, res) => {
  try {
    const addPairInDb = new currencyPairs({ ...req.body });

    if (addPairInDb) {
      await addPairInDb.save();

      return res
        .status(200)
        .send({ status: true, message: "successful", data: addPairInDb });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Admin not found!" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getAllPairs = async (req, res) => {
  try {
    const { uniqueCoinId } = req.params;

    const getAvgData = await currencyPairs.find({ uniqueCoinId });

    if (getAvgData.length === 0) {
      return res
        .status(404)
        .json({ message: "Data not found for the given uniqueCoinId." });
    }

    return res.status(200).send({ message: "sucessful", data: getAvgData });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAllExchangesCrypto = async (req, res) => {
  try {
    const { uniqueExchangeId } = req.params;

    const getData = await currencyPairs.find({ uniqueExchangeId });

    return res.status(200).send({ message: "successful", data: getData });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};



const UpdateExchangePair = async (req, res) => {
  try {
    const { uniqueCoinId } = req.params;

    const { uniqueExchangeId } = req.params;

    const updateFields = req.body;

    let existingAsset = await currencyPairs.find({
      uniqueCoinId,
      uniqueExchangeId,
    });

    if (existingAsset.length === 0) {
      return res.status(404).json({ status: false, message: "Not Found!" });
    } else {
      Object.entries(updateFields).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          existingAsset[key] = value;
        }
      });
    }

    const updatedAssetDoc = await existingAsset.save();

    return res.status(200).json({
      status: true,
      message: "Update successful",
      data: updatedAssetDoc,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  addNewPair,
  getAllPairs,
  
  getAllExchangesCrypto,
  UpdateExchangePair,
};
