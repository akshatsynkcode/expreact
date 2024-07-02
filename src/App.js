import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BlocksProvider } from './BlocksContext';
import Home from './Home';
import BlockDetails from './BlockDetails';
import ExtrinsicDetails from './ExtrinsicDetails';
import './App.css';

const App = () => (
  <Router>
    <BlocksProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/block/:blockNumber" element={<BlockDetails />} />
          <Route path="/extrinsic/:blockNumber/:extrinsicIndex" element={<ExtrinsicDetails />} />
        </Routes>
      </div>
    </BlocksProvider>
  </Router>
);

export default App;
