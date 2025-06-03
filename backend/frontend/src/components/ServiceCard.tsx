// src/components/ServiceCard.tsx
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Service } from '../types';
import { useAppDispatch } from '../hooks';
import { addToDraft } from '../slices/draftSlice';

interface Props { service: Service }

const ServiceCard: React.FC<Props> = ({ service }) => {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch(addToDraft(service));       // кладём услугу локально
    setAdded(true);                      // показываем «✔»
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Card className="m-2" style={{ width: '18rem' }}>
      <Card.Img
        variant="top"
        src={service.image || 'https://via.placeholder.com/150'}
        alt={service.name}
      />
      <Card.Body>
        <Card.Title>{service.name}</Card.Title>
        <Card.Text className="text-muted">{service.description}</Card.Text>

        <Link to={`/services/${service.id}`} className="btn btn-primary me-2">
          Подробнее
        </Link>

        <Button
          variant={added ? 'success' : 'outline-success'}
          onClick={handleAdd}
          disabled={added}
        >
          {added ? '✔ Добавлено' : 'Добавить'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;
