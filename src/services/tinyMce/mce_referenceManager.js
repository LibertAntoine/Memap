import reference from '../reference.js';
import searchWindow from './refSearchWindow.js';
import $ from 'jquery'

var comp;
var loadGif = require('@/assets/loader.gif');


var mce_referenceManager = {
        checkRef : async function() {
            let urlRegex = /(https?:\/\/[a-z0-9A-Z/:%_+.,?!@&=-]+)#([a-z0-9A-Z/:%_+.,?!@&=-]+)/g;
            var refs = [...comp.content.matchAll(urlRegex)];
            for (const ref of refs) {
              var loader = comp.$refs.tm.editor.dom.create('img', {'src' : loadGif, 'height' : '100'})
              let element = comp.$refs.tm.editor.dom.$('p:contains("' + ref[0] + '")')
              element.replaceWith(loader);
              let data;
              if(ref[0].match(window.location.origin + '/Document/')) { 
                let refRegex = /\/([a-z0-9A-Z:%_+.,?!@&=-]+)#/;
                var idPageRef = ref[0].match(refRegex);
                data = await reference.getInternRef(comp.uuid, ref[1], idPageRef[1], ref[2]);
              } else {
                data = await reference.getExternRef(comp.uuid, ref[1], ref[2]);
              }
              mce_referenceManager.addReference(loader, ref, data);
            }
        },
        addReference: function (loader, ref, data) {
            var reference;
            if(data.state == 'noUrl') {
              reference = createNoUrlRef(ref, data)
            } else if (data.state == 'noIdRef') {
              reference = createNoIdRef(ref, data)
            } else {
              reference = createRef(ref, data)
            }
            loader.replaceWith(reference);
            comp.submit()
        },
        addRefPlugin: function(component) {
            comp = component;
            comp.$refs.tm.editor.editorManager.PluginManager.add('reference', (editor) => {
                var openDialog = () => {
                return editor.windowManager.open(searchWindow(editor, comp, this))
            }

            editor.ui.registry.addButton('reference', {
                text: 'Reference',
                onAction: function () {
                  // Open window
                openDialog();
            }
            })

              // Adds a menu item, which can then be included in any menu via the menu/menubar configuration
             editor.ui.registry.addMenuItem('reference', {
            text: 'Reference plugin',
            onAction: function() {
            // Open window
            openDialog();
            }
        });
        
        
            return {
            getMetadata: function () {
              return  {
                name: "Reference plugin",
                url: "http://exampleplugindocsurl.com"
              };
            }
            };
             })
          }
}

function createNoUrlRef(ref, data) {
    return comp.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noUrl mceNonEditable', 'contenteditable' : 'false'}, data.message)
}
  
function createNoIdRef(ref, data) {
    return comp.$refs.tm.editor.dom.create('ref', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noIdRef mceNonEditable', 'contenteditable' : 'false'}, data.message) 
}

function createRef(ref, data) {
    
            var urlDisplay = comp.$refs.tm.editor.dom.create('div', {'class' : 'urldisplay no-hover'}, '<p class="urlButton"></p>');
            var urlLink = comp.$refs.tm.editor.dom.create('button', {'class' : 'ui button refSource refButton'}, '#' + ref[1]);
            var suppButton = comp.$refs.tm.editor.dom.create('button', {'class' : 'ui button refSupButton refButton'}, '<i class="x icon"></i>');
            
            if(comp.$refs.tm.editor.mode.isReadOnly() == true) {
              $(suppButton).hide()
            }

            comp.$refs.tm.editor.dom.bind(suppButton, 'click', (e) => {
              e.toElement.parentNode.parentNode.parentNode.parentNode.remove();
            });
            comp.$refs.tm.editor.dom.bind(urlLink, 'click', () => {window.open(ref[0])
            });
            urlDisplay.firstChild.appendChild(urlLink);
            urlDisplay.firstChild.appendChild(suppButton);
            
            var visionDisplay = comp.$refs.tm.editor.dom.create('div', {'class' : ' versionDisplay no-hover'});
            var referencetext = comp.$refs.tm.editor.dom.create('div', {'class' : 'referenceText'}, data.content);
            var referenceContent = comp.$refs.tm.editor.dom.create('div', {'data-refurl' : ref[1], 'data-refid' : ref[2], 'class': 'mce ref mceNonEditable', 'contenteditable' : 'false'})
            var referenceEnd = comp.$refs.tm.editor.dom.create('div', {'class' : 'refEnd'})
            comp.$refs.tm.editor.dom.bind(referenceContent, 'mouseenter', (e) => {
              e.toElement.childNodes[0].classList.toggle('no-hover');
              e.toElement.childNodes[1].classList.toggle('no-hover');
            });
            comp.$refs.tm.editor.dom.bind(referenceContent, 'mouseleave', (e) => {
              e.fromElement.childNodes[0].classList.toggle('no-hover');
              e.fromElement.childNodes[1].classList.toggle('no-hover');
            });

            if(!data.updated) {
                visionDisplay.classList.add('blue');
            } else {
                visionDisplay.classList.add('orange');
                comp.$refs.tm.editor.dom.bind(visionDisplay, 'click', () => {
                    comp.$refs.tm.editor.windowManager.open({
                  title: 'Versionning de référence', 
                  size:'large'
                  ,
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
                  onSubmit: (api) => {
                    if(api.getData().checkboxNew == true) {
                        comp.$http.put('http://localhost:3000/reference/', 
                              {
                                'url' : ref[1],
                                'idRef': ref[2],
                                'content': '<div>' + data.content + '</div>',
                                'uuidPage' : comp.uuid
                              }
                              ,{
                                  headers: {
                                    'Authorization': 'Bearer test_TOKEN123'
                                  }
                                }).then(
                                  () => {
                                    visionDisplay.classList.add('blue');
                                    visionDisplay.classList.remove('orange');
                                    comp.$refs.tm.editor.dom.unbind(visionDisplay, 'click');
                                    api.close();
                                  }, 
                                  (response) => {
                                    console.log("error", response)
                                  }
                                )
                    } else {
                        comp.$http.post('http://localhost:3000/reference/delete', 
                              {
                                'url' : ref[1],
                                'idRef': ref[2],
                                'uuidPage' : comp.uuid
                              }
                              ,{
                                  headers: {
                                    'Authorization': 'Bearer test_TOKEN123'
                                  }
                                }).then(
                                  () => {
                                    var originalBlock = comp.$refs.tm.editor.dom.create('div', {}, data.cache);

                                    referenceContent.replaceWith(originalBlock)
                                    console.log('coucou')
                                    api.close();
                                  }, 
                                  (response) => {
                                    console.log("error", response)
                                  }
                                )
                    } 
                  },
                  onChange: function (api, change) {
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
                  
                })
                });
            }
            referenceContent.appendChild(urlDisplay);
            referenceContent.appendChild(visionDisplay);
            referenceContent.appendChild(referencetext);
            referenceContent.appendChild(referenceEnd);

            return referenceContent;
     }


 




export default mce_referenceManager;