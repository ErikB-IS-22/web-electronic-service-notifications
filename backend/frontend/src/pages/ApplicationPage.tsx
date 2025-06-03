import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchOne } from '../slices/requestsSlice';
import type { Application } from '../types';

const ApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { current, loadingOne } = useAppSelector((s) => s.requests);

  useEffect(() => {
    if (id) dispatch(fetchOne(Number(id)));
  }, [id, dispatch]);

  if (loadingOne || !current) return <Spinner className="m-3" />;

  return (
    <div className="m-3">
      <h2>Заявка #{current.id} ({current.status})</h2>
      <ul>
      {current.services.map((i) => (
        <li key={i.id}> {/* здесь уже id, а не i.service.id */}
          {i.name} × {i.quantity} {/* здесь также i.name */}
        </li>
      ))}
    </ul>
    </div>
  );
};

export default ApplicationPage;
