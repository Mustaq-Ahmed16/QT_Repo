jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...rest }) => (
    <button onClick={onClick} {...rest}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }) => <input {...props} />,
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogTrigger: ({ children }) => <div>{children}</div>,
}));




import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehiclesPage from '../VehiclesPage';

// Mock localStorage
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => 'FleetManager');
});

// Global fetch mock
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          result: [
            {
              vehicleId: 1,
              vehicleNumber: 'MH12AB1234',
              model: 'Tata Ace',
              capacity: 500,
            },
          ],
        }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('VehiclesPage', () => {
  test('renders vehicle list', async () => {
    render(<VehiclesPage />);

    expect(await screen.findByText('MH12AB1234')).toBeInTheDocument();
    expect(screen.getByText('Tata Ace')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  test('opens dialog when "+ Add Vehicle" clicked', async () => {
    render(<VehiclesPage />);

    // wait for table to load
    await waitFor(() => screen.getByText('MH12AB1234'));

    const addButton = screen.getByText('+ Add Vehicle');
    fireEvent.click(addButton);

    expect(await screen.findByText('Add Vehicle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Vehicle Number')).toBeInTheDocument();
  });

  test('renders "No vehicles found." when API returns empty', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ result: [] }),
      })
    );

    render(<VehiclesPage />);
    expect(await screen.findByText('No vehicles found.')).toBeInTheDocument();
  });
});
