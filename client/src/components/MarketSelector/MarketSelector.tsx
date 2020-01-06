import React from 'react';
import { Form } from 'react-bootstrap';

interface MarketSelectorProps {
  onChange: any;
  market: string;
};

const MARKETS = [
  'BTC-ETH',
  'BTC-DOGE',
  'BTC-LTC'
];

const MarketSelector: React.FC<MarketSelectorProps> = ({ onChange, market }: MarketSelectorProps) => (
  <Form>
    <Form.Group controlId="marketSelect">
      <Form.Label>Select Market</Form.Label>
      <Form.Control
        as="select"
        onChange={ onChange }
        select={ market }
      >
        { MARKETS.map((market: string) => (
          <option key={ market }value={ market }>{ market }</option>
        ))}
      </Form.Control>
    </Form.Group>
  </Form>
);

export default MarketSelector;
