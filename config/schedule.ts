export const SLOT_DURATION_MIN = 60; // Créneaux de 60 minutes

export interface TimeBlock {
  start: string; // HH:MM
  end: string;   // HH:MM
}

export const DEFAULT_BLOCKS: TimeBlock[] = [
  { start: '09:00', end: '12:00' }, // 09:00, 10:00, 11:00
  { start: '14:00', end: '18:00' }, // 14:00, 15:00, 16:00, 17:00
];

export const ACTIVE_WEEK_DAYS = [1, 2, 3, 4, 5, 6]; // Lundi=1 ... Samedi=6

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
