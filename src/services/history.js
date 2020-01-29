import Api from './Api';

export default {
	getLast5VisitedNeurons() {
		return new Promise((resolve, reject) => {
			Api().get(`/history`)
				.then(response => {
					resolve( response.data )
				})
				.catch(err => {
					console.log(err);
					reject(err);
				});
		})
	}
}

