import { Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { SuggestionDTO } from "../../../DTO/SuggestionDTO.ts";
import { getPendingRequests } from "../../../api/ConnectionAPI.ts";
import { StatusCodes } from "http-status-codes";
import { errorMessageService } from "../../../contexts/ErrorMessageService.ts";
import RequestCard from "./RequestCard.tsx";

function RequestBody({ currentlySelected }: { currentlySelected: string }) {
	const [requests, setRequests] = useState<SuggestionDTO[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setRequests([]);
		setPage(0);
		setHasMore(true);
	}, [currentlySelected]);

	const fetchConnectionRequests = async (pageNumber: number) => {
		setLoading(true);
		const response = await getPendingRequests(pageNumber);
		setLoading(false);

		if (response.status === StatusCodes.OK) {
			if (response.data.length === 0) {
				setHasMore(false);
			} else {
				setRequests((prev) => [...prev, ...response.data]);
			}
		} else {
			errorMessageService.errorMessage(response.data);
		}
	};

	const observer = useCallback(
		(node: HTMLDivElement) => {
			if (loading) return;
			if (node) {
				const options = {
					root: null,
					rootMargin: "20px",
					threshold: 1.0,
				};
				const handleIntersection = (
					entries: IntersectionObserverEntry[],
				) => {
					if (entries[0].isIntersecting && hasMore) {
						setPage((prev) => prev + 1);
					}
				};
				const observerInstance = new IntersectionObserver(
					handleIntersection,
					options,
				);
				observerInstance.observe(node);
			}
		},
		[loading, hasMore],
	);

	useEffect(() => {
		if (currentlySelected === "requests") {
			fetchConnectionRequests(page);
		}
	}, [currentlySelected, page]);
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
				{currentlySelected === "requests" &&
					requests.map((request, index) => (
						<RequestCard key={index} request={request} />
					))}
			</div>
			{currentlySelected === "requests" && (
				<div ref={observer} className="text-center  items-center my-4">
					{loading && <Spin size="large" />}
					{!hasMore && !loading && (
						<p className="text-gray-500 mt-4">
							No more requests available
						</p>
					)}
				</div>
			)}
		</div>
	);
}

export default RequestBody;
