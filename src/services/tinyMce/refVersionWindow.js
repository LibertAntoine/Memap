
import reference from '../reference.js'

var data;
var ref;
var comp;
var visionDisplay;
var referenceContent;

export default function(r, d, c, v, rc) {
    ref = r;
    data = d;
    comp = c;
    visionDisplay = v
    referenceContent = rc
    return body();
}


var body =  () => {
    return {
    title: 'Versionning de référence', 
    size:'large',
    body: {
      type: 'panel',
      items: [
        {
            type: 'checkbox', // component type
            name: 'checkboxNew', // identifier
            label: 'Conserver la nouvelle version', // text for the label
            disabled: false // disabled state
        }, {
            type: 'htmlpanel', // A HTML panel component
            label: 'Nouvelle Version',
            name: 'NewVersion',
            class: 'htmlContent',
            html: data.content
        },
        {
            type: 'checkbox', // component type
            name: 'checkboxCache', // identifier
            label: 'Garder la version d\'origine (passer le contenu en original)', // text for the label
            disabled: false // disabled state
        },{
            type: 'htmlpanel', // A HTML panel component
            label: 'Version d\'origine',
            name: 'Cache Version',
            class: 'htmlContent',
            html: data.cache
        }
      ]
    },
    buttons: [
      {
        type: 'cancel',
        text: 'Annuler'
      },
      {
        type: 'submit',
        text: 'Ajouter',
        name: 'submit',
        primary: true
      }
    ],
    onSubmit: submit,
    onChange: change
  }
}

var submit = async (api) => {
    if(api.getData().checkboxNew == true) {
        await reference.updateRef(ref[1], ref[2], '"' + data.content + '"', comp.uuid)
        visionDisplay.classList.add('blue');
        visionDisplay.classList.remove('orange');
        comp.$refs.tm.editor.dom.unbind(visionDisplay, 'click');
    } else {
        await reference.deleteRef(ref[1], ref[2], comp.uuid);
        var originalBlock = comp.$refs.tm.editor.dom.create('div', {}, data.cache);
        referenceContent.replaceWith(originalBlock)
    } 
    api.close();
}


var change = (api, change) => {
    if (change.name == 'checkboxNew') {
        if(api.getData().checkboxNew == true) {
          api.setData({checkboxNew:true, checkboxCache:false})
        } else {
          api.setData({checkboxNew:false, checkboxCache:true})
        }
    }
    if (change.name == 'checkboxCache') {
        if (api.getData().checkboxCache == true) {
            api.setData({checkboxNew:false, checkboxCache:true})
        } else {
            api.setData({checkboxNew:true, checkboxCache:false})
        }
    }
}