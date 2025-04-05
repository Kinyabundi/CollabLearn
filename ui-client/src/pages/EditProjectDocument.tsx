import TextEditor from "@/components/editor";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import useContract from "@/hooks/use-contract";
import { TReseachItem } from "@/types/Project";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import DOMPurify from "dompurify";

const EditProjectDocument = () => {
	const { slug } = useParams();
	const [project, setProject] = useState<TReseachItem | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [documentLink, setDocumentLink] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [initialContent, setInitialContent] = useState<string>("");

	const { getResearch, getDocumentIPFSLink } = useContract();

	const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("http://localhost:4411/convert", { method: "POST", body: formData });

			if (!response.ok) {
				throw new Error("Failed to convert file");
			}
			const data = await response.json();
			const htmlContent = data.data;
			const html = DOMPurify.sanitize(htmlContent);
			setInitialContent(html);
		} catch (err) {
            toast.error("Failed to convert file");
            console.error("Error converting file:", err);
        }
	};

	useEffect(() => {
		const fetchProject = async () => {
			try {
				setLoading(true);

				const projectId = slug ? parseInt(slug) : 0;

				const rawData = await getResearch(projectId);

				setProject(rawData);
				const fileCid = rawData.fileCid;
				const ipfsHash = await getDocumentIPFSLink(fileCid);
				setDocumentLink(ipfsHash);
			} catch (error) {
				toast.error("Failed to load project");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchProject();
	}, [slug]);
	return (
		<div className="w-full mx-auto p-4 space-y-6">
			{loading ? (
				<Loading />
			) : (
				project && (
					<RoomProvider id={`document-${slug}`}>
						<ClientSideSuspense fallback={<Loading />}>
							<div className="">
								<div className="flex items-center justify-end">
									<Button
										variant="outline"
										className="mb-4"
										onClick={() => {
											if (inputRef.current) {
												inputRef.current.click();
											}
										}}>
										Import from Word
									</Button>
									<input type="file" accept=".docx" className="hidden" ref={inputRef} onChange={onFileChange} />
								</div>
								<TextEditor initialContent={initialContent} />
							</div>
						</ClientSideSuspense>
					</RoomProvider>
				)
			)}
		</div>
	);
};

export default EditProjectDocument;
