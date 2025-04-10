import { BlockNoteView } from "@blocknote/mantine";
import type { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNoteWithLiveblocks, FloatingComposer, AnchoredThreads, FloatingThreads } from "@liveblocks/react-blocknote";
import { useThreads } from "@liveblocks/react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import VersionsDialog from "../dialogs/version-history-dialog";
import NotificationsPopover from "../popovers/notifications-popover";

interface TextEditorProps {
	initialContent?: string;
	// onMount: ()=> void;
}

export default function TextEditor({ initialContent }: TextEditorProps) {
	const editor = useCreateBlockNoteWithLiveblocks({}, { mentions: true, initialContent });

	return (
		<div className="relative min-h-screen flex flex-col">
			<div className="h-[60px] flex items-center justify-end px-4 border-b border-border/80 bg-background">
				<VersionsDialog editor={editor as any} />
				<NotificationsPopover />
			</div>
			<div className="border-b border-border/80 bg-background" />
			<div className="relative flex flex-row justify-between w-full py-16 xl:pl-[250px] pl-[100px] gap-[50px]">
				<div className="relative flex flex-1 flex-col gap-2">
					<BlockNoteView theme="light" editor={editor} className="w-[800px]" />
					<FloatingComposer editor={editor as any} className="w-[350p]" />
				</div>

				<div className="xl:[&:not(:has(.lb-tiptap-anchored-threads))]:pr-[200px] [&:not(:has(.lb-tiptap-anchored-threads))]:pr-[50px]">
					<Threads editor={editor as any} />
				</div>
			</div>
		</div>
	);
}

function Threads({ editor }: { editor: BlockNoteEditor | null }) {
	const { threads } = useThreads();
	const isMobile = useIsMobile();

	if (!threads || !editor) {
		return null;
	}

	return isMobile ? <FloatingThreads threads={threads} editor={editor} /> : <AnchoredThreads threads={threads} editor={editor} className="w-[350px] xl:mr-[100px] mr-[50px]" />;
}
