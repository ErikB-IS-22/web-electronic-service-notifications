import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceForm from '../components/ServiceForm';
import { createService } from '../api';
import type { ServiceFormData } from '../types';

const ServiceCreate: React.FC = () => {
  const nav = useNavigate();

  const save = async (data: ServiceFormData) => {
    await createService(data);
    nav('/');
  };

  return (
    <div className="m-3">
      <h2>Новая услуга</h2>
      <ServiceForm onSubmit={save} />
    </div>
  );
};

export default ServiceCreate;
