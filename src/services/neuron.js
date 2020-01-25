import Api from './Api';

export default {
	/* NOTE: Getting neuron by UUID */ 
	getNeuron(uuidNeuron) {
		return new Promise((resolve, reject) => {
		Api().get(`/neuron/${uuidNeuron}`)
			.then(response => {
				resolve(response.data.neuron)
			})
			.catch(err => {
				console.log(err);
				reject(err)
			});
		})
	},
	removeTag(uuidNeuron, tagName) {
		return new Promise((resolve, reject) => {
		Api().delete(`/neuron/${uuidNeuron}`,
			{ 
				data: {
					tag: tagName
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
	},
	renameNeuron(uuidNeuron, newName) {
		return new Promise((resolve, reject) => {
		Api().patch(`/neuron/${uuidNeuron}`,
			{
				name: newName
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
	toggleSelection(uuidNeuron) {
		return new Promise((resolve, reject) => {
		Api().put(`/neuron/${uuidNeuron}/toggleselect`)
			.then(response => {
				resolve(response)
			})
			.catch(err => {
				console.log(err);
				reject(err)
			});
		})
	},
	toggleFavorite(uuidNeuron) {
		return new Promise((resolve, reject) => {
		Api().put(`/neuron/${uuidNeuron}/togglefavorite`)
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

