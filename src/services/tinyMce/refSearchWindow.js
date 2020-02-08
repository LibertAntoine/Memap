import $ from 'jquery'

var referenceHovered;
var referenceClicked;
var url;
var editor;
var comp;
var ref;

export default function(e, c, r) {
    editor = e;
    comp = c;
    ref = r;
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
              type: 'button', // component type
              text: 'Rechercher',
              name: 'Research'
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
        onSubmit: function (api) {
          var data = api.getData();
          // Insert content when the window form is submitted
          editor.insertContent('Title: ' + data.title);
          api.close();
        },
        onAction: (api , details) => {
           url = api.getData().url;
           if(details.name == "Research") {
            comp.$http.post('http://localhost:3000/reference/page',
            {
            'uuidPage' : comp.uuid,
            'url' : api.getData().url,
            }
           ,{
              headers: {
                'Authorization': 'Bearer test_TOKEN123'
              }
            }).then(
            (response) => {
              api.redial(page2Config(response.body.content));
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
  
            }, 
            (response) => {
              console.log("error", response)
            })
           }
        }
    }    
}
  

var page2Config = (html) => { 
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
          type: 'button', // component type
          text: 'Rechercher',
          name: 'Research',

        }
        ,{
          type: 'htmlpanel', // A HTML panel component
          label: 'Page',
          name: 'Page',
          class: 'htmlContent',
          html: html,
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
    onSubmit: (api) => {
      // Insert content when the window form is submitted
      editor.insertContent(url + '#' + $(referenceClicked).attr('id'));
      ref.checkRef();
      api.close();
    }
}}
        
  
  
  
  
  
  
  
  



