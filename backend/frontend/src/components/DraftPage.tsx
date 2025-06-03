import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchDraft, confirmDraft } from '../slices/draftSlice';
import type { DraftState } from '../types';

const DraftPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, draftId } = useAppSelector(
    (state) => state.draft as DraftState
  );

  useEffect(() => {
    dispatch(fetchDraft());
  }, [dispatch]);

  if (loading) return <div className="m-3">Загрузка…</div>;
  if (items.length === 0)
    return <div className="m-3">Черновик пуст</div>;

  const handleConfirm = () => dispatch(confirmDraft(draftId));

  return (
    <div className="m-3">
      <h2>Черновик заявки {draftId ? `#${draftId}` : '(ещё не сохранён)'}</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Услуга</th>
            <th>Кол‑во</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, service, quantity }) => (
            <tr key={id}>
              <td>{service.name}</td>
              <td>{quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success" onClick={handleConfirm}>
        Подтвердить заявку
      </Button>
    </div>
  );
};

export default DraftPage;
