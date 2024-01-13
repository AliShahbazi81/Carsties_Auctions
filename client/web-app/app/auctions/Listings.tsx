'use client'

import AuctionCard from "@/app/auctions/AuctionCard";
import AppPagination from "@/app/components/AppPagination";
import {useEffect, useState} from "react";
import {Auction} from "@/types";
import {getData} from "@/app/actions/auctionActions";
import Filters from "@/app/auctions/Filters";

// Do not forget that we cannot use async and await while we are using useEffect hook.
// If forgotten, the browser will hang 
export default function Listings() {
	  const [auctions, setAuctions] = useState<Auction[]>([]);
	  const [pageCount, setPageCount] = useState(0);
	  const [pageNumber, setPageNumber] = useState(1);
	  const [pageSize, setPageSize] = useState(4);

	  // useEffect -> Do side effect when this component loads
	  useEffect(() => {
			getData(pageNumber, pageSize).then(data => {
				  // Retrieve the auction from returned data
				  setAuctions(data.results);
				  // Retrieve the page count from the returned data
				  // Remember, that we are sending the page count as the result after a successful request to the server 
				  setPageCount(data.pageCount);
			})
			// Dependencies mean -> Whenever the pageNumber changes, the useEffect will be run again
	  }, [pageNumber, pageSize]);
	  
	  if (auctions.length === 0) 
			return <h3>Loading...</h3>
	  return (
			<>
				  <Filters pageSize={pageSize} setPageSize={setPageSize} />
				  <div className={"grid grid-cols-4 gap-6"}>
						{auctions.map(auction => (
							  <AuctionCard auction={auction} key={auction.id}/>
						))}
				  </div>
				  <div className={'flex justify-center mt-4'}>
						<AppPagination 
							  currentPage={1} 
							  pageCount={pageCount} 
							  pageChanged={setPageNumber}
						/>
				  </div>
			</>
	  )
}