const cron = require("node-cron");
const logger = require("../../../logger");
const oneWeekModel = require("../../models/historyModel/oneWeek");
const currencyModel = require("../../models/currencyModel/cryptocurrency");

const oneWeekData = async () => {
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

    await oneWeekModel.insertMany(currencyData);

    logger.info(`Inserted ${currencyData.length} documents into oneWeekModel.`);
  } catch (error) {
    logger.error("Error:", error);
  }
};

cron.schedule("*/15 * * * *", async () => {
  await oneWeekData();
  logger.info("oneWeek Data Saved");
});

module.exports = { oneWeekData };
