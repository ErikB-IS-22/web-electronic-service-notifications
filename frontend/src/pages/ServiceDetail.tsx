// src/pages/ServiceDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchService } from '../api';
import { Service } from '../types';
import { Button } from 'react-bootstrap';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (id) fetchService(Number(id)).then(setService);
  }, [id]);

  if (!service) return <div className="m-3">Загрузка...</div>;

  return (
    <div className="m-3">
      <h2>{service.name}</h2>
      <p>{service.description}</p>
      {service.image && (
        <img
          src={service.image}
          alt={service.name}
          className="img-fluid mb-3"
        />
      )}
      <p>Статус: {service.status}</p>

      {/* Кнопка редактирования */}
      <Link to={`/services/${service.id}/edit`}>
        <Button variant="primary">Редактировать</Button>
      </Link>
    </div>
  );
};

export default ServiceDetail;
