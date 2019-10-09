const dataManager = require('./data');

const TIME_FRAME_TIMES = {
  M: 60,
  H: 3600,
  W: 604800,
  MN: 2592000,
};

function floatToInt(number, digits) {
  return Number(parseFloat(`${number}e${digits}`));
}

function intToFloat(number, digits) {
  return parseFloat(`${number}e-${digits}`);
}

function getSymbolPriceDigits(symbolId) {
  return dataManager.getSymbol(symbolId).FractionalDigits;
}

function getSymbolVolumeDigits(symbolId) {
  return dataManager.getSymbol(symbolId).VolumeDigits;
}

function priceToFloat(value, symbolId) {
  return intToFloat(value, getSymbolPriceDigits(symbolId));
}

function priceToInt(value, symbolId) {
  return floatToInt(value, getSymbolPriceDigits(symbolId));
}

function volumeToFloat(value, symbolId) {
  return intToFloat(value, getSymbolVolumeDigits(symbolId));
}

function volumeToInt(value, symbolId) {
  return floatToInt(value, getSymbolVolumeDigits(symbolId));
}

function unpackBar(bar) {
  let [
    Time,
    AskOpen,
    AskHigh,
    AskLow,
    AskClose,
    AskVolume,
    BidOpen,
    BidHigh,
    BidLow,
    BidClose,
    BidVolume,
  ] = bar;

  AskOpen = AskHigh - AskOpen;
  AskLow = AskHigh - AskLow;
  AskClose = AskHigh - AskClose;
  BidOpen = AskHigh - BidOpen;
  BidHigh = AskHigh - BidHigh;
  BidLow = AskHigh - BidLow;
  BidClose = AskHigh - BidClose;

  return {
    Time,
    AskOpen,
    AskHigh,
    AskLow,
    AskClose,
    AskVolume,
    BidOpen,
    BidHigh,
    BidLow,
    BidClose,
    BidVolume,
  };
}

function getTimeFrameParts(timeFrame) {
  const [, type, value] = timeFrame.match(/^([A-Z]+)([0-9]+)$/);
  return { type, value };
}

function getPackageId(time, timeFrame) {
  const parts = getTimeFrameParts(timeFrame);
  return Math.floor(
    time /
      (TIME_FRAME_TIMES[parts.type] *
        parts.value *
        dataManager.getHistoryPackageSize())
  );
}

function getPackageTime(packageId, timeFrame) {
  const parts = getTimeFrameParts(timeFrame);

  return Math.max(
    1,
    packageId *
      (TIME_FRAME_TIMES[parts.type] * parts.value) *
      dataManager.getHistoryPackageSize()
  );
}

module.exports = {
  floatToInt,
  intToFloat,
  priceToFloat,
  priceToInt,
  volumeToFloat,
  volumeToInt,
  getSymbolPriceDigits,
  getSymbolVolumeDigits,
  unpackBar,
  getPackageId,
  getPackageTime,
};
