'use server'

import {Auction, PagedResult} from "@/types";

export async function getData(query: string): Promise<PagedResult<Auction>> {
	  // Fetch and catch returned data from the server side
	  // Gateway address
	  const res = await fetch(`http://localhost:6001/search${query}`)

	  if (!res.ok)
			throw new Error("Failed to fetch data!")

	  return res.json();
}