var comp

var mce_uuid = {
    init(component) {
      comp = component;

      comp.$refs.tm.editor.on('newblock', function(e) {
        e.target.dom.setAttribs(e.newBlock, {'id' : comp.$uuid.v4(), 'class' : 'mce'} );
      })

      comp.$refs.tm.editor.on('pastepostprocess', function(e) {
       let elements = e.node.getElementsByTagName("*")
        for(var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('id', comp.$uuid.v4())
        elements[i].setAttribute('class', 'mce')
        }
      })
    },
}


export default mce_uuid;