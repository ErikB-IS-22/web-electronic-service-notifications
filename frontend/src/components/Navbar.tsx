import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logout } from '../slices/authSlice';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <BSNavbar style={{ backgroundColor: '#1faee9' }} variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <img
              src="/logo.png"
              alt="Логотип"
              height="95"  // можно регулировать
              className="d-inline-block align-top"
          />
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav"/>
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/" className="text-white fw-bold fs-5 px-3">Услуги</Nav.Link>
            <Nav.Link as={Link} to="/requests" className="text-white fw-bold fs-5 px-3">Заявки</Nav.Link>
            {user && <Nav.Link as={Link} to="/draft" className="text-white fw-bold fs-5 px-3">Черновик</Nav.Link>}
            {user?.username === 'admin' && <Nav.Link as={Link} to="/services/create" className="text-white fw-bold fs-5 px-3">Создать услугу</Nav.Link>}
          </Nav>
          <Nav>
            {user ? (
              <>
                <span className="text-white fw-bold fs-5 px-3">👤 {user.username}</span>
                <Button className="text-white fw-bold fs-5 px-3" onClick={() => dispatch(logout())}>Выйти</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white fw-bold fs-5 px-3">Вход</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white fw-bold fs-5 px-3">Регистрация</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
