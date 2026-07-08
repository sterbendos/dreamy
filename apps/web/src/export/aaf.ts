// Very basic AAF-like XML builder for Premiere/Avid handoff. 
// True AAF is a binary format, but Adobe supports XML sequence structures.
export function generateAAFXML(projectName: string, tracks: any[], fps: number = 30): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<xmeml version="4">
	<sequence id="sequence-1">
		<name>${projectName}</name>
		<duration>1000</duration>
		<rate>
			<timebase>${fps}</timebase>
			<ntsc>FALSE</ntsc>
		</rate>
		<media>
			<video>
				<track>
					${tracks.map(track => `<clipitem><name>DreamyClip</name></clipitem>`).join("\\n")}
				</track>
			</video>
		</media>
	</sequence>
</xmeml>`;
}
