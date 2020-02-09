import $ from 'jquery'
import reference from '../reference.js'

var referenceHovered;
var referenceClicked;
var url;
var editor;
var comp;
var ref;
var page = false;
var html = "";

export default function(e, c, r) {
    editor = e;
    comp = c;
    ref = r;

    var openDialog = () => {
        return editor.windowManager.open(body())
    }
    
    editor.ui.registry.addButton('reference', {
        text: 'Reference',
        onAction: function () {
            openDialog();
    }
    })

    editor.ui.registry.addMenuItem('reference', {
        text: 'Reference plugin',
        onAction: function() {
            openDialog();
    }});
}
  
var body = () => {
    return {
        title: 'Ajout d\'une référence', 
        size:'large'
        ,
        body: {
          type: 'panel',
          items: [
            {
              type: 'input',
              name: 'url',
              label: 'Url de la page à reférer',
            }, {
              type: 'button',
              text: 'Rechercher',
              name: 'Research'
            }, {
              type: 'htmlpanel', // A HTML panel component
              label: 'Page',
              name: 'Page',
              class: 'htmlContent',
              html: html,
              disable: page
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
            primary: true,
            disabled:true
          }
        ],
        onAction: action,
        onSubmit: submit
        }
    }

var submit = (api) => {
    if(page) {
        editor.insertContent(url + '#' + $(referenceClicked).attr('id'));
        ref.checkRef();
        api.close();
    }
}

var action = async (api , details) => {
    url = api.getData().url;
    var response = await reference.getPage(comp.uuid, url);
    html = response.data.content
    page = true;
    api.redial(body());
    $('.tox-dialog__body-content').find('[role=presentation]').height(400)
    $('.tox-dialog__body-content').find('[role=presentation]').css('overflow','scroll')
    //$('.tox-dialog__body-content').find('[role=presentation]').width(800)

    $('.referencing').bind("mouseover", (e) => {
        e.stopPropagation();
        if(referenceHovered && referenceHovered.classList) {
            referenceHovered.classList.toggle('referencing-hover')
        }
        referenceHovered = e.target
        while(!$(referenceHovered).hasClass('referencing')) {
            referenceHovered = $(referenceHovered).parent()
        }
        if(referenceHovered.classList) {
            referenceHovered.classList.toggle('referencing-hover')
        }
    })
    $('.referencing').bind("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        api.enable('submit')
        if(referenceClicked && referenceClicked.classList) {
            referenceClicked.classList.remove('referencing-clicked')
        }
        referenceClicked = e.target
        while(!$(referenceClicked).hasClass('referencing')) {
            referenceClicked = $(referenceClicked).parent()
        }
        if(referenceClicked.classList) {
        api.enable('submit')
        referenceClicked.classList.add('referencing-clicked')
        } else {
        api.disable('submit')
        }
    })
}




