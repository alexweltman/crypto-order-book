import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [title, setTitle] = useState('Loading');

  useEffect(() => {
    // Create an scoped async function in the hook
    async function anyNameFunction() {
      const resp = await callApi();
      setTitle(resp.express);
    }
    // Execute the created function directly
    anyNameFunction();
  }, []);

  const callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  return (
    <div className="App">
      { title }
    </div>
  );
}

export default App;
