import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TripsPage from '../TripsPage';

// Mock localStorage for token
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => 'dummy-token');
});

// Mock UI components if they cause errors
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...rest }) => (
    <button onClick={onClick} {...rest}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }) => <div>{children}</div>,
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children, value }) => <div data-value={value}>{children}</div>,
  SelectValue: () => <div>Select</div>,
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogFooter: ({ children }) => <div>{children}</div>,
}));

// Mock apiClient
const mockDrivers = [{ driverId: 2, userName: 'Driver A' }];
const mockVehicles = { result: [{ vehicleId: 5, vehicleNumber: 'XYZ123' }] };
const mockTrips = [
  {
    tripId: 10,
    fleetManager: { userName: 'Manager1' },
    driver: { userName: 'Driver A' },
    vehicle: { vehicleNumber: 'XYZ123' },
    origin: 'CityA',
    destination: 'CityB',
    tripStartTime: new Date().toISOString(),
    tripEndTime: new Date(Date.now() + 3600000).toISOString(),
    submissionDate: new Date().toISOString(),
  },
];

jest.mock('@/apiClient', () => ({
  get: jest.fn((path) => {
    if (path.endsWith('/drivers')) {
      return Promise.resolve({ data: mockDrivers });
    }
    if (path.endsWith('/vehicle/all')) {
      return Promise.resolve({ data: mockVehicles });
    }
    if (path.endsWith('/trip')) {
      return Promise.resolve({ data: mockTrips });
    }
    return Promise.reject(new Error('unknown'));
  }),
}));

describe('TripsPage', () => {
  test('loads and displays trip row', async () => {
    render(<TripsPage />);

    // Wait for trip row to render
    expect(await screen.findByText('Manager1')).toBeInTheDocument();
    expect(screen.getByText('Driver A')).toBeInTheDocument();
    expect(screen.getByText('XYZ123')).toBeInTheDocument();
    expect(screen.getByText('CityA')).toBeInTheDocument();
    expect(screen.getByText('CityB')).toBeInTheDocument();
  });

  test('opens add modal when clicking "+ Add Trip"', async () => {
    render(<TripsPage />);

    const addBtn = screen.getByText('+ Add Trip');
    fireEvent.click(addBtn);

    expect(await screen.findByText(/Assign New Trip/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Origin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Destination')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('shows no rows when trips empty', async () => {
    // Override fetch to return empty
    require('@/apiClient').get.mockImplementationOnce((path) => {
      if (path.endsWith('/drivers')) return Promise.resolve({ data: mockDrivers });
      if (path.endsWith('/vehicle/all')) return Promise.resolve({ data: mockVehicles });
      if (path.endsWith('/trip')) return Promise.resolve({ data: [] });
      return Promise.reject();
    });
    render(<TripsPage />);

    // Wait and check that table shows no rows—thead remains
    await waitFor(() => {
      const rows = screen.queryAllByRole('row');
      // One header row only
      expect(rows.length).toBe(1);
    });
  });
});
