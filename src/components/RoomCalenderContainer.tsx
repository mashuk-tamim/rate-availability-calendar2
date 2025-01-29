"use client";

import React, { useState, useEffect } from "react";
import ScrollableCalendar from "./ScrollableCalendar";
import { debounce } from "lodash";
import { RoomCalendarResponse } from "@/types/room-calendar";
import ScrollableRoomTable from "./ScrollableRoomTable";
import { formatDate } from "@/lib/helper";

interface RoomCalendarProps {
	start_date: string;
	end_date: string;
	roomCalendar: RoomCalendarResponse;
}

export default function RoomCalendarContainer({
	start_date,
	end_date,
	roomCalendar,
}: RoomCalendarProps) {
	const [scrollOffset, setScrollOffset] = useState<{
		offset: number;
		sourceId: string;
	}>({
		offset: 0,
		sourceId: "",
	});

	// Create debounced scroll handler
	const handleScroll = debounce((newOffset: number, sourceId: string) => {
		setScrollOffset({ offset: newOffset, sourceId });

	}, 250);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			handleScroll.cancel();
		};
	}, []);

	return (
		<div className="space-y-8">
			<div className="flex p-4 bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-sm">
        <div className="min-w-[100px] md:min-w-[200px] lg:min-w-[300px] text-xl flex flex-col justify-center ">
					<p>Rate Calendar</p>
					<p className="text-sm hidden md:block">
						from <span className="font-bold">{formatDate(start_date)}</span> to{" "}
						<span className="font-bold">{formatDate(end_date)}</span>
					</p>
				</div>
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
			</div>
			<div className=" flex flex-col gap-4 p-4 bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-sm">
				{/* Room Tables */}
				{roomCalendar.data.room_categories.map((roomCategory, index, array) => (
					<div
						key={roomCategory.id}
						className="border border-slate-400 dark:border-slate-600 rounded-sm overflow-hidden"
					>
						<div className="px-4 py-3 border-b border-slate-400 dark:border-slate-600">
							<h3 className="font-semibold text-lg">{roomCategory.name}</h3>
						</div>
						<ScrollableRoomTable
							roomCategory={roomCategory}
							start_date={start_date}
							end_date={end_date}
							onScroll={(offset) =>
								handleScroll(offset, `table-${roomCategory.id}`)
							}
							scrollOffset={
								scrollOffset.sourceId !== `table-${roomCategory.id}`
									? scrollOffset.offset
									: undefined
							}
							showScrollbar={index === array.length - 1}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
