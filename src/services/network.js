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
	}
}

