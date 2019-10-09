const data = {};

module.exports = {
  setSymbols(items) {
    data.Symbols = items;
  },
  getSymbol(id) {
    return data.Symbols[id];
  },
  setCurrencies(items) {
    data.Currencies = items;
  },
  getCurrency(id) {
    return data.Currencies[id];
  },
  setHistoryPackageSize(value) {
    data.HistoryPackageSize = value;
  },
  getHistoryPackageSize() {
    return data.HistoryPackageSize;
  },
};
