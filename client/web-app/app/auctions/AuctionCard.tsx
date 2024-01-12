import Image from "next/image";
import CountDownTimer from "@/app/auctions/CountDownTimer";

type Props = {
	  auction: any
}

export default function AuctionCard({auction}: Props) {
	  return (
			<a href={"#"}>
				  <div className={"w-full bg-gray-200 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden"}>
						<div>
							  <Image
									className={"object-cover"}
									src={auction.imageUrl}
									alt={'Image'}
									fill
									priority
									sizes={'(max-width:768px) 100vw, (max-width: 1200px) 50vw, 25vw'}
							  />
							  <div className={'absolute bottom-2 left-2'}>
									<CountDownTimer auctionEnd={auction.auctionEnd} />
							  </div>
						</div>
				  </div>
				  <div className={"flex justify-between items-center mt-4"}>
						<h3 className={"text-gray-700"}>{auction.make} {auction.model}</h3>
						<p className={"font-semibold text-sm"}>{auction.year}</p>
				  </div>
				  
			</a>
	  )
}