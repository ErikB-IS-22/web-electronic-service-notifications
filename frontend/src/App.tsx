// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchProfile } from './slices/authSlice';

import Navbar from './components/Navbar';
import ServiceList from './pages/ServiceList';
import ServiceDetail from './pages/ServiceDetail';
import ServiceCreate from './pages/ServiceCreate';
import ServiceEdit from './pages/ServiceEdit';
import DraftPage from './pages/DraftPage';
import RequestsPage from './pages/RequestsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) return <div className="m-3">Загрузка…</div>;

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ServiceList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/services/:id/edit" element={
          user?.is_staff ? <ServiceEdit /> : <Navigate to="/" />
        } />
        <Route path="/services/new" element={
          user?.is_staff ? <ServiceCreate /> : <Navigate to="/" />
        } />
        <Route path="/draft" element={
          user ? <DraftPage /> : <Navigate to="/login" />
        } />
        <Route path="/requests" element={
          user ? <RequestsPage /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
