import React from "react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import RoomCalendarContainer from "@/components/RoomCalenderContainer";
import Fetch from "@/lib/Fetch";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Room Calendar",
	description: "View and manage room availability calendar",
	openGraph: {
		title: "Room Calendar",
		description: "View and manage room availability calendar",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Room Calendar",
		description: "View and manage room availability calendar",
	},
};

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ start_date: string; end_date: string }>;
}) {
	const { start_date = "2025-01-29", end_date = "2025-01-30" } =
		await searchParams;

	const propertyId = 1;

	// Only fetch first page with cursor=0
	const roomCalendar = await Fetch({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/property/${propertyId}/rate-calendar/assessment?start_date=${start_date}&end_date=${end_date}&cursor=0`,
	});

	return (
		<div className="max-w-7xl mx-auto border border-slate-400 dark:border-slate-600 p-4 space-y-4">
			<div className="border border-slate-400 dark:border-slate-600 p-4 bg-slate-100 dark:bg-slate-900 rounded-sm">
				<p className="text-2xl font-bold">Pick a date range</p>
				<DatePickerWithRange />
			</div>
			<div className="py-2">
				<RoomCalendarContainer
					start_date={start_date}
					end_date={end_date}
					roomCalendar={roomCalendar}
				/>
			</div>
		</div>
	);
}
