const BASE_URL = "http://localhost:8000";

export interface StatsResponse {
  transactions_today: number;
  fraud_detected: number;
  blocked_amount: number;
  active_users: number;
}

export interface TransactionResponse {
  id: string;
  user: string;
  amount: number;
  status: string;
  risk: string;
  time: string | null;
}

export interface AlertResponse {
  id: number;
  type: string;
  user: string;
  amount: number;
  location: string;
  severity: string;
  time: string | null;
}

export interface TrendResponse {
  month: string;
  fraudulent: number;
  legitimate: number;
  blocked: number;
}

export const fetchStats = async (): Promise<StatsResponse> => {
  const response = await fetch(`${BASE_URL}/admin/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};

export const fetchTransactions = async (limit: number = 100): Promise<TransactionResponse[]> => {
  const response = await fetch(`${BASE_URL}/admin/transactions?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
};

export const fetchAlerts = async (limit: number = 100): Promise<AlertResponse[]> => {
  const response = await fetch(`${BASE_URL}/admin/alerts?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
};

export const fetchTrends = async (): Promise<TrendResponse[]> => {
  const response = await fetch(`${BASE_URL}/admin/trends`);
  if (!response.ok) {
    throw new Error('Failed to fetch trends');
  }
  return response.json();
};

