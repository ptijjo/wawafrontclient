export const SLOT_DURATION_MIN = 60;

export interface TimeBlock {
  start: string; // HH:MM
  end: string;   // HH:MM
}

export const DEFAULT_BLOCKS: TimeBlock[] = [
  { start: '09:00', end: '12:00' },
  { start: '14:00', end: '18:00' },
];

export const ACTIVE_WEEK_DAYS = [1, 2, 3, 4, 5, 6]; // Monday=1 ... Saturday=6

export function parseHM(baseDate: Date, hm: string): Date {
  const [h, m] = hm.split(':').map(Number);
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), h, m, 0, 0);
}

export function enumerateSlots(day: Date, blocks: TimeBlock[] = DEFAULT_BLOCKS) {
  const slots: Date[] = [];
  for (const block of blocks) {
    const start = parseHM(day, block.start);
    const end = parseHM(day, block.end);
    for (let d = new Date(start); d < end; d = new Date(d.getTime() + SLOT_DURATION_MIN * 60000)) {
      slots.push(new Date(d));
    }
  }
  return slots;
}
