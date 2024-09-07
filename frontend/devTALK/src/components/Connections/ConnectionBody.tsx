import SuggestionBody from "./Suggestion/SuggestionBody.tsx";
import RequestBody from "./Request/RequestBody.tsx";
import SentBody from "./Sent/SentBody.tsx";
import MyConnectionBody from "./MyConnection/MyConnectionBody.tsx";

function ConnectionBody({ currentlySelected }: { currentlySelected: string }) {
	return (
		<div className="flex-1 bg-black text-white max-h-[calc(100vh-7rem)] md:max-h-[calc(100vh-3.75rem)] overflow-y-auto p-4">
			<SuggestionBody currentlySelected={currentlySelected} />
			<RequestBody currentlySelected={currentlySelected} />
			<SentBody currentlySelected={currentlySelected} />
			<MyConnectionBody currentlySelected={currentlySelected} />
		</div>
	);
}

export default ConnectionBody;
