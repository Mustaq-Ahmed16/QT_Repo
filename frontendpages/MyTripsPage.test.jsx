import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MyTripsPage from '../MyTripsPage';

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <h3>{children}</h3>,
  CardContent: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }) => <div>{children}</div>,
  DialogTrigger: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
}));

// Mock API
const mockTrips = [
  {
    tripId: 1,
    origin: 'CityA',
    destination: 'CityB',
    tripStartTime: new Date().toISOString(),
    tripEndTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    submissionDate: new Date().toISOString(),
    driver: { userName: 'John Doe' },
    fleetManager: { userName: 'FM Name' },
    vehicle: { vehicleNumber: 'XYZ123', model: 'Tesla Model 3' },
  },
  {
    tripId: 2,
    origin: 'CityX',
    destination: 'CityY',
    tripStartTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    tripEndTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    submissionDate: new Date().toISOString(),
    driver: { userName: 'Jane Smith' },
    fleetManager: { userName: 'FM Name' },
    vehicle: { vehicleNumber: 'ABC789', model: 'Nissan Leaf' },
  },
];

jest.mock('@/apiClient', () => jest.fn(() =>
  Promise.resolve({ data: mockTrips })
));

describe('MyTripsPage', () => {
  it('shows loading and renders trips correctly', async () => {
    render(<MyTripsPage />);

    // Loading text appears
    expect(screen.getByText(/Loading trips/i)).toBeInTheDocument();

    // Wait for trips to render
    await waitFor(() => {
      expect(screen.getByText(/CityA/i)).toBeInTheDocument();
      expect(screen.getByText(/CityX/i)).toBeInTheDocument();
    });

    // Icons
    expect(screen.getAllByText(/CityA ➡️ CityB/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/CityX ➡️ CityY/i)[0]).toBeInTheDocument();

    // Status icons exist
    expect(screen.getByTitle('Clock')).toBeInTheDocument(); // Ongoing
    expect(screen.getByTitle('CheckCircle')).toBeInTheDocument(); // Completed
  });

  it('displays trip details on click', async () => {
    render(<MyTripsPage />);
    await waitFor(() => screen.getByText('CityA ➡️ CityB'));

    fireEvent.click(screen.getByText('CityA ➡️ CityB'));

    // Check if dialog content is rendered
    expect(await screen.findByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Driver Name:/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
