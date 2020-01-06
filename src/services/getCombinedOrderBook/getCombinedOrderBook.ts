import getPoloniexOrderBook from '../getPoloniexOrderBook';
import getBittrexOrderBook from '../getBittrexOrderBook';
import { PoloniexResponse } from '../../interfaces/poloniex';
import { BittrexResponse, BittrexRecord } from '../../interfaces/bittrex';
import {
  CombinedOrderBookRecord,
  FormattedOrderBookRecord,
  CombinedOrderBookResponse
} from '../../interfaces/CombinedOrderBook';

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

/**
 * The Bittrex API gives us rates as a number, not a string. JavaScript
 * converts these to scientific notation if they are very small (such as with dogecoin)
 * which we have to convert back to a decimal as a string,
 * so we can compare the value to the Poloniex rates.
 */
function convertScientificNotation(number: number): string {
  return number.toFixed(8).replace(/0+$/, '');
}

function getPoloniexCurrencyPair(
  currency1: string,
  currency2: string
): string {
  return `${currency1}_${currency2}`;
}

function getBittrexCurrencyPair(
  currency1: string,
  currency2: string
): string {
  return `${currency1}-${currency2}`;
}

function addPoloniexOrderBook(apiResults: any[], combinedResults: CombinedOrderBookRecord) {
  apiResults.forEach((record: any[]) => {
    combinedResults[record[0]] = {
      poloniexQuantity : record[1],
      bittrexQuantity : 0,
    };
  });
}

function addBittrexOrderBook(apiResults: BittrexRecord[], combinedResults: CombinedOrderBookRecord) {
  apiResults.forEach(({ Rate, Quantity }: BittrexRecord) => {
    let stringPrice = convertScientificNotation(Rate);

    if (!combinedResults[stringPrice]) {
      combinedResults[stringPrice] = {
        poloniexQuantity : 0,
        bittrexQuantity: 0,
      };
    }

    combinedResults[stringPrice].bittrexQuantity = Quantity;
  });
}

export default async function getCombinedOrderBook(
  currency1: string,
  currency2: string
): Promise<CombinedOrderBookResponse> {
  const combinedAsks: CombinedOrderBookRecord = {};
  const combinedBids: CombinedOrderBookRecord = {};

  const poloniexCurrencyPair = getPoloniexCurrencyPair(currency1, currency2);
  const bittrexCurrencyPair = getBittrexCurrencyPair(currency1, currency2);

  const polOrderBook: PoloniexResponse | null =  await getPoloniexOrderBook(poloniexCurrencyPair);

  if (polOrderBook) {
    addPoloniexOrderBook(polOrderBook.asks, combinedAsks);
    addPoloniexOrderBook(polOrderBook.bids, combinedBids);
  }

  const bittrexOrderBook: BittrexResponse | null = await getBittrexOrderBook(bittrexCurrencyPair);

  if (bittrexOrderBook) {
    addBittrexOrderBook(bittrexOrderBook.result.sell, combinedAsks);
    addBittrexOrderBook(bittrexOrderBook.result.buy, combinedBids);
  }

  return {
    asks: formatOrderBook(combinedAsks),
    bids: formatOrderBook(combinedBids),
  };

};
