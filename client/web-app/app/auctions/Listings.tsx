'use client'

import AuctionCard from "@/app/auctions/AuctionCard";
import AppPagination from "@/app/components/AppPagination";
import {useEffect, useState} from "react";
import {Auction, PagedResult} from "@/types";
import {getData} from "@/app/actions/auctionActions";
import Filters from "@/app/auctions/Filters";
import {useParamsStore} from "@/hooks/useParamsStore";
import {shallow} from "zustand/shallow";
import qs from 'query-string';
import EmptyFilter from "@/app/components/EmptyFilter";

// Do not forget that we cannot use async and await while we are using useEffect hook.
// If forgotten, the browser will hang 
export default function Listings() {
	  const [data, setData] = useState<PagedResult<Auction>>();
	  const params = useParamsStore(state => ({
			pageNumber: state.pageNumber,
			pageSize: state.pageSize,
			searchTerm: state.searchTerm,
			orderBy: state.orderBy,
			filterBy: state.filterBy
	  }), shallow)
	  const setParams = useParamsStore(state => state.setParams);
	  const url = qs.stringifyUrl({url: '', query: params});

	  function setPageNumber(pageNumber: number) {
			setParams({pageNumber})
	  }

	  // useEffect -> Do side effect when this component loads
	  useEffect(() => {
			getData(url).then(data => {
				  setData(data)
			})
			// Dependencies mean -> Whenever the pageNumber changes, the useEffect will be run again
	  }, [url]);

	  if (!data)
			return <h3>Loading...</h3>

	  return (
			<>
				  <Filters/>
				  {data.totalCount === 0 ? (
							  <EmptyFilter showReset/>) :
						<>
							  <div className={"grid grid-cols-4 gap-6"}>
									{data.results.map(auction => (
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