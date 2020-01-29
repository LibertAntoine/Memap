// initial state
const state = {
	updatedList: []
}

// getters
const getters = {
	isNeuronUpdated(state, uuid) {
		return state.updatedList.includes(uuid);
	},
}

// actions
const actions = {
	/*
	getNeuronNetwork({ commit, state }) {

		/*
				commit('setParents', parents);
				commit('setChildren', children);
				commit('setFriends', friends);
			}
			*/
}

// mutations
const mutations = {
	addToUpdated(state, uuid) {
		state.updatedList(uuid);
	},
	removeFromUpdated(state, uuid) {
		state.updatedList = state.updatedList( currentUUID => { return currentUUID !== uuid } )
	}
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
