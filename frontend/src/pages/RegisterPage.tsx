import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { register } from '../slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

const RegisterPage: React.FC = () => {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((s) => s.auth);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(register({ username, password }));
    if (register.fulfilled.match(res)) nav('/');
  };

  return (
    <Form onSubmit={submit} className="m-3" style={{ maxWidth: 400 }}>
      <h2>Регистрация</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Логин</Form.Label>
        <Form.Control value={username} onChange={(e) => setU(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Пароль</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" disabled={loading}>
        {loading ? '...' : 'Создать аккаунт'}
      </Button>
    </Form>
  );
};
export default RegisterPage;

