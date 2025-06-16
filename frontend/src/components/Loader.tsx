import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useAppSelector } from '../hooks';

/** Центрированный оверлей‑крутилка, если store.ui.loading = true */
const Loader: React.FC = () => {
  const loading = useAppSelector((s) => s.ui.loading);
  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <Spinner animation="border" variant="light" />
    </div>
  );
};
export default Loader;
