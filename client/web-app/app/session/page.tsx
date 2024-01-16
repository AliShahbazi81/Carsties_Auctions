import {getSession} from "@/app/actions/authActions";
import Heading from "@/app/components/Heading";

export default async function page()
{
	  const session = await getSession();
	  return(
			<div>
				  <Heading title={'Session Dashboard'} />
				  <div className={'bg-blue-200 border-2 border-blue-500'}>
						<h3 className={'text-lg '}>
							  Session data
						</h3>
						<pre>
							  {JSON.stringify(session,  null, 2)}
						</pre>
				  </div>
			</div>
	  )
}