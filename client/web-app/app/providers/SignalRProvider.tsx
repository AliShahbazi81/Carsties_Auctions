'use client'
import {ReactNode, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/hooks/useAuctionStore";
import {useBidStore} from "@/hooks/useBidStore";
import {Bid} from "@/types";


type Props = {
	  children: ReactNode
}

export default function SignalRProvider({children}: Props)
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
							  
							  connection.on("BidPlaced", (bid: Bid) => {
									console.log("Bid Placed even received");
									if (bid.bidStatus.includes('Accepted'))
									{
										  setCurrentPrice(bid.auctionId, bid.amount);
									}
									// For real time showing the bids in detailed page of the cars
									addBid(bid);
							  });
						}).catch(error => console.log(error))
				  
				  // If we want to stop the connection, we have to return, so that if the user closes the browser or changes the window, the connection will stop
				  return() => {
						// When component dispose, stop the connection
						connection?.stop(
						)
				  }
			}
	  }, [connection, setCurrentPrice])
	  
	  return(
			children
	  )
}