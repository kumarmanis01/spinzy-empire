import { promises as fs } from 'fs';
import path from 'path';

export type UsageEvent = {
  capability: string;
  timestamp: string; // ISO
  payload?: Record<string, any>;
};

const STORE_PATH = path.join(__dirname, 'usage_events.json');
let _cache: UsageEvent[] | null = null;

async function readStore(): Promise<UsageEvent[]> {
  if (_cache) return _cache;
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8');
    _cache = JSON.parse(raw) as UsageEvent[];
  } catch (err) {
    _cache = [];
  }
  return _cache;
}

async function writeStore(events: UsageEvent[]): Promise<void> {
  _cache = events;
  await fs.writeFile(STORE_PATH, JSON.stringify(events, null, 2), 'utf-8');
}

/** Record a usage event. Pure utility with optional file persistence. */
export async function recordUsage(event: UsageEvent): Promise<void> {
  const events = await readStore();
  events.push(event);
  // keep store small by trimming to last 10k entries
  if (events.length > 10000) events.splice(0, events.length - 10000);
  await writeStore(events);
}

/** Return all recorded usage events */
export async function getUsageEvents(): Promise<UsageEvent[]> {
  return await readStore();
}

/** Clear stored events (utility) */
export async function clearUsageEvents(): Promise<void> {
  _cache = [];
  await writeStore([]);
}
