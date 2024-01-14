import {create} from "zustand";

type State = {
	  pageNumber: number
	  pageSize: number
	  pageCount: number
	  searchValue: string
	  searchTerm: string
	  orderBy: string
	  filterBy: string
}

type Actions = {
	  // To update states in the type above
	  // To partially update a state - means not updating all of them - we specify Partial
	  setParams: (params: Partial<State>) => void
	  setSearchValue: (value: string) => void
	  reset: () => void
}

const initialState: State = {
	  pageNumber: 1,
	  pageSize: 12,
	  pageCount: 1,
	  searchValue: '',
	  searchTerm: '',
	  orderBy: 'make',
	  filterBy: 'live'
}

export const useParamsStore = create<State & Actions>()((set) => ({
	  ...initialState,

	  setParams: (newParams: Partial<State>) => {
			set((state) => {
				  if (newParams.pageNumber) {
						return {...state, pageNumber: newParams.pageNumber}
				  } else {
						// When user was in the last page, with changing the page size, it used to not show the result
						// Using the code down below, that error is gone now
						return {...state, ...newParams, pageNumber: 1}
				  }
			})
	  },

	  // For resting the state
	  reset: () => set(initialState),
	  
		// When resenting the params, the input field of the search has to be reset as well.
	  setSearchValue: (value: string) => {
			set({searchValue: value})
	  }
}))