"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { DATE_RANGE_COUNT } from "@/constants/date-range";

export function DatePickerWithRange({
	className,
}: React.HTMLAttributes<HTMLDivElement>) {

	const [date, setDate] = React.useState<DateRange | undefined>({
		from: new Date(),
		to: addDays(new Date(), DATE_RANGE_COUNT),
  });


  const router = useRouter();
  const searchParams = useSearchParams();
  
  const pushDateToURL = (date: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (date?.from) {
      params.set("start_date", format(date.from, "yyyy-MM-dd"));
    }
    if (date?.to) {
      params.set("end_date", format(date.to, "yyyy-MM-dd"));
    }
    router.push(`?${params.toString()}`);
  }

  useEffect(() => {
		pushDateToURL(date);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [date])

	return (
		<div className={cn("", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full md:w-[300px] justify-center text-left font-normal border border-slate-400 dark:border-slate-600",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
						disabled={{ before: new Date() }}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
