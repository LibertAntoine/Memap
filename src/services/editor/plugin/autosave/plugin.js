import documentAPI from '@/services/document'

let refRegex = /<div [a-z0-9A-Z/:%_+.,?! @&"'=-]+ data-refurl="([a-z0-9A-Z/:%_+.,?!@&=-]+)" data-refid="([a-z0-9A-Z/:%_+.,?!@&=-]+)">[^*]+?<div class="refEnd">[^*]+?<\/div>[^*]+?<\/div>/g;
var comp
var mce_autoSave = {
    init(component) {
      comp = component;

      comp.$refs.tm.editor.on('change', function() {
        mce_autoSave.save();
      })
    },
    async save() {
      comp.update = false;
    
      if(comp.content == "") {
        comp.content = '<p id="' + comp.$uuid.v4() + '" class="mce"></p>'
      }
    
     let copyContent = comp.content;
     copyContent = copyContent.replace(refRegex, '$1#$2');
    
    await documentAPI.save(copyContent, comp.uuid)
    comp.update = true;
    }
}


export default mce_autoSave;