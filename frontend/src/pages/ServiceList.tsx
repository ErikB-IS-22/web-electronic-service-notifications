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

  const mockServices: Service[] = [
  {
    id: 1,
    name: 'Онлайн-платформа для художников',
    slug: 'onlajn-platforma-dlya-hudozhnikov',
    description: 'Уведомления о новых заказах, отзывах на работы, а также о предстоящих конкурсах и акциях.',
    status: 'active',
    image: ''
  },
  {
    id: 2,
    name: 'Магазин художественных материалов',
    slug: 'magazin-hudozhestvennyh-materialov',
    description: 'Уведомления о поступлении новых товаров, скидках и акциях на краски, холсты и другие материалы.',
    status: 'active',
    image: ''
  },
  {
    id: 3,
    name: 'Фонд поддержки молодых художников',
    slug: 'fond-podderzhki-molodyh-hudozhnikov',
    description: 'Уведомления о грантах, стипендиях и возможностях участия в программах поддержки.',
    status: 'active',
    image: ''
  }
];

    /** загрузка каталога с учётом фильтров */
  const load = async (filters: Filters = {}) => {
    setLoading(true);
    
    try {
      const data: ServiceListResponse = await fetchServices(filters);
      
      // Если сервер вернул пустой массив услуг - используем моки
      if (data.services && data.services.length === 0) {
        setServices(mockServices);
      } else {
        setServices(data.services);
        setDraftId(data.draft_id);
      }
    } catch (err) {
      // В случае ошибки запроса также используем моки
      setServices(mockServices);
      console.error('Ошибка загрузки услуг:', err);
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
