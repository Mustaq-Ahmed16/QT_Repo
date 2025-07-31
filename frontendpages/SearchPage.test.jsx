import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SearchPage from '../SearchPage';

// Mocks for components if needed
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));
jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} />,
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
}));
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }) => <div>{children}</div>,
  DialogTrigger: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
}));

// Mock apiClient
jest.mock('@/apiClient', () =>
  jest.fn((url) => {
    if (url.includes('/trip/search')) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes('/trip')) {
      return Promise.resolve({
        data: [
          {
            tripId: 1,
            origin: 'Pune',
            destination: 'Mumbai',
            tripStartTime: new Date().toISOString(),
            tripEndTime: new Date().toISOString(),
            submissionDate: new Date().toISOString(),
            driver: { userName: 'John Driver' },
            vehicle: { vehicleNumber: 'MH12AB1234', model: 'Tata Ace' },
            fleetManager: { userName: 'Alice Manager' },
          },
        ],
      });
    }
    if (url.includes('/vehicle/all')) {
      return Promise.resolve({
        data: {
          result: [{ vehicleId: 1, vehicleNumber: 'MH12AB1234', model: 'Tata Ace' }],
        },
      });
    }
    return Promise.reject('Unknown API');
  })
);

// Mock fetch (used for drivers)
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([{ driverId: 1, name: 'John Driver' }]),
  })
);

describe('SearchPage', () => {
  test('renders trip data after fetch', async () => {
    render(<SearchPage />);

    expect(screen.getByText(/Trips/i)).toBeInTheDocument();
    expect(await screen.findByText(/Pune ➡️ Mumbai/i)).toBeInTheDocument();
    expect(screen.getByText(/John Driver/)).toBeInTheDocument();
    expect(screen.getByText(/Tata Ace/)).toBeInTheDocument();
  });

  test('shows driver and vehicle options in search', async () => {
    render(<SearchPage />);

    // Wait for initial data
    await screen.findByText(/Pune ➡️ Mumbai/i);

    // Switch to driver mode
    fireEvent.change(screen.getByDisplayValue('All Trips'), {
      target: { value: 'driver' },
    });

    await waitFor(() => {
      expect(screen.getByText('John Driver')).toBeInTheDocument();
    });

    // Switch to vehicle mode
    fireEvent.change(screen.getByDisplayValue('Search by Driver'), {
      target: { value: 'vehicle' },
    });

    await waitFor(() => {
      expect(screen.getByText('MH12AB1234')).toBeInTheDocument();
    });
  });

  test('displays "No results found" on empty search', async () => {
    render(<SearchPage />);

    // Wait for default trips to load
    await screen.findByText(/Pune ➡️ Mumbai/i);

    // Switch to driver search
    fireEvent.change(screen.getByDisplayValue('All Trips'), {
      target: { value: 'driver' },
    });

    fireEvent.change(screen.getByDisplayValue('Select Driver'), {
      target: { value: 'John Driver' },
    });

    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() =>
      expect(screen.getByText(/No results found/i)).toBeInTheDocument()
    );
  });
});
