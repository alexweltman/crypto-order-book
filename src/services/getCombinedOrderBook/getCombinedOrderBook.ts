import { Request } from 'express';

import getPoloniexOrderBook from '../getPoloniexOrderBook';

export default async function getCombinedOrderBook(req: Request): Promise<any | null> {
  const size = req.query.size;

  return await getPoloniexOrderBook(size);
};
