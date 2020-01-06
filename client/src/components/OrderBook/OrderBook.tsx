import React from 'react';

import { FormattedOrderBookRecord } from '../../../../src/interfaces/CombinedOrderBook';

interface OrderBookProps {
  title: string;
  data: FormattedOrderBookRecord[];
  market: string;
};

const OrderBook: React.FC<OrderBookProps> = ({title, data, market}: OrderBookProps) => {
  if (!data) return <span>Loading...</span>;
  if (data && !data.length) return <span>{`Unable to fetch ${title}.`}</span>

  return (
    <div className="border-left border-right border-bottom">
      <h2 className="d-flex justify-content-center">{`${market} ${title}`}</h2>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">Price</th>
            <th scope="col">Poloniex Quantity</th>
            <th scope="col">Bittrex Quantity</th>
            <th scope="col">Combined Quantity</th>
          </tr>
        </thead>
        <tbody>
          { data.map((row: FormattedOrderBookRecord) => (
            <tr key={ row.price }>
              <td>{ row.price }</td>
              <td>{ row.poloniexQuantity }</td>
              <td>{ row.bittrexQuantity }</td>
              <td>{ row.combinedQuantity }</td>
          </tr>
        )) }
        </tbody>
      </table>
    </div>
  );
};

export default OrderBook;
