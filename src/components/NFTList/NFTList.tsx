import React, { FC } from 'react';
import styles from './NFTList.module.css';

interface NFTListProps {}

const NFTList: FC<NFTListProps> = () => (
  <div className={styles.NFTList}>
    NFTList Component
  </div>
);

export default NFTList;
