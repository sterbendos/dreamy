export function JourneyLine({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
			{/* The Zero-JS CSS Track */}
			<div className="hidden md:flex w-16 shrink-0 relative flex-col">
				{/* The faint background track */}
				<div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/30 -translate-x-1/2" />
				
				{/* The Sticky Playhead & Trail */}
				<div className="sticky top-1/2 h-0 w-full flex justify-center z-10">
					{/* Upward glowing trail attached to the dot */}
					<div className="absolute bottom-[6px] w-[2px] h-[50vh] bg-gradient-to-t from-primary via-chart-2 to-transparent" />
					{/* The Lead Dot */}
					<div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] -translate-y-1/2" />
				</div>
			</div>

			{/* The Content */}
			<div className="flex-1 min-w-0">
				{children}
			</div>
		</div>
	);
}
