import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../Register';
import { MemoryRouter } from 'react-router-dom';

describe('Register Page', () => {
  test('renders registration form correctly', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LicenseNumber/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByText(/Login here/i)).toBeInTheDocument();
  });

  test('shows Admin Key input when role is FleetManager', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const roleSelect = screen.getByLabelText(/Role/i);
    fireEvent.change(roleSelect, { target: { value: 'FleetManager' } });

    expect(screen.getByLabelText(/Admin Key/i)).toBeInTheDocument();
  });
});
