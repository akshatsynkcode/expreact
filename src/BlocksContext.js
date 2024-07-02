import React, { createContext, useState, useEffect } from 'react';
import { fetchLatestBlock, fetchBlocks, fetchLatestTransactions, fetchExtrinsics, fetchChainData } from './api/substrate';

const BlocksContext = createContext();

const BlocksProvider = ({ children }) => {
  const [blocks, setBlocks] = useState([]);
  const [latestBlock, setLatestBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [extrinsics, setExtrinsics] = useState([]);
  const [chainData, setChainData] = useState({});
  const blocksPerPage = 10;

  useEffect(() => {
    const getLatestBlock = async () => {
      const data = await fetchLatestBlock();
      setLatestBlock(data);
    };
    getLatestBlock();
  }, []);

  useEffect(() => {
    if (latestBlock) {
      const getBlocks = async () => {
        const startBlock = latestBlock ? latestBlock.block.header.number.toNumber() : 0;
        const data = await fetchBlocks(startBlock - (currentPage - 1) * blocksPerPage, blocksPerPage);
        setBlocks(data);
        setLoading(false);
      };
      getBlocks();
    }
  }, [latestBlock, currentPage]);

  useEffect(() => {
    const getLatestTransactions = async () => {
      const data = await fetchLatestTransactions();
      setTransactions(data);
    };
    getLatestTransactions();
  }, []);

  useEffect(() => {
    const getExtrinsics = async () => {
      const data = await fetchExtrinsics();
      setExtrinsics(data);
    };
    getExtrinsics();
  }, []);

  useEffect(() => {
    const getChainData = async () => {
      const data = await fetchChainData();
      setChainData(data);
    };
    getChainData();
  }, []);

  return (
    <BlocksContext.Provider value={{ blocks, loading, currentPage, setCurrentPage, blocksPerPage, transactions, extrinsics, chainData }}>
      {children}
    </BlocksContext.Provider>
  );
};

export { BlocksContext, BlocksProvider };
