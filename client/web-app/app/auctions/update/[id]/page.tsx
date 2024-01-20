
// The id of the auction that we are trying to update is stored inside the query string
import Heading from "@/app/components/Heading";
import AuctionForm from "@/app/auctions/AuctionForm";
import {getDetailedViewData} from "@/app/actions/auctionActions";

export default async function Update({params} : {params : {id: string}})
{
	  const data = await getDetailedViewData(params.id);
	  return(
			<div>
				  <div className={'mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'}>
						<Heading title={"Update the auction"} subtitle={"Please update the details for your car"}/>
						<AuctionForm auction={data}/>
				  </div>
			</div>
	  )
}