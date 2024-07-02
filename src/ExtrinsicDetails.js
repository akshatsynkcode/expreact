import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlockByNumber } from './api/substrate';
import './ExtrinsicDetails.css';

const ExtrinsicDetails = () => {
  const { extrinsicIndex, blockNumber } = useParams();
  const [extrinsicData, setExtrinsicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExtrinsicData = async () => {
      try {
        const blockData = await fetchBlockByNumber(blockNumber);
        if (blockData && blockData.block && blockData.block.extrinsics) {
          const extrinsic = blockData.block.extrinsics[extrinsicIndex];
          if (extrinsic) {
            setExtrinsicData(extrinsic);
          } else {
            setError('Extrinsic not found');
          }
        } else {
          setError('Block data not available or state has been discarded');
        }
      } catch (err) {
        setError('Error fetching extrinsic data');
      } finally {
        setLoading(false);
      }
    };
    getExtrinsicData();
  }, [blockNumber, extrinsicIndex]);

  if (loading) {
    return <p>Loading extrinsic details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!extrinsicData) {
    return <p>Extrinsic data not available</p>;
  }

  return (
    <div className="extrinsic-details">
      <Link to="/" className="back-button">← Back to Extrinsics</Link>
      <h2>Extrinsic #{extrinsicIndex} in Block #{blockNumber}</h2>
      <pre>{JSON.stringify(extrinsicData.toHuman(), null, 2)}</pre>
    </div>
  );
};

export default ExtrinsicDetails;
