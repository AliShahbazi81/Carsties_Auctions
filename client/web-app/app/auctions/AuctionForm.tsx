'use client'
import {FieldValues, useForm} from "react-hook-form";
import React, {useEffect} from "react";
import {Button, TextInput} from "flowbite-react";
import Input from "@/app/components/Input";
import DateInput from "@/app/components/DateInput";

export default function AuctionForm() {
	  const {
			control,
			handleSubmit,
			setFocus,
			formState: {
				  isSubmitting,
				  isValid,
				  isDirty,
				  errors
			}
	  } = useForm({
			// Validation will only appear if user clicks in and out without filling out the required data in the inputs
			mode: 'onTouched'
	  })

	  useEffect(() => {
			setFocus('make')
	  }, [setFocus])

	  function onSubmit(data: FieldValues) {
			console.log(data)
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