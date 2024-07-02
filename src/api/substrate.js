import { ApiPromise, WsProvider } from '@polkadot/api';

let api;

const getApi = async () => {
  if (!api) {
    const provider = new WsProvider('wss://blockchain.finloge.com');
    api = await ApiPromise.create({ provider });
  }
  return api;
};

export const fetchLatestBlock = async () => {
  const api = await getApi();
  const latestBlockHash = await api.rpc.chain.getFinalizedHead();
  const latestBlock = await api.rpc.chain.getBlock(latestBlockHash);
  return latestBlock;
};

export const fetchBlocks = async (startBlock, count) => {
  const api = await getApi();
  const blocks = [];
  for (let i = startBlock; i > startBlock - count; i--) {
    try {
      const blockHash = await api.rpc.chain.getBlockHash(i);
      const block = await api.rpc.chain.getBlock(blockHash);
      blocks.push(block);
    } catch (error) {
      console.error(`Error fetching block ${i}:`, error);
      blocks.push(null);  // Insert null for blocks that cannot be fetched
    }
  }
  return blocks;
};

export const fetchLatestTransactions = async () => {
  const api = await getApi();
  const events = await api.query.system.events();
  const transactions = events
    .filter(({ event }) => event.section === 'balances' && event.method === 'Transfer')
    .map(({ event }) => event.data);
  return transactions;
};

export const fetchExtrinsics = async () => {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getFinalizedHead();
  const { block } = await api.rpc.chain.getBlock(blockHash);
  return block.extrinsics;
};

export const fetchChainData = async () => {
  const api = await getApi();
  try {
    const [
      finalizedBlocks,
      signedExtrinsics,
      totalStaked,
      totalBonded,
      totalAccounts,
      transfers,
      inflationRate,
    ] = await Promise.all([
      api.query.system.number().catch(() => null),
      api.rpc.system.accountNextIndex('YOUR_ACCOUNT_ADDRESS').catch(() => null),
      api.query.staking.totalStaked().catch(() => null),
      api.query.staking.totalBonded().catch(() => null),
      api.query.system.accountCount().catch(() => null),
      api.query.balances.totalIssuance().catch(() => null),
      api.query.inflation.annual().catch(() => null),
    ]);

    return {
      finalizedBlocks: finalizedBlocks ? finalizedBlocks.toNumber() : 'N/A',
      signedExtrinsics: signedExtrinsics ? signedExtrinsics.toNumber() : 'N/A',
      stakedBonded: totalStaked && totalBonded ? `${totalStaked.toHuman()} / ${totalBonded.toHuman()}` : 'N/A',
      holdersTotalAccounts: totalAccounts ? `${totalAccounts.toNumber()} / ${totalAccounts.toNumber()}` : 'N/A',
      transfers: transfers ? transfers.toNumber() : 'N/A',
      inflationRate: inflationRate ? `${(inflationRate.toNumber() * 100).toFixed(2)}%` : 'N/A',
    };
  } catch (error) {
    console.error('Error fetching chain data:', error);
    return {
      finalizedBlocks: 'N/A',
      signedExtrinsics: 'N/A',
      stakedBonded: 'N/A',
      holdersTotalAccounts: 'N/A',
      transfers: 'N/A',
      inflationRate: 'N/A',
    };
  }
};

export const fetchBlockByNumber = async (blockNumber) => {
  const api = await getApi();
  try {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const block = await api.rpc.chain.getBlock(blockHash);
    return block;
  } catch (error) {
    if (error.message.includes('State already discarded')) {
      console.error(`Block ${blockNumber} state already discarded`);
    } else {
      console.error('Error fetching block by number:', error);
    }
    throw error;  // Re-throw the error so it can be handled in the component
  }
};
