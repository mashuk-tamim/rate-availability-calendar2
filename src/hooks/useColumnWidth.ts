import { useState, useEffect } from "react";
import {
	COLUMN_WIDTH_LARGE,
	COLUMN_WIDTH_MEDIUM,
	COLUMN_WIDTH_SMALL,
} from "@/constants/column-width";

export function useColumnWidth() {
	const [columnWidth, setColumnWidth] = useState(COLUMN_WIDTH_LARGE);

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

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return columnWidth;
}
