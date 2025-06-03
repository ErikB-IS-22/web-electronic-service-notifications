import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAppDispatch } from '../hooks';
import { setFilters } from '../slices/filterSlice';
import type { Filters } from '../types';

/** необязательный проп onFilter — callback для ServiceList / RequestsPage */
interface Props {
  onFilter?: (f: Filters) => void;
}

const FilterBar: React.FC<Props> = ({ onFilter }) => {
  const [q, setQ] = useState('');
  const dispatch = useAppDispatch();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const flt: Filters = { q };
    dispatch(setFilters(flt));   // сохраняем в Redux (если нужно)
    onFilter?.(flt);             // уведомляем родителя
  };

  return (
    <Form className="m-3 d-flex" onSubmit={submit}>
      <Form.Control
        placeholder="Поиск…"
        className="me-2"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Button type="submit">Найти</Button>
    </Form>
  );
};

export default FilterBar;
