
// Id will be taken from the search params which is inside the query string
export default function Details({params} : {params : {id: string}})
{
	  return(
			<div>
				  Details for {params.id}
			</div>
	  )
}