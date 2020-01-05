import { Request } from 'express';

import getPoloniexOrderBook from '../getPoloniexOrderBook';
import getBittrexOrderBook from '../getBittrexOrderBook';
import { PoloniexResponse, PoloniexRecord } from '../../interfaces/poloniex';
import { BittrexResponse, BittrexRecord } from '../../interfaces/bittrex';
import { CombinedOrderBookRecord, FormattedOrderBookRecord, CombinedOrderBookResponse } from '../../interfaces/CombinedOrderBook';

function formatOrderBook(orderBook: CombinedOrderBookRecord): FormattedOrderBookRecord[] {
  const formattedOrderBook: FormattedOrderBookRecord[] = [];

  Object.keys(orderBook).forEach((price: string) => {
    const record = orderBook[price];
    const { poloniexQuantity, bittrexQuantity } = record;
    const combinedQuantity = poloniexQuantity + bittrexQuantity;

    formattedOrderBook.push({
      price,
      poloniexQuantity,
      bittrexQuantity,
      combinedQuantity,
    })
  });

  return formattedOrderBook.sort((a, b) =>  parseFloat(a.price) - parseFloat(b.price));
}

export default async function getCombinedOrderBook(): Promise<CombinedOrderBookResponse> {
  const combinedAsks: CombinedOrderBookRecord = {};
  const combinedBids: CombinedOrderBookRecord = {};

  const polOrderBook: PoloniexResponse | null =  await getPoloniexOrderBook();

  if (polOrderBook) {
    polOrderBook.asks.forEach((record: any[]) => {
      combinedAsks[record[0]] = {
        poloniexQuantity : record[1],
        bittrexQuantity : 0,
      };
    });

    polOrderBook.bids.forEach((record: any[]) => {
      combinedBids[record[0]] = {
        poloniexQuantity : record[1],
        bittrexQuantity : 0,
      };
    });
  }

  const bittrexOrderBook: BittrexResponse | null = await getBittrexOrderBook();
  if (bittrexOrderBook) {
    bittrexOrderBook.result.sell.forEach(({ Rate, Quantity }: BittrexRecord) => {
      let stringPrice = Rate.toString();

      if (!combinedAsks[stringPrice]) {
        combinedAsks[stringPrice] = {
          poloniexQuantity : 0,
          bittrexQuantity: 0,
        };
      }

      combinedAsks[stringPrice].bittrexQuantity = Quantity;
    });

    bittrexOrderBook.result.buy.forEach(({ Rate, Quantity }: BittrexRecord) => {
      let stringPrice = Rate.toString();
      if (!combinedBids[stringPrice]) {
        combinedBids[stringPrice] = {
          poloniexQuantity : 0,
          bittrexQuantity: 0,
        };
      }

      combinedBids[stringPrice].bittrexQuantity = Quantity;
    });
  }

  return {
    asks: formatOrderBook(combinedAsks),
    bids: formatOrderBook(combinedBids),
  };

};
