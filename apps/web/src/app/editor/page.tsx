"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor } from "@/editor/use-editor";
import { useSession } from "@/auth/client";
import { Loader2 } from "lucide-react";

export default function EditorInitialRoute() {
	const editor = useEditor();
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const creatingRef = useRef(false);

	useEffect(() => {
		if (isPending) return;

		// If not authenticated, send to login
		if (!session) {
			router.replace("/login?returnTo=/editor");
			return;
		}

		// Authenticated users get a new project created and redirected
		async function createAndRedirect() {
			if (creatingRef.current) return;
			creatingRef.current = true;
			try {
				const projectId = await editor.project.createNewProject({
					name: "New project",
				});
				router.replace(`/editor/${projectId}`);
			} catch (error) {
				console.error("Failed to create project", error);
				router.replace("/dashboard");
			}
		}

		if (editor.project.getIsInitialized()) {
			createAndRedirect();
		} else {
			// Wait for initialization
			editor.project.loadAllProjects().then(() => {
				createAndRedirect();
			});
		}
	}, [editor, router, session, isPending]);

	return (
		<div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
			<Loader2 className="w-8 h-8 animate-spin text-primary" />
			<p className="text-muted-foreground text-sm font-medium animate-pulse">Starting editor...</p>
		</div>
	);
}
