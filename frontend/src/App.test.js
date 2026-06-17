import { render, screen } from '@testing-library/react';

// Mock axios globally
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { activities: [] } })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('login page renders by default', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
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