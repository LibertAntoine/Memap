


var mce_autoSave = {
    save(comp, content) {
        comp.$http.put('http://localhost:3000/document/', 
        {
          'content' : content,
          'uuid' : comp.uuid
        }
        ,{
           headers: {
             'Authorization': 'Bearer test_TOKEN123'
           }
         }).then(
         () => {
            comp.update = true;
         }, 
         (response) => {
           console.log("error", response)
         })
    }
}




export default mce_autoSave;