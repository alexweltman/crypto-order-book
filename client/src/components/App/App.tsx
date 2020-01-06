import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import OrderBook from '../OrderBook/OrderBook';
import MarketSelector from '../MarketSelector/MarketSelector';

const App: React.FC = () => {
  const [asks, setAsks] = useState();
  const [bids, setBids] = useState();
  const [key, setKey] = useState('asks');
  const [market, setMarket] = useState('BTC-ETH');

  useEffect(() => {
    async function getCombinedOrders () {
      const currencies = market.split('-');
      const url = `/api/orderBook?currency1=${currencies[0]}&currency2=${currencies[1]}`;

      const response = await fetch(url);
      const body = await response.json();
      if (response.status !== 200) {
        return {
          asks: [],
          bids: [],
        };
      }

      return body;
    };

    async function fetchOrders() {
      const resp = await getCombinedOrders();
      if (resp.asks) setAsks(resp.asks);
      if (resp.bids) setBids(resp.bids);
    }

    fetchOrders();
  }, [market]);


  const selectorOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const market = e.currentTarget.value;
    setAsks(null);
    setBids(null);
    setMarket(market);
  }

  return (
    <div className="container">
      <h1 className="mt-5 d-flex justify-content-center">Combined Order Book</h1>
      <span className="mt-3 d-flex justify-content-center">
        <MarketSelector
          onChange={ selectorOnChange }
          market={ market }
        />
      </span>
			<Tabs
        id="tabs"
				activeKey={key}
				onSelect={ (key: string) => setKey(key)}
			>
				<Tab eventKey="asks" title="Asks">
          <OrderBook
            title="Asks"
            data={ asks }
            market={ market }
          />
				</Tab>
				<Tab eventKey="bids" title="Bids">
          <OrderBook
            title="Bids"
            data={ bids }
            market={ market }
        />
				</Tab>
			</Tabs>
    </div>
  );
}

export default App;
