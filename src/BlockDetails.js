import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlockByNumber } from './api/substrate';
import './BlockDetails.css';

const BlockDetails = () => {
  const { blockNumber } = useParams();
  const [blockData, setBlockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlockData = async () => {
      try {
        const data = await fetchBlockByNumber(blockNumber);
        if (!data) {
          setError('Block not found');
        } else {
          setBlockData(data);
        }
      } catch (err) {
        setError('Error fetching block data');
      } finally {
        setLoading(false);
      }
    };
    getBlockData();
  }, [blockNumber]);

  if (loading) {
    return <p>Loading block details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!blockData || !blockData.block) {
    return <p>Block data not available</p>;
  }

  const { block } = blockData;
  const header = block.header;

  let timestamp = 'N/A';
  let timestampUTC = 'N/A';

  try {
    if (header.timestamp) {
      timestamp = new Date(header.timestamp).toLocaleString();
      timestampUTC = new Date(header.timestamp).toISOString();
    }
  } catch (error) {
    console.error('Invalid timestamp value:', error);
  }

  const extrinsics = block.extrinsics.map((ext, index) => (
    <li key={index}>
      <pre>{JSON.stringify(ext.toHuman(), null, 2)}</pre>
    </li>
  ));

  const eventsCount = block.extrinsics.length;

  return (
    <div className="block-details">
      <Link to="/" className="back-button">← Blocks</Link>
      <h2>Block #{blockNumber}</h2>
      <table>
        <tbody>
          <tr>
            <th>Timestamp</th>
            <td>{timestamp}</td>
          </tr>
          <tr>
            <th>Timestamp UTC</th>
            <td>{timestampUTC}</td>
          </tr>
          <tr>
            <th>Hash</th>
            <td>{header.hash ? header.hash.toHex() : 'N/A'}</td>
          </tr>
          <tr>
            <th>Parent hash</th>
            <td>{header.parentHash ? header.parentHash.toHex() : 'N/A'}</td>
          </tr>
          <tr>
            <th>State root</th>
            <td>{header.stateRoot ? header.stateRoot.toHex() : 'N/A'}</td>
          </tr>
          <tr>
            <th>Extrinsics root</th>
            <td>{header.extrinsicsRoot ? header.extrinsicsRoot.toHex() : 'N/A'}</td>
          </tr>
          <tr>
            <th>Extrinsics count</th>
            <td>{block.extrinsics.length}</td>
          </tr>
          <tr>
            <th>Events count</th>
            <td>{eventsCount}</td>
          </tr>
          <tr>
            <th>Runtime</th>
            <td>polkadot-1002005</td> {/* Adjust this value if necessary */}
          </tr>
        </tbody>
      </table>
      <h3>Extrinsics</h3>
      <ul>{extrinsics}</ul>
      <p>Awaiting finalization...</p>
    </div>
  );
};

export default BlockDetails;
