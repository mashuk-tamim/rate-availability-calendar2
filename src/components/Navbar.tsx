import Image from "next/image";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export default function Navbar() {
	return (
		<nav>
			<div className="max-w-7xl mx-auto flex justify-between items-center p-4">
				<div>
					<Image
						src="/grit_logo_black.svg"
						alt="logo"
						width={100}
						height={50}
					/>
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<Button variant="outline">LOGIN</Button>
				</div>
			</div>
		</nav>
	);
}
