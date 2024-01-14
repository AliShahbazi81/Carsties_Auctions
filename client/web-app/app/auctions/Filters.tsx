'use client'

import {Button, ButtonGroup} from "flowbite-react";
import {useParamsStore} from "@/hooks/useParamsStore";
import {AiOutlineClockCircle, AiOutlineSortAscending} from "react-icons/ai";
import {BsFillStopCircleFill} from "react-icons/bs";
import React from "react";

const pageSizeButtons = [4, 8, 12];
// For ordering purposes
const orderButtons = [
	  {
			label: 'Alphabetical',
			icon: AiOutlineSortAscending,
			value: 'make'
	  },{
			label: 'End date',
			icon: AiOutlineClockCircle,
			value: 'endingSoon'
	  },{
			label: 'Recently added',
			icon: BsFillStopCircleFill,
			value: 'new'
	  }
]
export default function Filters()
{
	  const pageSize = useParamsStore(state => state.pageSize)
	  const setParams = useParamsStore(state => state.setParams)
	  const orderBy = useParamsStore(state => state.orderBy)
	  return(
			<div className={'flex justify-between items-center mb-4'}>
				  
				  <div>
						<span className={'uppercase text-sm text-gray-500 mr-2'}>
							  Order by
						</span>
						<Button.Group>
							  {orderButtons.map(({label, icon: Icon,  value}) => (
									<Button 
										  className={'focus:ring-0'}
										  key={value}
										  onClick={() => setParams({orderBy: value})}
										  color={`${orderBy === value ? 'red' : 'green'}`}
									>
										  <Icon className={'mr-3 h-4 w-4'} />
										  {label}
									</Button>
							  ))}
						</Button.Group>
				  </div>
				  <div>
						<span className={'uppercase text-sm text-gray-500 mr-2'}>
							  Page Size
						</span>
						<ButtonGroup>
							  {pageSizeButtons.map((value, i) => (
									<Button 
										  key={i} 
										  onClick={() => setParams({pageSize: value})}
										  color={`${pageSize === value ? 'red': 'gray'}`}
										  className={'focus:ring-0'}
									>
										  {value}
									</Button>
							  ))}
						</ButtonGroup>
				  </div>
			</div>
	  )
}