import axios from 'axios';

import { PoloniexResponse } from '../interfaces/poloniex';

const POLONIEX_URL = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=';

export default async function getPoloniexOrderBook(
  currencyPair: string
): Promise<PoloniexResponse | null> {
  try {
    const response = await axios.get(`${POLONIEX_URL}${currencyPair}`);

    if (!response || !response.data) {
      throw new Error('Got invalid response from Poloniex');
    }

    return response.data;
  } catch (error) {
    console.error(error);

    return null;
  }
};
