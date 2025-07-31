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
  DialogFooter: ({ children }) => <div>{children}</div>,
}));





import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DriversPage from '../DriversPage';


// Mock fetch API
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            driverId: 1,
            name: 'John Doe',
            licenseNumber: 'ABC123',
          },
        ]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('DriversPage', () => {
  test('renders driver list from API', async () => {
    render(<DriversPage />);

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  test('shows "Register Driver" dialog when button is clicked', async () => {
    render(<DriversPage />);
    
    // Wait for drivers to load
    await waitFor(() => screen.getByText('John Doe'));

    const openDialogBtn = screen.getByText('+ Register Driver');
    fireEvent.click(openDialogBtn);

    expect(await screen.findByText('Register New Driver')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
  });

  test('renders "No drivers found." if API returns empty', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<DriversPage />);

    expect(await screen.findByText('No drivers found.')).toBeInTheDocument();
  });
});
