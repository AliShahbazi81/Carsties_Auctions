'use server'

import {Auction, PagedResult} from "@/types";
import {fetchWrapper} from "@/lib/fetchWrapper";
import {FieldValues} from "react-hook-form";
import {revalidatePath} from "next/cache";

export async function getData(query: string): Promise<PagedResult<Auction>> {
	  return await fetchWrapper.get(`search${query}`)
}

export async function updateAuctionTest()
{
	  const data = {
			mileage: Math.floor(Math.random() * 100000) + 1
	  }
	  return await fetchWrapper.put('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c', data);
}

export async function createAuction(data: FieldValues)
{
	  return await fetchWrapper.post('auctions', data);
}

export async function getDetailedViewData(id: string) : Promise<Auction>
{
	  return await fetchWrapper.get(`auctions/${id}`)
}

export async function updateAuction(data: FieldValues, id: string)
{
	  const res = await fetchWrapper.put(`auctions/${id}`, data)
	  // revalidatePath is used when we want to re-render a page. When we update the auction, by default, it shows the previous value before updating
	  // For fixing that, we will use revalidatePath, so the page will be re-rendered
	  revalidatePath(`/auctions/${id}`)
	  return res;
}

export async function deleteAuction(id: string)
{
	  return await fetchWrapper.del(`auctions/${id}`)
}