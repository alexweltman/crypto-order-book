import axios from 'axios';

import { PoloniexResponse } from '../interfaces/poloniex';

const POLONIEX_URL = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH';

export default async function getPoloniexOrderBook(): Promise<PoloniexResponse | null> {
  try {
    const response = await axios.get(POLONIEX_URL);

    if (!response || !response.data) {
      throw new Error('Got invalid response from Poloniex');
    }

    return response.data;
  } catch (error) {
    console.error(error);

    return null;
  }
};
