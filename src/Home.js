import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlocksContext } from './BlocksContext';
import ChainData from './ChainData';
import './Home.css';

const Home = () => {
  const { blocks, loading, currentPage, setCurrentPage, transactions, extrinsics } = useContext(BlocksContext);
  const [activeTab, setActiveTab] = useState('blocks');

  const renderBlockRow = (block, index) => {
    if (!block || !block.block || !block.block.header) {
      return <tr key={index}><td colSpan="5">Error fetching block data</td></tr>;
    }

    const blockNumber = block.block.header.number.toNumber();
    const blockHash = block.block.header.hash.toHex();
    const extrinsicsCount = block.block.extrinsics.length;
    const eventsCount = block.block.extrinsics.length; // Placeholder, adjust according to actual events data
    const time = new Date(block.block.header.timestamp).toLocaleString();

    return (
      <tr key={index}>
        <td><Link to={`/block/${blockNumber}`}>{blockNumber}</Link></td>
        <td>{time}</td>
        <td>{blockHash}</td>
        <td>{extrinsicsCount}</td>
        <td>{eventsCount}</td>
      </tr>
    );
  };

  const renderTransactionRow = (tx, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td><pre>{JSON.stringify(tx.toHuman(), null, 2)}</pre></td>
    </tr>
  );

  const renderExtrinsicRow = (ext, index) => (
    <tr key={index}>
      <td><Link to={`/extrinsic/${index}`}>{index + 1}</Link></td>
      <td><pre>{JSON.stringify(ext.toHuman(), null, 2)}</pre></td>
    </tr>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Substrate Explorer</h1>
      <ChainData />
      <div className="tabs">
        <button className={activeTab === 'blocks' ? 'active' : ''} onClick={() => setActiveTab('blocks')}>Blocks</button>
        <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>Transactions</button>
        <button className={activeTab === 'extrinsics' ? 'active' : ''} onClick={() => setActiveTab('extrinsics')}>Extrinsics</button>
      </div>
      {activeTab === 'blocks' && (
        <div>
          <h2>Blocks</h2>
          {blocks.length > 0 ? (
            <div>
              <table className="blocks-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Time</th>
                    <th>Hash</th>
                    <th>Extrinsics</th>
                    <th>Events</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((block, index) => renderBlockRow(block, index))}
                </tbody>
              </table>
              <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={() => setCurrentPage(prev => prev + 1)}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>No blocks available</p>
          )}
        </div>
      )}
      {activeTab === 'transactions' && (
        <div>
          <h2>Transactions</h2>
          {transactions.length > 0 ? (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => renderTransactionRow(tx, index))}
              </tbody>
            </table>
          ) : (
            <p>No transactions available</p>
          )}
        </div>
      )}
      {activeTab === 'extrinsics' && (
        <div>
          <h2>Extrinsics</h2>
          {extrinsics.length > 0 ? (
            <table className="extrinsics-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {extrinsics.map((ext, index) => renderExtrinsicRow(ext, index))}
              </tbody>
            </table>
          ) : (
            <p>No extrinsics available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
