const cron = require("node-cron");
const logger = require("../../../logger");
const oneWeekModel = require("../../models/historyModel/oneWeek");
const currencyModel = require("../../models/currencyModel/cryptocurrency");

const oneWeekData = async () => {
  try {
    const currencyData = await currencyModel.find({});

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
