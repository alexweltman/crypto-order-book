import { Router, Request, Response } from 'express';

import getCombinedOrderBook from '../services/getCombinedOrderBook/getCombinedOrderBook';

const routes = Router();

routes.get('/api/orderBook', async (req: Request, res: Response) => {
  const currency1 = req.query.currency1 || 'BTC';
  const currency2 = req.query.currency2 || 'ETH';

  const combinedOrderBook = await getCombinedOrderBook(currency1, currency2);
  res.send(combinedOrderBook);
});

export default routes;
