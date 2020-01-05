import axios from 'axios';

import { BittrexResponse } from '../interfaces/bittrex';

const BITTREX_URL = 'https://api.bittrex.com/api/v1.1/public/getorderbook?market=BTC-ETH&type=both';

export default async function getPoloniexOrderBook(): Promise<BittrexResponse | null> {
  try {
    const response = await axios.get(BITTREX_URL);

    if (!response || !response.data || !response.data.success) {
      throw new Error('Got invalid response from Bittrex');
    }

    return response.data;
  } catch (error) {
    console.error(error);

    return null;
  }
};
