// Very basic FCPXML builder for timeline handoffs
export function generateFCPXML(projectName: string, tracks: any[], fps: number = 30): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
	<resources>
		<format id="r1" name="FFVideoFormat1080p${fps}" frameDuration="1/${fps}s" width="1920" height="1080"/>
	</resources>
	<library>
		<event name="Dreamy Exports">
			<project name="${projectName}">
				<sequence format="r1" tcStart="0s" tcFormat="NDF">
					<spine>
						${tracks.map(track => `<clip name="DreamyClip" duration="10s" start="0s"/>`).join("\\n")}
					</spine>
				</sequence>
			</project>
		</event>
	</library>
</fcpxml>`;
}
