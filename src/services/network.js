import Api from './Api';

export default {
	/* NOTE: Getting center neuron */ 
	getNeuronNetwork(centerUUID) {
		return new Promise((resolve, reject) => {
			/* NOTE: Getting surrounding */ 
			Api().get(`/network/around/${ centerUUID }`)
				.then(response => {
					const parents = response.data.filter(neuron => {
						if (neuron.relationship_type === "IS_PARENT" && neuron.from !== centerUUID) {
							return neuron;
						}
					});
					const children = response.data.filter(neuron => {
						if (neuron.relationship_type === "IS_PARENT" && neuron.from === centerUUID) {
							return neuron;
						}
					});
					const friends = response.data.filter(neuron => {
						if (neuron.relationship_type == "IS_FRIEND") {
							return neuron;
						}
					});
					resolve({ parents, children, friends })
				})
				.catch(err => {
					console.log(err);

					reject(err);
				});
		})
	},
	getSelectedNeurons() {
		return new Promise((resolve, reject) => {
			/* NOTE: Getting surrounding */ 
			Api().get(`/network/selected`)
				.then(response => {
					resolve( response.data )
				})
				.catch(err => {
					console.log(err);
					reject(err);
				});
		})
	},
	createRelationship(type, from, to) {
		return new Promise((resolve, reject) => {
			Api().post('/network', {
				type,
				uuidFrom: from,
				uuidTo: to
			})
			.then(response => {
				resolve(response)
			})
			.catch(err => {
				console.log(err);
				reject(err)
			});
		})
	},
	deleteRelationship(type, from, to) {
		return new Promise((resolve, reject) => {
		Api().delete(`/network`,
			{ 
				data: {
					type: type,
					uuidFrom: from,
					uuidTo: to
				}
			})
			.then(response => {
				resolve(response)
			})
			.catch(err => {
				console.log(err);
				reject(err)
			});
		})
	}
}

