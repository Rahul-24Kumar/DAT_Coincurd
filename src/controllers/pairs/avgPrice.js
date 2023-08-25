const logger = require("../../../logger");
const cron = require("node-cron");
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

    let totalPrice = 0;
    let totalVolume = 0;
    let validEntryCount = 0;

    for (const entry of getAvgData) {
      if (
        typeof entry.priceUsd === "number" &&
        !isNaN(entry.priceUsd) &&
        typeof entry.volumeUsd24Hr === "number" &&
        !isNaN(entry.volumeUsd24Hr)
      ) {
        totalPrice += entry.priceUsd;
        totalVolume += entry.volumeUsd24Hr;
        validEntryCount++;
      }
    }

    logger.info(totalVolume);

    let averagePrice = 0;
    if (validEntryCount > 0) {
      averagePrice = totalPrice / validEntryCount;
    }

    const updateCurrency = await currencyModel.findOneAndUpdate(
      {
        uniqueCoinId,
      },
      { $set: { priceUsd: averagePrice, volumeUsd24Hr: totalVolume } },
      { upsert: true, new: true }
    );

    // logger.info(updateCurrency);
    // return res.json({ averagePrice, totalVolume, validEntryCount });

    return res.status(200).send({ message: "sucessful", data: getAvgData });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// cron.schedule("*/5 * * * *", async () => {
//   await getAllPairs();
//   logger.info("updated");
// });

const getAllExchangesCrypto = async (req, res) => {
  try {
    const { uniqueExchangeId } = req.params;

    const getData = await currencyPairs.find({ uniqueExchangeId });

    return res.status(200).send({ message: "successful", data: getData });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const UpdateCurrency = async (req, res) => {
  try {
    const { uniqueCoinId } = req.params;
    const updateFields = req.body;

    let existingAsset = await currencyModel.findOne({ uniqueCoinId });

    if (!existingAsset) {
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
  UpdateCurrency,
  getAllExchangesCrypto,
  UpdateExchangePair,
};
