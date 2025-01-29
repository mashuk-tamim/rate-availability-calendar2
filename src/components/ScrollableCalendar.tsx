"use client";

import React, { useEffect, useRef, useState } from "react";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { useVirtualizer } from "@tanstack/react-virtual";

interface RoomCalendarProps {
	start_date: string;
	end_date: string;
	onScroll?: (scrollOffset: number) => void;
	scrollOffset?: number;
	// id: string; // To identify which calendar triggered the scroll
}

export default function ScrollableCalendar({
	start_date,
	end_date,
	onScroll,
	scrollOffset,
	// id,
}: RoomCalendarProps) {
	const [dates, setDates] = useState<Date[]>([]);
	const parentRef = useRef<HTMLDivElement>(null);
	const isScrolling = useRef(false);

	// Setup virtualizer
	const virtualizer = useVirtualizer({
		count: dates.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 176,
		horizontal: true,
		overscan: 0,
  });
  
  // console.log(id);

	// Handle scroll from other calendar
	useEffect(() => {
		if (
			scrollOffset !== undefined &&
			!isScrolling.current &&
			parentRef.current
		) {
			parentRef.current.scrollLeft = scrollOffset;
		}
	}, [scrollOffset]);

	// Handle scroll event
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		if (!isScrolling.current) {
			isScrolling.current = true;
			onScroll?.(e.currentTarget.scrollLeft);
			setTimeout(() => {
				isScrolling.current = false;
			}, 0);
		}
	};


  useEffect(() => {
		if (start_date && end_date) {
			const startDate = parseISO(start_date);
			const endDate = parseISO(end_date);
			const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
			setDates(dateRange);
		}
	}, [start_date, end_date]);

	return (
		<div
			ref={parentRef}
			className="overflow-x-auto w-full"
			style={{ height: "80px" }}
			onScroll={handleScroll}
		>
			<div
				className="flex border rounded-sm relative h-full"
				style={{
					width: `${virtualizer.getTotalSize()}px`,
					position: "relative",
				}}
			>
				{virtualizer.getVirtualItems().map((virtualItem) => (
					<div
						key={dates[virtualItem.index].toISOString()}
						className="absolute top-0 h-full"
						style={{
							left: `${virtualItem.start}px`,
							width: `${virtualItem.size}px`,
						}}
					>
						<DateCell date={dates[virtualItem.index]} />
					</div>
				))}
			</div>
		</div>
	);
}

const DateCell = ({date}: {date: Date}) => {
	return (
		<div className="text-center min-w-44 h-full block border py-2">
			<p className="text-sm font-semibold">{format(date, "MMM")}</p>
			<p className="text-lg font-bold">{format(date, "dd")}</p>
		</div>
	)
}
