"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [logoSrc, setLogoSrc] = useState("/grit_logo_black.svg");
  const { theme, systemTheme } = useTheme();
  
  useEffect(() => {
    // For explicit theme selection
    if (theme === "dark") {
      setLogoSrc("/grit_logo_white.svg");
    } else if (theme === "light") {
      setLogoSrc("/grit_logo_black.svg");
    } else if (theme === "system") {
      // For system theme preference
      if (systemTheme === "dark") {
        setLogoSrc("/grit_logo_white.svg");
      } else {
        setLogoSrc("/grit_logo_black.svg");
      }
    }
  }, [theme, systemTheme]);
	return (
		<nav>
			<div className="max-w-7xl mx-auto flex justify-between items-center p-4 border-x  border-slate-400 dark:border-slate-600 h-20">
				<div>
					<Image
						src={logoSrc}
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
