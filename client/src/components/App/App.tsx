import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import OrderBook from '../OrderBook/OrderBook';
import './App.css';

const App: React.FC = () => {
  const [asks, setAsks] = useState();
  const [bids, setBids] = useState();
  const [key, setKey] = useState('asks');

  useEffect(() => {
    // Create an scoped async function in the hook
    async function fetchOrders() {
      const resp = await getCombinedOrders();
      if (resp.asks) setAsks(resp.asks);
      if (resp.bids) setBids(resp.bids);
    }
    // Execute the created function directly
    fetchOrders();
  }, []);

  const getCombinedOrders = async () => {
    const response = await fetch('/api/orderBook');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  return (
    <div className="container">
      <h1 className="mt-5 d-flex justify-content-center">Combined Order Book</h1>
			<Tabs
        id="whatever"
				activeKey={key}
				onSelect={ (key: string) => setKey(key)}
			>
				<Tab eventKey="asks" title="Asks">
          <OrderBook
            title="Asks"
            data={ asks }
          />
				</Tab>
				<Tab eventKey="bids" title="Bids">

          <OrderBook
            title="Bids"
            data={ bids }
        />
				</Tab>
			</Tabs>
    </div>
  );
}

export default App;
