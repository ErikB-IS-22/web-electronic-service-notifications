import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import FilterBar from '../components/FilterBar';          // если хотите поиск по статусу
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchRequests } from '../slices/requestsSlice';
import type { Application } from '../types';

const RequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.requests);

  useEffect(() => { dispatch(fetchRequests()); }, [dispatch]);

  if (loading) return <Spinner className="m-3" />;
  if (items.length === 0) return <div className="m-3">Заявок пока нет.</div>;

  return (
    <div className="m-3">
      <h2>Мои заявки</h2>

      {/* необязательно: добавьте поиск по статусу или дате */}
      {/* <FilterBar onFilter={...} /> */}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Статус</th>
            <th>Создана</th>
            <th>Услуг</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r: Application) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.status}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.services.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RequestsPage;
