import Api from './Api';
export default {
	getInternRef(uuidPage, url, idPageRef, idRef) {
		return new Promise((resolve, reject) => {
		Api().post(`/reference/intern`, {
            uuidPage, url, idPageRef, idRef
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
    getExternRef(uuidPage, url, idRef) {
		return new Promise((resolve, reject) => {
		Api().post(`/reference`, {
            uuidPage, url, idRef
        })
			.then(response => {
				resolve(response.data)
			})
			.catch(err => {
				console.log(err);
				reject(err)
			});
		})
	}
}

