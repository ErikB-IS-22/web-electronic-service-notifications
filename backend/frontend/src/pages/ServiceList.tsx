import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import FilterBar from '../components/FilterBar';
import ServiceCard from '../components/ServiceCard';

import { fetchServices } from '../api';
import type { Service, ServiceListResponse, Filters } from '../types';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [draftId,  setDraftId]  = useState<number | null>(null);
  const [loading,  setLoading]  = useState(false);

  /** загрузка каталога с учётом фильтров */
  const load = async (filters: Filters = {}) => {
    setLoading(true);
    try {
      const data: ServiceListResponse = await fetchServices(filters);
      setDraftId(data.draft_id);
      setServices(data.services);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="m-3">
        <Link to="/services/new" className="btn btn-success">
          Создать услугу
        </Link>
      </div>

      <FilterBar onFilter={load} />

      {loading ? (
        <Spinner className="m-3" />
      ) : (
        <div className="d-flex flex-wrap">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}

      {draftId !== null && (
        <div className="m-3">
          Текущий draft_id: <strong>{draftId}</strong>
        </div>
      )}
    </>
  );
};

export default ServiceList;
