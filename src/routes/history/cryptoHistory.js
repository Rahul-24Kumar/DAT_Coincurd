const router = require("express").Router();

const historyControllers = [
  {
    name: "oneDayData",
    controller: require("../../controllers/historyData/oneDay").oneDayData,
  },

  {
    name: "oneWeekData",
    controller: require("../../controllers/historyData/oneWeek").oneWeekData,
  },

  {
    name: "allDayData",
    controller: require("../../controllers/historyData/allDayData").allDayData,
  },
];

historyControllers.forEach(({ name, controller }) => {
  router.post(`/${name}`, controller);
});

module.exports = router;
