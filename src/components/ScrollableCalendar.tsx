"use client";

import React, { useEffect, useRef, useState } from "react";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { useVirtualizer } from "@tanstack/react-virtual";
import { COLUMN_WIDTH_LARGE, COLUMN_WIDTH_MEDIUM, COLUMN_WIDTH_SMALL } from "@/app/constants/column-width";

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
  const [columnWidth, setColumnWidth] = useState(COLUMN_WIDTH_LARGE);
	const isScrolling = useRef(false);

	// Add resize handler
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 425) {
				// sm breakpoint
				setColumnWidth(COLUMN_WIDTH_SMALL);
			} else if (window.innerWidth <= 768) {
				// md breakpoint
				setColumnWidth(COLUMN_WIDTH_MEDIUM);
			} else {
				setColumnWidth(COLUMN_WIDTH_LARGE);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		// Cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Setup virtualizer
	const virtualizer = useVirtualizer({
		count: dates.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => columnWidth,
		horizontal: true,
		overscan: 0,
	});

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

const DateCell = ({date}: {date: Date}) => {
	return (
		<div className="text-center min-w-small md:min-w-medium lg:min-w-large h-full block border-[0.5px] border-slate-400 dark:border-slate-600 py-2">
			<p className="text-sm font-semibold">{format(date, "MMM")}</p>
			<p className="text-lg font-bold">{format(date, "dd")}</p>
		</div>
	);
}
