import axios from 'axios';

import { PoloniexResponse } from '../interfaces/poloniex';

const POLONIEX_URL = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH';

export default async function getPoloniexOrderBook(depth?: number): Promise<PoloniexResponse | null> {
  const url = depth ? POLONIEX_URL + `&depth=${depth}` : POLONIEX_URL;

  try {
    const response = await axios.get(url);

    if (!response || !response.data) {
      throw new Error('Got invalid response from Poloniex');
    }

    return response.data;
  } catch (error) {
    console.error(error);

    return null;
  }
};
