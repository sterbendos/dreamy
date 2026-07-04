"use client";

export function NewsletterForm() {
	return (
		<form
			className="flex w-full max-w-sm items-center space-x-2"
			onSubmit={(e) => {
				e.preventDefault();
				const form = e.target as HTMLFormElement;
				form.reset();
			}}
		>
			<input
				type="email"
				placeholder="Email address"
				required
				className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			/>
			<button
				type="submit"
				className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shrink-0"
			>
				Subscribe
			</button>
		</form>
	);
}
