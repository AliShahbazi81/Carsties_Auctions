'use client'
import {FieldValues, useForm} from "react-hook-form";
import React, {useEffect} from "react";
import {Button, TextInput} from "flowbite-react";
import Input from "@/app/components/Input";
import DateInput from "@/app/components/DateInput";
import {createAuction, updateAuction} from "@/app/actions/auctionActions";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {usePathname, useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {Auction} from "@/types";


type Props = {
	  auction?: Auction
}
export default function AuctionForm({auction}: Props) {
	  const router = useRouter();
	  const pathname = usePathname();
	  const {
			control,
			handleSubmit,
			setFocus,
			/*In order to use AuctionForm for updating an auction, we need the reset*/
			reset,
			formState: {
				  isSubmitting,
				  isValid
			}
	  } = useForm({
			// Validation will only appear if user clicks in and out without filling out the required data in the inputs
			mode: 'onTouched'
	  })

	  useEffect(() => {
			// Check to see if we have auction. Yes -> We are updating an existing auction, No -> we are about to create one
			if (auction) {
				  // Get the properties we want to update
				  const {make, model, color, mileage, year} = auction
				  reset({make, model, color, mileage, year})
			}
			setFocus('make')
	  }, [setFocus])

	  async function onSubmit(data: FieldValues) {
			try {
				  // For updating auction
				  let id = ''
				  let res;
				  // If user is being redirected to this page using create, then they are about to create an auction
				  if (pathname === '/auctions/create') {
						res = await createAuction(data);
						id = res.id
				  } else {
						if (auction) {
							  res = await updateAuction(data, auction.id)
							  id = auction.id
						}
				  }

				  if (res.error)
						throw res.error;

				  // Push the client to the newly created auction
				  router.push(`/auctions/details/${id}`)

			} catch (error: any) {
				  toast.error(error.status + ' ' + error.message)
			}
	  }

	  return (
			<form className={'flex flex-col mt-3'} onSubmit={handleSubmit(onSubmit)}>
				  <Input label={'Make'} name={'make'} control={control} rules={{required: 'Make is required'}}/>
				  <Input label={'Model'} name={'model'} control={control} rules={{required: 'Model is required'}}/>
				  <Input label={'Color'} name={'color'} control={control} rules={{required: 'Color is required'}}/>

				  <div className={'grid grid-cols-2 gap-3'}>
						<Input label={'Year'} name={'year'} type={'number'} control={control} rules={{required: 'Year is required'}}/>
						<Input label={'Mileage'} name={'mileage'} type={'number'} control={control} rules={{required: 'Mileage is required'}}/>
				  </div>

				  {/* Since user cannot update all the properties, we make sure not to show the components down below if they are about to update  */}
				  {pathname === "/auctions/create" &&
                      <>
                          <Input label={'Image URL'} name={'imageUrl'} control={control} rules={{required: 'Image URL is required'}}/>

                          <div className={'grid grid-cols-2 gap-3'}>
                              <Input label={'Reserve Price (Enter 0 if no reserve)'} name={'reservePrice'} type={'number'} control={control} rules={{required: 'Reserve Price is required'}}/>
                              <DateInput
                                  label={'Auction end date/time'}
                                  name={'auctionEnd'} type={'date'}
                                  control={control}
                                  rules={{required: 'End date is required'}}
                                  dateFormat={'dd MMMM yyyy h:mm a'}
                                  showTimeSelect
                              />
                          </div>
                      </>}

				  <div className={'flex justify-between'}>
						<Button
							  outline
							  color={'gray'}
						>
							  Cancel
						</Button>
						<Button isProcessing={isSubmitting}
								disabled={!isValid}
								type={'submit'}
								outline
								color={'success'}>
							  Submit
						</Button>
				  </div>
			</form>
	  )
}