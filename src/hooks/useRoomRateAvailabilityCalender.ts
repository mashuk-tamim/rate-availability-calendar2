"use client";

import Fetch from "@/utils/Fetch";
import { RoomCalendarResponse } from "@/types/room-calendar";
import { useInfiniteQuery } from "@tanstack/react-query";

interface IParams {
  property_id: number;
  start_date: string;
  end_date: string;
  initialData?: RoomCalendarResponse;
}

// Custom hook to fetch room rate availability calendar data
export default function useRoomRateAvailabilityCalendar(params: IParams) {
	return useInfiniteQuery({
		queryKey: ["property_room_calendar", params],
		queryFn: async ({ pageParam = 0 }) => {
			const url = new URL(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/property/${params.property_id}/rate-calendar/assessment`
			);

			url.search = new URLSearchParams({
				start_date: params.start_date,
				end_date: params.end_date,
				cursor: pageParam.toString(),
			}).toString();

			const response = await Fetch<RoomCalendarResponse>({
				method: "GET",
				url,
			});
			return response;
		},
		getNextPageParam: (lastPage) => {
			return lastPage.data.nextCursor ?? undefined;
		},
		initialPageParam: 0,

		initialData: params.initialData ? {
			pages: [params.initialData],
			pageParams: [0],
		} : undefined,
	});
}
