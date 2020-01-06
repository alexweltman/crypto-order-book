import axios from 'axios';

import { BittrexResponse } from '../interfaces/bittrex';

const BITTREX_URL = 'https://api.bittrex.com/api/v1.1/public/getorderbook?market=';
const BITTREX_SUFFIX = '&type=both';

export default async function getPoloniexOrderBook(
  market: string
): Promise<BittrexResponse | null> {
  const url = `${BITTREX_URL}${market}${BITTREX_SUFFIX}`;

  try {
    const response = await axios.get(url);

    if (!response || !response.data || !response.data.success) {
      throw new Error('Got invalid response from Bittrex');
    }

    return response.data;
  } catch (error) {
    console.error(error);

    return null;
  }
};
