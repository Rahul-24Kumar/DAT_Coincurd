const cron = require("node-cron");
const logger = require("../../../logger");
const oneDayModel = require("../../models/historyModel/oneDay");
const currencyModel = require("../../models/currencyModel/cryptocurrency");

const oneDayData = async () => {
  try {
    const currencyData = await currencyModel.find({});

    await oneDayModel.insertMany(currencyData);

    logger.info(`Inserted ${currencyData.length} documents into oneDayModel.`);
  } catch (error) {
    logger.error("Error:", error);
  }
};

cron.schedule("*/5 * * * *", async () => {
  await oneDayData();
  logger.info("oneDay Data Saved");
});

module.exports = { oneDayData };
