import AuctionCard from "@/app/auctions/AuctionCard";
import {Auction, PagedResult} from "@/types";

async function getData() : Promise<PagedResult<Auction>>
{
	  // Fetch and catch returned data from the server side
	  // Gateway address
	  const res = await fetch('http://localhost:6001/search?pageSize=10')
	  
	  if (!res.ok) 
			throw new Error("Failed to fetch data!")
	  
	  return res.json();
}

export default async function Listings()
{
	  const data = await getData();
	  return(
			<div className={"grid grid-cols-4 gap-6"}>
				  {data && data.results.map(auction => (
						<AuctionCard auction={auction} key={auction.id}/>
				  ))}
			</div>
	  )
}