import { Router, Request, Response } from 'express';

import getCombinedOrderBook from '../services/getCombinedOrderBook/getCombinedOrderBook';

const routes = Router();

routes.get('/api/orderBook', async (req: Request, res: Response) => {
  const combinedOrderBook = await getCombinedOrderBook();
  res.send(combinedOrderBook);
});

export default routes;
