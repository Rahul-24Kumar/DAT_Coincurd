const axios = require("axios");

const apiCache = {};

async function callAPI(apiEndpoint) {
  const cacheKey = apiEndpoint;

  if (apiCache[cacheKey]) {
    return apiCache[cacheKey];
  }

  try {
    const response = await axios.get(apiEndpoint);
    apiCache[cacheKey] = response.data;
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getBinanceApi() {
  const apiEndepoint = "https://www.binance.com/api/v3/ticker/24hr";
  return callAPI(apiEndepoint);
}

export async function getPoloniexApi() {
  const apiEndepoint = "https://api.poloniex.com/markets";
  return callAPI(apiEndepoint);
}

export async function getHuobiApi() {
  const apiEndepoint = "https://api.huobi.pro/market/tickers";
  return callAPI(apiEndepoint);
}

export async function getBitstampApi() {
  const apiEndepoint = "https://www.bitstamp.net/api/v2/ticker/";
  return callAPI(apiEndepoint);
}

export async function getDexTradeApi() {
  const apiEndepoint = "https://api.dex-trade.com/v1/public/tickers";
  return callAPI(apiEndepoint);
}

export async function getBybitApi() {
  const apiEndepoint = "https://api-testnet.bybit.com/v2/public/tickers";
  return callAPI(apiEndepoint);
}

export async function getKucoinApi() {
  const apiEndepoint = "https://api.kucoin.com/api/v1/market/allTickers";
  return callAPI(apiEndepoint);
}

export async function getOkxApi() {
  const apiEndepoint =
    "https://www.okx.com/api/v5/market/tickers?instType=SWAP";
  return callAPI(apiEndepoint);
}

// const poloniexApi = axios.get("https://api.poloniex.com/markets");
// const huobiApi = axios.get("https://api.huobi.pro/market/tickers");
// const bitstampApi = axios.get("https://www.bitstamp.net/api/v2/ticker/");
// const binanceApi = axios.get("https://www.binance.com/api/v3/ticker/24hr");
// const dexTradeApi = axios.get("https://api.dex-trade.com/v1/public/tickers");
// const bybitApi = axios.get("https://api-testnet.bybit.com/v2/public/tickers");
// const kucoinApi = axios.get("https://api.kucoin.com/api/v1/market/allTickers");

// const okxApi = axios.get(
//   "https://www.okx.com/api/v5/market/tickers?instType=SWAP"
// );
