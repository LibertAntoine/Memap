import Api from '../../services/Api';

// initial state
const state = {
	/*
  currentNeuronUUID: '8f712c97-87de-466d-922e-d6da230f54e2'
	*/
	parents: [],
	children: [],
	friends: [],
	centerUUID: '8f712c97-87de-466d-922e-d6da230f54e2',
	center: {}
}

// getters
const getters = {
	/*
	getNeuronNetworkAroundCurrentUUID(state) {
	}
	*/
	parents(state) {
		return state.parents;
	},
	children(state) {
		return state.children;
	},
	friends(state) {
		return state.friends;
	},
	center(state) {
		return state.center;
	},
}

// actions
const actions = {
	async getNeuronNetwork({ commit, state }) {

		/* NOTE: Getting center neuron */ 
		await Api().get(`/neuron/${ state.centerUUID }`)
			.then(response => {
				commit('setCenter', response.data);
			})
			.catch(err => {
				console.log(err);
			});

		/* NOTE: Getting surrounding */ 
		await Api().get(`/network/around/${ state.centerUUID }`)
			.then(response => {
				const parents = response.data.network.filter(neuron => {
					if (neuron.relationship_type === "IS_PARENT" && neuron.from !== state.center.neuron.neuron.properties.uuid) {
						return neuron;
					}
				});
				const children = response.data.network.filter(neuron => {
					if (neuron.relationship_type === "IS_PARENT" && neuron.from === state.center.neuron.neuron.properties.uuid) {
						return neuron;
					}
				});
				const friends = response.data.network.filter(neuron => {
					if (neuron.relationship_type == "IS_FRIEND") {
						return neuron;
					}
				});
				commit('setParents', parents);
				commit('setChildren', children);
				commit('setFriends', friends);
			})
			.catch(err => {
				console.log(err);
			});
	}
}

// mutations
const mutations = {
	setParents(state, parents) {
		state.parents = parents;
	},
	setCenter(state, center) {
		state.center = center;
	},
	setChildren(state, children) {
		state.children = children;
	},
	setFriends(state, friends) {
		state.friends = friends;
	}
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
