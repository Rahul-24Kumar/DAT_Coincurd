const cron = require("node-cron");
const logger = require("../../../logger");
const allDayDataModel = require("../../models/historyModel/allDayData");
const currencyModel = require("../../models/currencyModel/cryptocurrency");

const allDayData = async () => {
  try {
    const currencyData = await currencyModel.find({}).select({
      rank: 1,
      coinId: 1,
      uniqueCoinId: 1,
      symbol: 1,
      coinName: 1,
      maxSupply: 1,
      circulatingSupply: 1,
      price: 1,
      totalSupply: 1,
      marketCap: 1,
      volume: 1,
      dbtime: 1,
      _id: 0,
      // __v: 0,
    });

    await allDayDataModel.insertMany(currencyData);

    logger.info(`Inserted ${currencyData.length} documents into oneDayModel.`);
  } catch (error) {
    logger.error("Error:", error);
  }
};

cron.schedule("*/60 * * * *", async () => {
  await allDayData();
  logger.info("all Day Data  Saved");
});

module.exports = { allDayData };
