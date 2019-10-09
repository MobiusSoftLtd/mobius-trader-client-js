const dataManager = require('./lib/data');
const apiClient = require('./lib/api');
const { priceToFloat, getPackageId, unpackBar } = require('./lib/convert');
const config = require('./config');

(async () => {
  // MT7 API client
  const socket = await apiClient(config);

  // Event: init
  socket.on('init', data => {
    dataManager.setSymbols(data.Symbols);
    dataManager.setCurrencies(data.Currencies);
    dataManager.setHistoryPackageSize(data.HistoryPackageSize);

    // Subscribe to new ticks
    socket.emit('SubscribeQuote', {
      Symbols: [1],
    });

    // Trying to get quotes history
    socket.emit(
      'QuotesHistory',
      {
        SymbolId: 1,
        TimeFrame: 'M1',
        PackageId: getPackageId(Math.floor(Date.now() / 1000), 'M1'),
      },
      (error, bars) => {
        console.log(error, bars.map(unpackBar));
      }
    );
  });

  // Event: NotifyQuote
  socket.on('NotifyQuote', quotes => {
    for (const [symbolId, time, ask, bid] of quotes) {
      const symbol = dataManager.getSymbol(symbolId);
      console.log(
        'Quote',
        symbol.Name,
        time,
        priceToFloat(ask, symbolId),
        priceToFloat(bid, symbolId)
      );
    }
  });
})();
