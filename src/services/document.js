import Api from './Api';

export default {
	getNeuronsConnectedToDocument(uuidDocument) {
		return new Promise((resolve, reject) => {
			Api().get(`/document/${ uuidDocument }/neurons/`)
				.then(response => {
					resolve( response.data )
				})
				.catch(err => {
					console.log(err);
					reject(err);
				});
		})
	},
	save(content, uuid) {
		return new Promise((resolve, reject) => {
			Api().put(`/document/`, {
				content, uuid
			})
				.then(response => {
					resolve(response)
				})
				.catch(err => {
					console.log(err);
					reject(err);
				});
		})
	}
}

