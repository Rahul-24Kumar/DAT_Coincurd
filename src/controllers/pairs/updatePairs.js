const cron = require("node-cron");
const logger = require("../../../logger");
const currencyModel = require("../../models/currency/cryptocurrency");
const currencyPairs = require("../../models/pairModel/currencyPairs");

const updateAutomatically = async () => {
  try {
    const getAllPairs = await currencyPairs.find({});

    const coinIdDataMap = new Map();

    for (const entry of getAllPairs) {
      const price = parseFloat(entry.price);
      const volume = parseFloat(entry.volume);

      if (!isNaN(price) && !isNaN(volume)) {
        if (!coinIdDataMap.has(entry.uniqueCoinId)) {
          coinIdDataMap.set(entry.uniqueCoinId, {
            totalPrice: 0,
            totalVolume: 0,
            validEntryCount: 0,
          });
        }

        const coinData = coinIdDataMap.get(entry.uniqueCoinId);
        coinData.totalPrice += price;
        coinData.totalVolume += volume;
        coinData.validEntryCount++;
      }
    }

    const updatedCurrencies = [];

    for (const [uniqueCoinId, coinData] of coinIdDataMap.entries()) {
      const averagePrice = coinData.totalPrice / coinData.validEntryCount;
      const marketCap = averagePrice * getAllPairs[0].circulatingSupply;

      const updateCurrency = await currencyModel.findOneAndUpdate(
        { uniqueCoinId },
        {
          $set: {
            price: averagePrice,
            volume: coinData.totalVolume,
            marketCap: marketCap,
          },
        },
        { upsert: true, new: true }
      );

      updatedCurrencies.push(updateCurrency);
    }
  } catch (error) {
    logger.error(error.message);
  }
};

cron.schedule("*/2 * * * *", async () => {
  logger.info("updating pairs");
  await updateAutomatically();
});
