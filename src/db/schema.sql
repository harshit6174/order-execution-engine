CREATE TABLE orders (
  id UUID PRIMARY KEY,
  token_in TEXT,
  token_out TEXT,
  amount NUMERIC,
  dex TEXT,
  status TEXT,
  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
