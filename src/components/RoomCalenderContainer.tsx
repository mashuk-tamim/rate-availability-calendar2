"use client";

import React, { useState, useEffect } from "react";
import ScrollableCalendar from "./ScrollableCalendar";
import { debounce } from "lodash";
import { RoomCalendarResponse } from "@/types/room-calendar";

interface RoomCalendarProps {
	start_date: string;
	end_date: string;
	room_calendar: RoomCalendarResponse;
}

export default function RoomCalendarContainer({
	start_date,
	end_date,
	room_calendar,
}: RoomCalendarProps) {
	const [scrollOffset, setScrollOffset] = useState<{
		offset: number;
		sourceId: string;
	}>({
		offset: 0,
		sourceId: "",
	});

	console.log(room_calendar);

	// Create debounced scroll handler
	const handleScroll = debounce((newOffset: number, sourceId: string) => {
		setScrollOffset({ offset: newOffset, sourceId });
		console.log("sourceId:", sourceId, "newOffset:", newOffset);
	}, 250);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			handleScroll.cancel();
		};
	}, []);

	return (
		<div className="space-y-4">
			<ScrollableCalendar
				// id="calendar1"
				start_date={start_date}
				end_date={end_date}
				onScroll={(offset) => handleScroll(offset, "calendar1")}
				scrollOffset={
					scrollOffset.sourceId !== "calendar1"
						? scrollOffset.offset
						: undefined
				}
			/>
			<>
				{[...Array(100)].map((_, index) => {
					console.log(index + 2);
					return (
						<div key={index + 2}>
							<ScrollableCalendar
								// id={`calendar${index}`}
								start_date={start_date}
								end_date={end_date}
								onScroll={(offset) =>
									handleScroll(offset, `calendar${index + 2}`)
								}
								scrollOffset={
									scrollOffset.sourceId !== `calendar${index + 2}`
										? scrollOffset.offset
										: undefined
								}
							/>
						</div>
					);
				})}
			</>
		</div>
	);
}
