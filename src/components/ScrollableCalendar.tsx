"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useColumnWidth } from "@/hooks/useColumnWidth";


interface RoomCalendarProps {
	start_date: string;
	end_date: string;
	onScroll?: (scrollOffset: number) => void;
	scrollOffset?: number;
}

function ScrollableCalendar({
	start_date,
	end_date,
	onScroll,
	scrollOffset,
}: RoomCalendarProps) {
	const [dates, setDates] = useState<Date[]>([]);
	const parentRef = useRef<HTMLDivElement>(null);
	const isScrollingRef = useRef(false);
	const columnWidth = useColumnWidth();

	// Setup virtualizer
	const virtualizer = useVirtualizer({
		count: dates.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => columnWidth,
		horizontal: true,
		overscan: dates.length,
		scrollPaddingEnd: columnWidth * 2, // Prefetch for smooth edge scrolling
	});



	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		if (!isScrollingRef.current) {
			isScrollingRef.current = true;
			onScroll?.(e.currentTarget.scrollLeft);
			requestAnimationFrame(() => {
				isScrollingRef.current = false;
			});
		}
	};

	// In the useLayoutEffect, replace scrollTo with direct assignment:
	useLayoutEffect(() => {
		if (
			scrollOffset !== undefined &&
			!isScrollingRef.current &&
			parentRef.current
		) {
			parentRef.current.scrollLeft = scrollOffset; // Instant scroll
		}
	}, [scrollOffset]);

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
				className="flex border-[0.5px] border-slate-400 dark:border-slate-600 relative h-full"
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

const DateCell = ({ date }: { date: Date }) => {
	return (
		<div className="text-center min-w-small md:min-w-medium lg:min-w-large h-full block border-[0.5px] border-slate-400 dark:border-slate-600 py-2">
			<p className="text-sm font-semibold">{format(date, "MMM")}</p>
			<p className="text-lg font-bold">{format(date, "dd")}</p>
		</div>
	);
};

export default React.memo(ScrollableCalendar);
