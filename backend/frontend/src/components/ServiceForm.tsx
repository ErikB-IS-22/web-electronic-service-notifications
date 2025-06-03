import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import type { ServiceFormData } from '../types';

interface Props {
  initial?: ServiceFormData;
  onSubmit: (data: ServiceFormData) => void;
}

const ServiceForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const [form, setForm] = useState<ServiceFormData>(
    initial ?? {
      name: '',
      slug: '',
      description: '',
      status: 'draft',
      image: '',
    }
  );

  const handle = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Form onSubmit={submit}>
      <Form.Group className="mb-3">
        <Form.Label>Название</Form.Label>
        <Form.Control name="name" value={form.name} onChange={handle} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Слаг</Form.Label>
        <Form.Control name="slug" value={form.slug} onChange={handle} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Описание</Form.Label>
        <Form.Control
          name="description"
          as="textarea"
          rows={3}
          value={form.description}
          onChange={handle}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Статус</Form.Label>
        <Form.Select name="status" value={form.status} onChange={handle}>
          <option value="draft">Черновик</option>
          <option value="active">Активна</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>URL картинки</Form.Label>
        <Form.Control name="image" value={form.image} onChange={handle} />
      </Form.Group>

      <Button type="submit">Сохранить</Button>
    </Form>
  );
};

export default ServiceForm;
