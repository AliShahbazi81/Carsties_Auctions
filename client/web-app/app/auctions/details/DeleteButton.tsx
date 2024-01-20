'use client'
import {useState} from "react";
import {Button} from "flowbite-react";
import {useRouter} from "next/navigation";
import {deleteAuction} from "@/app/actions/auctionActions";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import toast from "react-hot-toast";


type Props = {
	  id: string
}
export default function DeleteButton({id}: Props) {
	  const [loading, setLoading] = useState(false);
	  // Need router, when the user deletes the auction, they should be redirected since the auction is not existed anymore
	  const router = useRouter();

	  function doDelete() {
			setLoading(true)
			deleteAuction(id)
				  .then(res => {
						if (res.error) throw res.error;

						router.push('/')
				  }).catch(error => {
				  toast.error(error.status + ' ' + error.message)
			}).finally(() => setLoading(false))
	  }

	  return (
			<Button
				  color={"failure"}
				  isProcessing={loading}
				  onClick={doDelete}
			>
				  Delete Auction
			</Button>
	  )
}