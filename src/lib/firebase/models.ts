// src/lib/firebase/models.ts

export interface Medicion {
  measurement_id: string;
  device_id: string;
  variable: string;
  value: number;
  unit: string;
  device_timestamp: string;
  server_timestamp?: number | null;
  quality: string;
  sync_status: "pending" | "synced";
}