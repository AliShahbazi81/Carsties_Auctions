'use client'
import {ReactNode, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/hooks/useAuctionStore";
import {useBidStore} from "@/hooks/useBidStore";
import {Auction, Bid} from "@/types";
import {User} from "next-auth";
import toast from "react-hot-toast";
import AuctionCreatedToast from "@/app/components/AuctionCreatedToast";


type Props = {
	  children: ReactNode
	  user: User | null
}

export default function SignalRProvider({children, user}: Props)
{
	  // Store the connection - webSocket to backend signalR
	  const [connection, setConnection] = useState<HubConnection | null>(null)
	  const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice)
	  const addBid = useBidStore(state => state.addBid)
	  
	  useEffect(() => {
			// When the component loads, it has to connect to the backend SignalR automatically
			const newConnection = new HubConnectionBuilder()
				  // Remember we have to provide the gateway connection url not the notification service URL
				  .withUrl("http://localhost:6001/notifications")
				  .withAutomaticReconnect()
				  .build()
			
			setConnection(newConnection)
	  }, []);
	  
	  useEffect(() => {
			if (connection)
			{
				  connection.start()
						.then(() => {
							  console.log("Connected to notifications hub");
							  
							  connection.on("BidsPlaced", (bid: Bid) => {
									console.log("Bid Placed even received");
									if (bid.bidStatus.includes('Accepted'))
									{
										  setCurrentPrice(bid.auctionId, bid.amount);
									}
									// For real time showing the bids in detailed page of the cars
									addBid(bid);
							  });
							  
							  connection.on('AuctionCreated', (auction: Auction) => {
									if (user?.username !== auction.seller)
									{
										  return toast(<AuctionCreatedToast auction={auction} />, 
												{duration: 10000})
									}
							  })
							  
						}).catch(error => console.log(error))
				  
				  // If we want to stop the connection, we have to return, so that if the user closes the browser or changes the window, the connection will stop
				  return() => {
						// When component dispose, stop the connection
						connection?.stop(
						)
				  }
			}
	  }, [connection, setCurrentPrice, addBid, ])
	  
	  return(
			children
	  )
}