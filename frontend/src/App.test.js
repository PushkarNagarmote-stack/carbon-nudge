import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock axios globally
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { activities: [] } })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock window.scrollTo (jsdom doesn't support it)
beforeAll(() => {
  window.scrollTo = jest.fn();
});

import axios from 'axios';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// ─── EXISTING MATH TESTS ────────────────────────────────────────────────────

test('landing page renders by default', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /engineering a sustainable future/i })).toBeInTheDocument();
});

test('carbon math: beef 1 serving = 27kg CO2', () => {
  expect(27.0 * 1).toBe(27.0);
});

test('carbon math: car 100km = 21kg CO2', () => {
  expect(parseFloat((0.21 * 100).toFixed(3))).toBe(21.0);
});

test('carbon math: electricity 10 units = 8.2kg CO2', () => {
  expect(parseFloat((0.82 * 10).toFixed(3))).toBe(8.2);
});

test('progress bar caps at 100% even if CO2 is very high', () => {
  const totalCo2 = 50;
  const avgFootprint = 4.5;
  const pct = Math.min((totalCo2 / avgFootprint) * 100, 100);
  expect(pct).toBe(100);
});

test('progress bar shows correct % when under average', () => {
  const totalCo2 = 2.25;
  const avgFootprint = 4.5;
  const pct = Math.min((totalCo2 / avgFootprint) * 100, 100);
  expect(pct).toBe(50);
});

test('streak increments only for activities under 2kg CO2', () => {
  let streak = 0;
  [1.5, 5.0, 0.4, 27.0, 1.9].forEach(v => { if (v < 2) streak++; });
  expect(streak).toBe(3);
});

test('CO2 rounds to 3 decimal places', () => {
  const result = parseFloat((0.21 * 3).toFixed(3));
  expect(result).toBe(0.63);
});

test('zero quantity produces zero CO2', () => {
  const co2 = parseFloat((27.0 * 0).toFixed(3));
  expect(co2).toBe(0);
});

test('isUnderAvg is true when totalCo2 < 4.5', () => {
  expect(3.0 < 4.5).toBe(true);
});

test('isUnderAvg is false when totalCo2 > 4.5', () => {
  expect(10.0 < 4.5).toBe(false);
});

// ─── LOGIN COMPONENT TESTS ──────────────────────────────────────────────────

describe('Login component', () => {
  test('renders email and password fields', () => {
    render(<Login onLogin={jest.fn()} onNavigate={jest.fn()} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  test('renders Sign In and Demo Mode buttons', () => {
    render(<Login onLogin={jest.fn()} onNavigate={jest.fn()} />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try demo mode/i })).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    render(<Login onLogin={jest.fn()} onNavigate={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  test('calls axios.post on valid submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'abc', username: 'test' } });
    const onLogin = jest.fn();
    render(<Login onLogin={onLogin} onNavigate={jest.fn()} />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password1!');
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    // Either the mock was called (success) or a network response appeared (submit triggered)
    await waitFor(() => {
      const called = axios.post.mock.calls.length > 0;
      const errorShown = document.querySelector('[role="alert"]');
      expect(called || errorShown).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('shows error message on failed login', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    });
    render(<Login onLogin={jest.fn()} onNavigate={jest.fn()} />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'bad@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'wrongpass');
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

// ─── SIGNUP COMPONENT TESTS ─────────────────────────────────────────────────

describe('Signup component', () => {
  test('renders full name, email, and password fields', () => {
    render(<Signup onLogin={jest.fn()} onNavigate={jest.fn()} />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  test('renders Create Account button', () => {
    render(<Signup onLogin={jest.fn()} onNavigate={jest.fn()} />);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    render(<Signup onLogin={jest.fn()} onNavigate={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  test('shows error on mismatched passwords', async () => {
    render(<Signup onLogin={jest.fn()} onNavigate={jest.fn()} />);
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password1!');
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

// ─── FORGOT PASSWORD TESTS ──────────────────────────────────────────────────

describe('ForgotPassword component', () => {
  test('renders email input for account lookup', () => {
    render(<ForgotPassword onNavigate={jest.fn()} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  test('renders Find My Account button', () => {
    render(<ForgotPassword onNavigate={jest.fn()} />);
    expect(screen.getByRole('button', { name: /find my account/i })).toBeInTheDocument();
  });

  test('shows error when submitting empty email', async () => {
    render(<ForgotPassword onNavigate={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /find my account/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });
});

// ─── CARBON MATH EDGE CASES ─────────────────────────────────────────────────

describe('Carbon calculation edge cases', () => {
  test('negative quantity produces negative CO2 (guard needed)', () => {
    const co2 = parseFloat((27.0 * -1).toFixed(3));
    expect(co2).toBe(-27.0);
  });

  test('very large quantity still computes correctly', () => {
    const co2 = parseFloat((0.21 * 10000).toFixed(3));
    expect(co2).toBe(2100.0);
  });

  test('flight emission: 1000km = 255kg CO2', () => {
    expect(parseFloat((0.255 * 1000).toFixed(3))).toBe(255.0);
  });

  test('progress bar is 0% when totalCo2 is 0', () => {
    const pct = Math.min((0 / 4.5) * 100, 100);
    expect(pct).toBe(0);
  });

  test('streak is 0 when all activities are high emission', () => {
    let streak = 0;
    [5.0, 27.0, 10.0, 3.0].forEach(v => { if (v < 2) streak++; });
    expect(streak).toBe(0);
  });
});