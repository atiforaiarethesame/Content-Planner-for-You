export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const INDONESIAN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export const INDONESIAN_DAYS_SHORT_SUN = [
  'MIN',
  'SEN',
  'SEL',
  'RAB',
  'KAM',
  'JUM',
  'SAB',
];

export const INDONESIAN_DAYS_SHORT_MON = [
  'SEN',
  'SEL',
  'RAB',
  'KAM',
  'JUM',
  'SAB',
  'MIN',
];

export const INDONESIAN_DAYS_FULL = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatIndonesianDate(
  dateStr: string,
  options: { shortMonth?: boolean; withWeekday?: boolean } = {}
): string {
  const date = parseISODate(dateStr);
  const day = date.getDate();
  const month = options.shortMonth
    ? INDONESIAN_MONTHS_SHORT[date.getMonth()]
    : INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  if (options.withWeekday) {
    const weekday = INDONESIAN_DAYS_FULL[date.getDay()];
    return `${weekday}, ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
}

export function formatTimeWithZone(time: string, timezone: string): string {
  return `${time.replace(':', '.')} ${timezone}`;
}

export function getMonthCalendarDays(
  year: number,
  monthIndex: number,
  weekStartsOn: 'sunday' | 'monday'
): Array<{ dateStr: string; dayNumber: number; isCurrentMonth: boolean }> {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startOffset = firstDay.getDay(); // 0 = Sunday
  if (weekStartsOn === 'monday') {
    startOffset = startOffset === 0 ? 6 : startOffset - 1;
  }

  const cells: Array<{ dateStr: string; dayNumber: number; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevDate = new Date(year, monthIndex - 1, d);
    cells.push({
      dateStr: toISODate(prevDate),
      dayNumber: d,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, monthIndex, d);
    cells.push({
      dateStr: toISODate(currDate),
      dayNumber: d,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete grid rows (35 or 42 cells)
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const needed = 7 - remainder;
    for (let d = 1; d <= needed; d++) {
      const nextDate = new Date(year, monthIndex + 1, d);
      cells.push({
        dateStr: toISODate(nextDate),
        dayNumber: d,
        isCurrentMonth: false,
      });
    }
  }

  return cells;
}

export function getWeekDates(
  referenceDateStr: string,
  weekStartsOn: 'sunday' | 'monday'
): string[] {
  const ref = parseISODate(referenceDateStr);
  const day = ref.getDay();
  const diffToStart =
    weekStartsOn === 'monday' ? (day === 0 ? -6 : 1 - day) : -day;

  const start = new Date(ref);
  start.setDate(ref.getDate() + diffToStart);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toISODate(d);
  });
}

export function getRelativeDayLabel(dateStr: string, todayStr: string): string {
  const target = parseISODate(dateStr).getTime();
  const today = parseISODate(todayStr).getTime();
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari Ini';
  if (diffDays === 1) return 'Besok';
  if (diffDays === -1) return 'Kemarin';
  if (diffDays > 1 && diffDays <= 7) return `${diffDays} hari lagi`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} hari lalu`;
  return formatIndonesianDate(dateStr, { shortMonth: true });
}

export function isDateInCurrentWeek(
  dateStr: string,
  todayStr: string,
  weekStartsOn: 'sunday' | 'monday'
): boolean {
  const weekDates = getWeekDates(todayStr, weekStartsOn);
  return weekDates.includes(dateStr);
}
