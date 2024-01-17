
// The id of the auction that we are trying to update is stored inside the query string
export default function Update({params} : {params : {id: string}})
{
	  return(
			<div>
				  Update for {params.id}
			</div>
	  )
}