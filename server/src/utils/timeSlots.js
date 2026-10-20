// Sessions start on the hour, from 9:00 to 17:00 (tutoring center time)
export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00',
];

// Checks that a string is a real date in the format YYYY-MM-DD
export const isValidDate = (date) => {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

// The current date and time in the tutoring center's time zone
export const getNowInBusinessTime = () => {
  const timeZone = process.env.BUSINESS_TIMEZONE || 'America/Chicago';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type).value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  };
};

// True if the date and time has already started
export const isInPast = (date, time) => {
  const now = getNowInBusinessTime();
  return `${date}T${time}` <= `${now.date}T${now.time}`;
};
