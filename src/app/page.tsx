import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import RoomCalendarContainer from "@/components/RoomCalenderContainer";
import Fetch from "@/utils/Fetch";
import * as React from "react";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ from: string; to: string }>;
}) {
	const { from: start_date = "2025-01-29", to: end_date = "2025-01-30" } = await searchParams;

	console.log(start_date, end_date);
	const propertyId = 1;
	// Fetch room rate availability calendar data

	const room_calendar = await Fetch({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/property/${propertyId}/rate-calendar/assessment?start_date=${start_date}&end_date=${end_date}`,
	});
	console.log(room_calendar);

	return (
		<div className="max-w-7xl mx-auto border px-4 py-8 space-y-4">
			<div>
				<p className="text-2xl font-bold">Rate Calendar</p>
				<DatePickerWithRange />
      </div>
      <div className="py-2">

			<RoomCalendarContainer start_date={start_date} end_date={end_date} room_calendar={room_calendar}/>
      </div>
		</div>
	);
}
