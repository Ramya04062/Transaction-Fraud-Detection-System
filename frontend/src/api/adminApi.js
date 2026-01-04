const BASE_URL = "http://localhost:8000";

export const fetchStats = () =>
  fetch(`${BASE_URL}/admin/stats`).then(res => res.json());

export const fetchTransactions = (limit = 100) =>
  fetch(`${BASE_URL}/admin/transactions?limit=${limit}`).then(res => res.json());

export const fetchAlerts = (limit = 100) =>
  fetch(`${BASE_URL}/admin/alerts?limit=${limit}`).then(res => res.json());

export const fetchTrends = () =>
  fetch(`${BASE_URL}/admin/trends`).then(res => res.json());
