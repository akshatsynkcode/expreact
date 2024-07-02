import React, { useContext } from 'react';
import { BlocksContext } from './BlocksContext';
import './ChainData.css';

const ChainData = () => {
  const { chainData } = useContext(BlocksContext);

  return (
    <div className="chain-data">
      <h2>Chain Data</h2>
      <div className="stats">
        <div className="stat">
          <span>Finalized Blocks</span>
          <span>{chainData.finalizedBlocks || 'N/A'}</span>
        </div>
        <div className="stat">
          <span>Signed Extrinsics</span>
          <span>{chainData.signedExtrinsics || 'N/A'}</span>
        </div>
        <div className="stat">
          <span>Staked / Bonded</span>
          <span>{chainData.stakedBonded || 'N/A'}</span>
        </div>
        <div className="stat">
          <span>Holders / Total Accounts</span>
          <span>{chainData.holdersTotalAccounts || 'N/A'}</span>
        </div>
        <div className="stat">
          <span>Transfers</span>
          <span>{chainData.transfers || 'N/A'}</span>
        </div>
        <div className="stat">
          <span>Inflation Rate</span>
          <span>{chainData.inflationRate || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default ChainData;
