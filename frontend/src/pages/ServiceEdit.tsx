import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ServiceForm from '../components/ServiceForm';
import { fetchService, updateService } from '../api';
import type { ServiceFormData, Service } from '../types';

const ServiceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [initial, setInitial] = useState<ServiceFormData | null>(null);

  useEffect(() => {
    if (id) {
      fetchService(Number(id)).then((s: Service) => {
        setInitial({
          slug: s.slug,
          name: s.name,
          description: s.description,
          status: s.status === 'archived' ? 'draft' : s.status,
          image: s.image,
        });
      });
    }
  }, [id]);

  const save = async (data: ServiceFormData) => {
    if (id) {
      await updateService(Number(id), data);
      nav(`/services/${id}`);
    }
  };

  if (!initial) return <div className="m-3">Загрузка...</div>;

  return (
    <div className="m-3">
      <h2>Редактирование услуги</h2>
      <ServiceForm initial={initial} onSubmit={save} />
    </div>
  );
};

export default ServiceEdit;
