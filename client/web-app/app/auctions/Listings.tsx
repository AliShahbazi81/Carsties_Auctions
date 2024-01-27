'use client'

import AuctionCard from "@/app/auctions/AuctionCard";
import AppPagination from "@/app/components/AppPagination";
import {useEffect, useState} from "react";
import {getData} from "@/app/actions/auctionActions";
import Filters from "@/app/auctions/Filters";
import {useParamsStore} from "@/hooks/useParamsStore";
import {shallow} from "zustand/shallow";
import qs from 'query-string';
import EmptyFilter from "@/app/components/EmptyFilter";
import {useAuctionStore} from "@/hooks/useAuctionStore";

// Do not forget that we cannot use async and await while we are using useEffect hook.
// If forgotten, the browser will hang 
export default function Listings() {
	  const [loading, setLoading] = useState(true)
	  const params = useParamsStore(state => ({
			pageNumber: state.pageNumber,
			pageSize: state.pageSize,
			searchTerm: state.searchTerm,
			orderBy: state.orderBy,
			filterBy: state.filterBy,
			seller: state.seller,
			winner: state.winner
	  }), shallow)
	  const data = useAuctionStore(state => ({
			auctions: state.auctions,
			totalCount: state.totalCount,
			pageCount: state.pageCount
	  }), shallow)
	  const setData = useAuctionStore(state=> state.setData)
	  const setParams = useParamsStore(state => state.setParams);
	  const url = qs.stringifyUrl({url: '', query: params});

	  function setPageNumber(pageNumber: number) {
			setParams({pageNumber})
	  }

	  // useEffect -> Do side effect when this component loads
	  useEffect(() => {
			getData(url).then(data => {
				  setData(data);
				  setLoading(false)
			})
			// Dependencies mean -> Whenever the pageNumber changes, the useEffect will be run again
	  }, [url]);

	  if (loading)
			return <h3>Loading...</h3>

	  return (
			<>
				  <Filters/>
				  {data.totalCount === 0 ? (
							  <EmptyFilter showReset/>) :
						<>
							  <div className={"grid grid-cols-4 gap-6"}>
									{data.auctions.map(auction => (
										  <AuctionCard auction={auction} key={auction.id}/>
									))}
							  </div>
							  <div className={'flex justify-center mt-4'}>
									<AppPagination
										  currentPage={params.pageNumber}
										  pageCount={data.pageCount}
										  pageChanged={setPageNumber}
									/>
							  </div>
						</>
				  }
			</>
	  )
}