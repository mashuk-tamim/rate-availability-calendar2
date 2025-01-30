"use client";

import React, { useEffect, useRef, useState } from "react";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { useVirtualizer } from "@tanstack/react-virtual";
import { COLUMN_WIDTH_LARGE, COLUMN_WIDTH_MEDIUM, COLUMN_WIDTH_SMALL } from "@/app/constants/column-width";
import { RoomCategory } from "@/types/room-calendar";
import clsx from "clsx";
import { UserRound } from "lucide-react";

interface ScrollableRoomTableProps {
	roomCategory: RoomCategory;
	start_date: string;
	end_date: string;
	onScroll?: (scrollOffset: number) => void;
	scrollOffset?: number;
	showScrollbar?: boolean;
}

export default function ScrollableRoomTable({
	roomCategory,
	start_date,
	end_date,
	onScroll,
	scrollOffset,
	showScrollbar = false,
}: ScrollableRoomTableProps) {
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

	useEffect(() => {
		if (
			scrollOffset !== undefined &&
			!isScrolling.current &&
			parentRef.current
		) {
			parentRef.current.scrollLeft = scrollOffset;
		}
	}, [scrollOffset]);

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
		console.log("Room Category Data:", {
			inventory_calendar: roomCategory.inventory_calendar,
			rate_plans: roomCategory.rate_plans,
		});
	}, [roomCategory]);

	useEffect(() => {
		if (start_date && end_date) {
			const startDate = parseISO(start_date);
			const endDate = parseISO(end_date);
			const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
			setDates(dateRange);
		}
	}, [start_date, end_date]);

	const getInventoryForDate = (date: Date) => {
		const dateStr = format(date, "yyyy-MM-dd");
		const inventory = roomCategory.inventory_calendar.find(
			(inv) => inv.date.split("T")[0] === dateStr
		);
		return inventory;
	};

	const getRateForDate = (date: Date, ratePlanId: number) => {
		const dateStr = format(date, "yyyy-MM-dd");
    
		const ratePlan = roomCategory.rate_plans.find((rp) => rp.id === ratePlanId);
		const rateInfo = ratePlan?.calendar.find(
			(rate) => rate.date.split("T")[0] === dateStr
		);
		return rateInfo;
	};

	const occupancy = roomCategory.occupancy;

	return (
		<div className="flex">
			{/* Fixed left column */}
			<div className="w-[100px] md:min-w-[200px] lg:min-w-[300px]">
				<div className="grid">
					<div className="h-11 text-xs md:text-sm lg:text-base font-medium md:h-10 border-b border-r border-slate-400 dark:border-slate-600 px-1 md:px-4 flex items-center">
						Room status
					</div>
					<div className="h-11 text-xs md:text-sm lg:text-base font-medium md:h-10 border-b border-r border-slate-400 dark:border-slate-600 px-1 md:px-4 flex items-center">
						Rooms to sell
					</div>
					<div className="h-11 text-xs md:text-sm lg:text-base font-medium md:h-10 border-b border-r border-slate-400 dark:border-slate-600 px-1 md:px-4 flex items-center">
						Net booked
					</div>
					{roomCategory.rate_plans.map((ratePlan) => (
						<React.Fragment key={ratePlan.id}>
							<div className="h-16 border-b border-r border-slate-400 dark:border-slate-600 px-1 md:px-4 flex flex-col gap-0 justify-center items-start">
								<p className="text-xs md:text-sm lg:text-base font-medium">
									{ratePlan.name}
								</p>
								<div className="flex items-center gap-1">
									<UserRound className="size-3 md:size-4" />
									<p className="text-xs md:text-sm lg:text-base font-medium">
										{occupancy}
									</p>
								</div>
							</div>
							<div className="h-11 text-xs md:text-sm lg:text-base font-medium md:h-10 border-b border-r border-slate-400 dark:border-slate-600 px-1 md:px-4 flex items-center">
								Min. length of stay
							</div>
							<div className="h-11 text-xs md:text-sm lg:text-base font-medium md:h-10 border-b border-r border-slate-400 dark:border-slate-600 px-1 md:px-4 flex items-center">
								Min. advance reservation
							</div>
						</React.Fragment>
					))}
				</div>
			</div>

			{/* Scrollable content */}
			<div
				ref={parentRef}
				className={clsx(
					"overflow-x-auto flex-1",
					!showScrollbar && "scrollbar-none"
				)}
				onScroll={handleScroll}
			>
				<div
					style={{
						width: `${virtualizer.getTotalSize()}px`,
						position: "relative",
					}}
				>
					{virtualizer.getVirtualItems().map((virtualItem) => {
						const date = dates[virtualItem.index];
						const inventory = getInventoryForDate(date);
						const isDisabled = inventory?.status === false;

						return (
							<div
								key={virtualItem.key}
								className="absolute top-0"
								style={{
									left: `${virtualItem.start}px`,
									width: `${virtualItem.size}px`,
								}}
							>
								<div className="grid">
									<div
										className={clsx(
											"h-11 text-xs md:text-sm lg:text-base md:h-10 border-b border-r border-slate-400 dark:border-slate-600 text-center flex items-center justify-center",
											isDisabled
												? "bg-red-500 text-white"
												: "bg-green-700 text-white"
										)}
									>
										{inventory?.status ? "Open" : "Close"}
									</div>
									<div
										className={clsx(
											"h-11 text-xs md:text-sm lg:text-base md:h-10 border-b border-r border-slate-400 dark:border-slate-600 text-center flex items-center justify-center",
											isDisabled && "bg-red-500 text-white"
										)}
									>
										{inventory?.available ?? 0}
									</div>
									<div
										className={clsx(
											"h-11 text-xs md:text-sm lg:text-base md:h-10 border-b border-r border-slate-400 dark:border-slate-600 text-center flex items-center justify-center",
											isDisabled && "bg-red-500 text-white"
										)}
									>
										{inventory?.booked ?? 0}
									</div>
									{roomCategory.rate_plans.map((ratePlan) => {
										const rateInfo = getRateForDate(date, ratePlan.id);
										return (
											<React.Fragment key={ratePlan.id}>
												<div
													className={clsx(
														"h-16 border-b border-r border-slate-400 dark:border-slate-600 text-center flex items-center justify-center text-xs md:text-sm lg:text-base",
														isDisabled && "bg-red-500 text-white"
													)}
												>
													{rateInfo?.rate ?? "-"}
												</div>
												<div
													className={clsx(
														"h-11 text-xs md:text-sm lg:text-base md:h-10 border-b border-r border-slate-400 dark:border-slate-600 text-center flex items-center justify-center",
														isDisabled && "bg-red-500 text-white"
													)}
												>
													{rateInfo?.min_length_of_stay ?? "-"}
												</div>
												<div
													className={clsx(
														"h-11 text-xs md:text-sm lg:text-base md:h-10 border-b border-r border-slate-400 dark:border-slate-600 text-center flex items-center justify-center",
														isDisabled && "bg-red-500 text-white"
													)}
												>
													{rateInfo?.reservation_deadline ?? "-"}
												</div>
											</React.Fragment>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
