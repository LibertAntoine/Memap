import Api from './Api';
export default {
	getInternRef(uuidPage, url, idPageRef, idRef) {
		return new Promise((resolve, reject) => {
		Api().post(`/reference/intern`, {
            uuidPage, url, idPageRef, idRef
        })
			.then(response => {
				resolve(response.data)
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
    },
    getPage(uuidPage, url) {
		return new Promise((resolve, reject) => {
		Api().post(`/reference/page`, {
            uuidPage, url
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
	updateRef(url, idRef, content, uuidPage) {
		return new Promise((resolve, reject) => {
		Api().put(`/reference`, {
            url, idRef, content, uuidPage
        })
			.then(response => {
				resolve(response);
			})
			.catch(err => {
				console.log(err);
				reject(err)
			});
		})
	},
	deleteRef(url, idRef, uuidPage) {
		return new Promise((resolve, reject) => {
		Api().post(`/reference/delete`, {
            url, idRef, uuidPage
        })
			.then(response => {
				resolve(response);
			})
			.catch(err => {
				console.log(err);
				reject(err)
			});
		})
    } 
}

