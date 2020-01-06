import getCombinedOrderBook from './getCombinedOrderBook';
import { PoloniexResponse } from '../../interfaces/poloniex';
import { BittrexResponse } from '../../interfaces/bittrex';
import { CombinedOrderBookResponse } from '../../interfaces/CombinedOrderBook';

jest.mock('../getPoloniexOrderBook', () => jest.fn());
const getPoloniexOrderBook = require('../getPoloniexOrderBook');

jest.mock('../getBittrexOrderBook', () => jest.fn());
const getBittrexOrderBook = require('../getBittrexOrderBook');

describe('Gets the combined order book for Poloniex and Bittrex', () => {
  it('Should return an empty array if both requests fail', async () => {
    getPoloniexOrderBook.mockImplementation(() => null);
    getBittrexOrderBook.mockImplementation(() => null);

    const expectedResponse: any = {
      asks: [],
      bids: []
    };

    const combinedOrderBook = await getCombinedOrderBook('BTC', 'ETH');
    expect(combinedOrderBook).toStrictEqual(expectedResponse);
  });

  it('Should convert scientific notation to a decimal string', async () => {
    const bittrexResponse: BittrexResponse = {
      success: true,
      message: '',
      result: {
        sell: [
          {
            Quantity: 2,
            Rate: 2.9e-7
          },
        ],
        buy: []
      },
    };

    const expectedResult: CombinedOrderBookResponse = {
      asks: [
        {
          price: '0.00000029',
          poloniexQuantity: 0,
          bittrexQuantity: 2,
          combinedQuantity: 2,
        },
      ],
      bids: [],
    };


    getPoloniexOrderBook.mockImplementation(() => null);
    getBittrexOrderBook.mockImplementation(() => bittrexResponse);

    const combinedOrderBook = await getCombinedOrderBook('BTC', 'ETH');;
    expect(combinedOrderBook).toStrictEqual(expectedResult);
  });

  it('Should return just poloniex order book if bittrex request fails', async () => {
    const polResponse: PoloniexResponse = {
      asks: [
        [ '0.1', 2 ],
        [ '0.2', 5 ],
        [ '0.3', 6 ],
      ],
      bids: [
        [ '0.125', 11 ],
        [ '0.225', 3 ],
        [ '0.325', 4 ],
      ],
      isFrozen : 'false',
      seq: 0,
    };

    const expectedResult: CombinedOrderBookResponse = {
      asks: [
        {
          price: '0.1',
          poloniexQuantity: 2,
          bittrexQuantity: 0,
          combinedQuantity: 2,
        },
        {
          price: '0.2',
          poloniexQuantity: 5,
          bittrexQuantity: 0,
          combinedQuantity: 5,
        },
        {
          price: '0.3',
          poloniexQuantity: 6,
          bittrexQuantity: 0,
          combinedQuantity: 6,
        },
      ],
      bids: [
        {
          price: '0.125',
          poloniexQuantity: 11,
          bittrexQuantity: 0,
          combinedQuantity: 11,
        },
        {
          price: '0.225',
          poloniexQuantity: 3,
          bittrexQuantity: 0,
          combinedQuantity: 3,
        },
        {
          price: '0.325',
          poloniexQuantity: 4,
          bittrexQuantity: 0,
          combinedQuantity: 4,
        },
      ],
    };


    getPoloniexOrderBook.mockImplementation(() => polResponse);
    getBittrexOrderBook.mockImplementation(() => null);

    const combinedOrderBook = await getCombinedOrderBook('BTC', 'ETH');;
    expect(combinedOrderBook).toStrictEqual(expectedResult);
  });

  it('Should return just bittrex order book if poloniex request fails', async () => {
    const bittrexResponse: BittrexResponse = {
      success: true,
      message: '',
      result: {
        sell: [
          {
            Quantity: 2,
            Rate: 0.1
          },
          {
            Quantity: 5,
            Rate: 0.2
          },
          {
            Quantity: 6,
            Rate: 0.3
          },
        ],
        buy: [
          {
            Quantity: 11,
            Rate: 0.125
          },
          {
            Quantity: 3,
            Rate: 0.225
          },
          {
            Quantity: 4,
            Rate: 0.325
          },
        ]
      },
    };

    const expectedResult: CombinedOrderBookResponse = {
      asks: [
        {
          price: '0.1',
          poloniexQuantity: 0,
          bittrexQuantity: 2,
          combinedQuantity: 2,
        },
        {
          price: '0.2',
          poloniexQuantity: 0,
          bittrexQuantity: 5,
          combinedQuantity: 5,
        },
        {
          price: '0.3',
          poloniexQuantity: 0,
          bittrexQuantity: 6,
          combinedQuantity: 6,
        },
      ],
      bids: [
        {
          price: '0.125',
          poloniexQuantity: 0,
          bittrexQuantity: 11,
          combinedQuantity: 11,
        },
        {
          price: '0.225',
          poloniexQuantity: 0,
          bittrexQuantity: 3,
          combinedQuantity: 3,
        },
        {
          price: '0.325',
          poloniexQuantity: 0,
          bittrexQuantity: 4,
          combinedQuantity: 4,
        },
      ],
    };


    getPoloniexOrderBook.mockImplementation(() => null);
    getBittrexOrderBook.mockImplementation(() => bittrexResponse);

    const combinedOrderBook = await getCombinedOrderBook('BTC', 'ETH');;
    expect(combinedOrderBook).toStrictEqual(expectedResult);
  });

  it('Should return the combined order book', async () => {
    const polResponse: PoloniexResponse = {
      asks: [
        [ '0.1', 2 ],
        [ '0.2', 5 ],
        [ '0.3', 6 ],
      ],
      bids: [
        [ '0.125', 11 ],
        [ '0.225', 3 ],
        [ '0.325', 4 ],
      ],
      isFrozen : 'false',
      seq: 0,
    };

    const bittrexResponse: BittrexResponse = {
      success: true,
      message: '',
      result: {
        sell: [
          {
            Quantity: 7,
            Rate: 0.1
          },
          {
            Quantity: 1,
            Rate: 0.2
          },
          {
            Quantity: 6,
            Rate: 0.4
          },
        ],
        buy: [
          {
            Quantity: 2,
            Rate: 0.123
          },
          {
            Quantity: 8,
            Rate: 0.225
          },
          {
            Quantity: 5,
            Rate: 0.325
          },
        ]
      },
    };

    const expectedResult: CombinedOrderBookResponse = {
      asks: [
        {
          price: '0.1',
          poloniexQuantity: 2,
          bittrexQuantity: 7,
          combinedQuantity: 9,
        },
        {
          price: '0.2',
          poloniexQuantity: 5,
          bittrexQuantity: 1,
          combinedQuantity: 6,
        },
        {
          price: '0.3',
          poloniexQuantity: 6,
          bittrexQuantity: 0,
          combinedQuantity: 6,
        },
        {
          price: '0.4',
          poloniexQuantity: 0,
          bittrexQuantity: 6,
          combinedQuantity: 6,
        },
      ],
      bids: [
        {
          price: '0.123',
          poloniexQuantity: 0,
          bittrexQuantity: 2,
          combinedQuantity: 2,
        },
        {
          price: '0.125',
          poloniexQuantity: 11,
          bittrexQuantity: 0,
          combinedQuantity: 11,
        },
        {
          price: '0.225',
          poloniexQuantity: 3,
          bittrexQuantity: 8,
          combinedQuantity: 11,
        },
        {
          price: '0.325',
          poloniexQuantity: 4,
          bittrexQuantity: 5,
          combinedQuantity: 9,
        },
      ],
    };


    getPoloniexOrderBook.mockImplementation(() => polResponse);
    getBittrexOrderBook.mockImplementation(() => bittrexResponse);

    const combinedOrderBook = await getCombinedOrderBook('BTC', 'ETH');;
    expect(combinedOrderBook).toStrictEqual(expectedResult);
  });
});
