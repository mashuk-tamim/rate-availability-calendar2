"use client";

import React, { useState, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import ScrollableCalendar from "./ScrollableCalendar";
import { debounce } from "lodash";
import { RoomCalendarResponse } from "@/types/room-calendar";
import ScrollableRoomTable from "./ScrollableRoomTable";
import { formatDate } from "@/lib/helper";
import useRoomRateAvailabilityCalendar from "@/hooks/useRoomRateAvailabilityCalender";

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

	// Add this to track if we got empty data in the last fetch
	const [reachedEnd, setReachedEnd] = useState(false);

	const lastTableRef = useRef<HTMLDivElement>(null);

	// Add infinite query
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useRoomRateAvailabilityCalendar({
			property_id: 1,
			start_date,
			end_date,
			initialData: roomCalendar,
		});

	// Use Mantine's useIntersection hook
	const { ref: observerRef, entry } = useIntersection({
		root: lastTableRef.current,
		threshold: 0.5,
	});

	// Combine initial data with infinite query data
	const allRoomCategories =
		data?.pages.flatMap((page) => page.data.room_categories) ?? [];

	// Create debounced scroll handler for horizontal scroll sync
	const handleHorizontalScroll = debounce(
		(newOffset: number, sourceId: string) => {
			setScrollOffset({ offset: newOffset, sourceId });
		},
		50
	);

	// Handle intersection
	useEffect(() => {
		if (
			entry?.isIntersecting &&
			hasNextPage &&
			!isFetchingNextPage &&
			!reachedEnd
		) {
			fetchNextPage().then((result) => {
				// Check if the last page has no data
				const lastPage = result.data?.pages[result.data.pages.length - 1];
				if (!lastPage?.data?.room_categories?.length) {
					setReachedEnd(true);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [entry?.isIntersecting]);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			handleHorizontalScroll.cancel();
		};
	}, []);

	return (
		<div className="space-y-8 font-geist ">
			<div className="flex p-4 bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-sm">
				<div className="min-w-[100px] md:min-w-[200px] lg:min-w-[300px] text-xl flex flex-col justify-center">
					<p>Rate Calendar</p>
					<p className="text-sm hidden md:block">
						from <span className="font-bold">{formatDate(start_date)}</span> to{" "}
						<span className="font-bold">{formatDate(end_date)}</span>
					</p>
				</div>
				<ScrollableCalendar
					start_date={start_date}
					end_date={end_date}
					onScroll={(offset) => handleHorizontalScroll(offset, "calendar1")}
					scrollOffset={
						scrollOffset.sourceId !== "calendar1"
							? scrollOffset.offset
							: undefined
					}
				/>
			</div>
			<div className="flex flex-col md:gap-16 gap-8 p-4 bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-sm">
				{allRoomCategories.map((roomCategory, index, array) => {
					return (
						<div
							key={roomCategory.id}
							className="border border-slate-400 dark:border-slate-600 rounded-sm overflow-hidden"
						>
							<div className="p-2 md:p-3 border-b border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800">
								<h3 className="font-semibold text-lg tracking-wider">
									{roomCategory.name}
								</h3>
							</div>
							<ScrollableRoomTable
								roomCategory={roomCategory}
								start_date={start_date}
								end_date={end_date}
								onScroll={(offset) =>
									handleHorizontalScroll(offset, `table-${roomCategory.id}`)
								}
								scrollOffset={
									scrollOffset.sourceId !== `table-${roomCategory.id}`
										? scrollOffset.offset
										: undefined
								}
								showScrollbar={index === array.length - 1}
							/>
						</div>
					);
				})}

				{/* Only show observer and loading state if there's more to load */}
				<div
					ref={observerRef}
					className="h-8 flex items-center justify-center text-sm text-slate-600 dark:text-slate-400"
				>
					{isFetchingNextPage
						? "Loading more rooms..."
						: "No more rooms to load"}
				</div>
			</div>
		</div>
	);
}
