export interface RoomCalendarResponse {
	code: string;
	message: string;
	data: RoomCalendarData;
}

export interface RoomCalendarData {
	room_categories: RoomCategory[];
}

export interface RoomCategory {
	id: string;
	name: string;
	occupancy: number;
	inventory_calendar: InventoryCalendar[];
	rate_plans: RatePlan[];
}

export interface InventoryCalendar {
	id: string;
	date: string;
	available: number;
	status: boolean;
	booked: number;
}

export interface RatePlan {
	id: number;
	name: string;
	calendar: RateCalendar[];
}

export interface RateCalendar {
	id: string;
	date: string;
	rate: number;
	min_length_of_stay: number;
	reservation_deadline: number;
}
