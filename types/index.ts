export type Role = "super_admin" | "turf_owner" | "maintainer" | "user";

export const PRICING_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
export type PricingDay = (typeof PRICING_DAYS)[number];

/** A reference is either a raw id or a populated document depending on the endpoint. */
export type Ref<T> = string | T;

export type SessionUser = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: Role;
};

export type User = {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: Role;
};

export type Company = {
  _id: string;
  name: string;
  logo?: string;
  address: string;
};

export type TimeBand = {
  name: string;
  startTime: string;
  endTime: string;
  /** The API drops this when every cell is empty. */
  prices?: Partial<Record<PricingDay, number>>;
};

export type Campaign = {
  name: string;
  startDate: string;
  endDate: string;
  discountPercentage: number;
};

export type Ground = {
  _id: string;
  name: string;
  description?: string;
  /** Public paths of the gallery photos; the first one is the cover. */
  images?: string[];
  companyId: Ref<Company>;
  sports: string[];
  slotDuration: number;
  advancePayment: boolean;
  operatingHours: { start: string; end: string };
  pricingConfig: { basePrice: number; timeBands?: TimeBand[] };
  campaigns?: Campaign[];
  status: "active" | "inactive";
};

export type Sport = {
  _id: string;
  /** Stable slug that grounds and bookings refer to, e.g. "table-tennis". */
  key: string;
  name: { en: string; bn?: string };
  /** An emoji or an image URL. */
  icon?: string;
  order: number;
  isActive: boolean;
};

export type Slot = {
  _id: string;
  groundId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isBooked: boolean;
  isDisabled: boolean;
};

export type SearchResult = {
  ground: Ground;
  availableSlots: Slot[];
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid";

export type Booking = {
  _id: string;
  source: "online" | "manual";
  // Populated references come back null if the ground / slot / company was later deleted
  groundId: Ground | null;
  slotId: Slot | null;
  sport: string;
  companyId: Company | null;
  bookingDate: string;
  totalPrice: number;
  advancePaid: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  needsCompanySelection: boolean;
  user: SessionUser;
};

/** Either an email or a phone number; the API accepts exactly one. */
export type Identifier = { email: string; phoneNumber?: undefined } | { phoneNumber: string; email?: undefined };
