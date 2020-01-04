import { Router } from 'express';

import orderBook from './orderBook';

const routes = Router();

routes.use(orderBook);

export default routes;
