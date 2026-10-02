/** "00:00" … "23:00", for the from / to time filters. */
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
