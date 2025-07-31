import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ManagerDashboard from '../ManagerDashboard';

// Mock the subpages (lightweight stubs to isolate the dashboard logic)
jest.mock('../TripsPage', () => () => <div data-testid="trips-page">TripsPage</div>);
jest.mock('../DriversPage', () => () => <div data-testid="drivers-page">DriversPage</div>);
jest.mock('../VehiclesPage', () => () => <div data-testid="vehicles-page">VehiclesPage</div>);
jest.mock('../SearchPage', () => () => <div data-testid="search-page">SearchPage</div>);

describe('ManagerDashboard', () => {
  test('renders dashboard with sidebar buttons and default content', () => {
    render(<ManagerDashboard />);

    // Sidebar buttons
    expect(screen.getByText('Trips')).toBeInTheDocument();
    expect(screen.getByText('Drivers')).toBeInTheDocument();
    expect(screen.getByText('Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();

    // Default selected content (Trips)
    expect(screen.getByTestId('trips-page')).toBeInTheDocument();
  });

  test('renders DriversPage when Drivers is selected', () => {
    render(<ManagerDashboard />);
    fireEvent.click(screen.getByText('Drivers'));
    expect(screen.getByTestId('drivers-page')).toBeInTheDocument();
  });

  test('renders VehiclesPage when Vehicles is selected', () => {
    render(<ManagerDashboard />);
    fireEvent.click(screen.getByText('Vehicles'));
    expect(screen.getByTestId('vehicles-page')).toBeInTheDocument();
  });

  test('renders SearchPage when Search is selected', () => {
    render(<ManagerDashboard />);
    fireEvent.click(screen.getByText('Search'));
    expect(screen.getByTestId('search-page')).toBeInTheDocument();
  });
});
