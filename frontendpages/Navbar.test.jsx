// src/components/__tests__/Navbar.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { AuthProvider } from '@/context/AuthContext';

test('renders logo and title', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthProvider>
  );

  const titleElement = screen.getByText(/Driver Trip Scheduler/i);
  expect(titleElement).toBeInTheDocument();

  const logo = screen.getByAltText(/Fleet Logo/i);
  expect(logo).toBeInTheDocument();
});
