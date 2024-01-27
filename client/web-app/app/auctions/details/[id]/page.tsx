// ID will be taken from the search params which is inside the query string
import {getBidsForAuction, getDetailedViewData} from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import CountDownTimer from "@/app/auctions/CountDownTimer";
import CarImage from "@/app/auctions/CarImage";
import DetailedSpecs from "@/app/auctions/details/[id]/DetailedSpecs";
import {getCurrentUser} from "@/app/actions/authActions";
import EditButton from "@/app/auctions/details/[id]/EditButton";
import DeleteButton from "@/app/auctions/details/DeleteButton";
import BidItem from "@/app/auctions/details/[id]/BidItem";

export default async function Details({params}: { params: { id: string } }) {
	  const data = await getDetailedViewData(params.id);
	  // Check if the user is creator of the auction
	  const user = await getCurrentUser();
	  const bids = await getBidsForAuction(params.id)

	  return (
			<div>
				  <div className={'flex justify-between'}>
						<div className={'flex justify-center gap-3'}>
							  <Heading title={`${data.make} ${data.model}`}/>
							  {user?.username === data.seller && (
									<>
										  <EditButton id={data.id}/>
										  <DeleteButton id={data.id}/>
									</>
							  )}
						</div>
						<div className={'flex gap-3'}>
							  <h3 className={'text-2xl font-semibold'}>
									Time remaining:
							  </h3>
							  <CountDownTimer auctionEnd={data.auctionEnd}/>
						</div>
				  </div>
				  <div className={'grid grid-cols-2 gap-6 mt-3'}>
						{/* For car's images */}
						<div className={'w-full bg-gray-200 aspect-h-10 aspect-w-16 rounded-lg overflow-hidden'}>
							  <CarImage imageUrl={data.imageUrl}/>
						</div>
						{/*For bids contents*/}
						<div className={'border-2 rounded-lg p-2 bg-gray-100'}>
							  <Heading title={'Bids'}/>
							  {bids.map((bid) => (
									<BidItem key={bid.id} bid={bid} />
							  ))}
						</div>
				  </div>
				  {/* Table for information */}
				  <div className={'mt-3 mb-10 grid grid-cols-1 rounded-lg'}>
						<DetailedSpecs auction={data}/>
				  </div>
			</div>
	  )
}