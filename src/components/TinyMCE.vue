<template>
    <div>
      <div class="edit-option" v-if="edition">
        <button class="ui button primary btn-edit-top" @click="endEdit">Terminer la modification</button>
      </div>
     <div class="edit-option" v-else>
        <button class="ui button primary btn-edit-top" @click="startEdit">Modifier le document</button>
     </div>

     <editor id="document" ref="tm"
       api-key="fhq53ixwnobrri76unqbgc0g4846l3mi4s8aj4f30vemgrar"
       :initialValue="InitalContent"
        v-model="content"
        model-events="change keydown blur focus paste"
        @onChange="submit"
        @onKeyDown="keyDown"
        @onInit="initEventEditor"
        :init="{
         setup:addRefPlugin,
         height:1000,
         menubar: true,
         content_css : '/mce_style.css, https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css',
         extended_value_elements:'+@[data-options]',
         importcss_append: true,
         plugins: [
           'advlist autolink lists link image charmap print preview anchor reference',
           'searchreplace visualblocks code fullscreen noneditable',
           'insertdatetime media table paste code help wordcount importcss'
         ],
         toolbar:
           'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help | reference',
       }"
       ></editor>
      <div class="edit-option" v-if="edition">
        <button class="ui button primary btn-edit" @click="endEdit">Terminer la modification</button>
      </div>
     <div class="edit-option" v-else>
        <button class="ui button primary btn-edit" @click="startEdit">Modifier le document</button>
     </div>
     </div>
</template>

<script>
 import Editor from '@tinymce/tinymce-vue'
 import loader from '../assets/loader.gif'
 import '../../public/mce_style.css'
 import $ from 'jquery'

 export default {
   name: 'tinymce',
   components: {
     'editor': Editor,
   },
   props:{
      InitalContent: {type: String, default: ""},
      uuid: {type: String}
   },
  data: function () {
    return {
      content: "",
      update: true,
      loader: loader,
      edition: true,
    }
  },
   created() {
     this.content = this.InitalContent;
    }, 
    mounted() {
      
    },
   methods: {
     endEdit: function () {
       this.edition = false;
       this.$refs.tm.editor.setMode('readonly');
       $('.tox-editor-header').hide()
       this.$refs.tm.editor.dom.$('.refSupButton').hide()
    },
    startEdit: function () {
       this.edition = true;
       this.$refs.tm.editor.setMode('design');
       $('.tox-editor-header').show()
       this.$refs.tm.editor.dom.$('.refSupButton').show()
    },

     submit: function () { 
       this.update = false;
        if(this.content == "") {
          this.content = '<p id="' + this.$uuid.v4() + '" class="mce"></p>'
        }

       let refRegex = /<div [a-z0-9A-Z/:%_+.,?! @&"'=-]+ data-refurl="([a-z0-9A-Z/:%_+.,?!@&=-]+)" data-refid="([a-z0-9A-Z/:%_+.,?!@&=-]+)">[^*]+?<div class="refEnd">[^*]+?<\/div>[^*]+?<\/div>/g;
       let copyContent = this.content;
       copyContent = copyContent.replace(refRegex, '$1#$2');

       this.$http.put('http://localhost:3000/document/', 
       {
         'content' : copyContent,
         'uuid' : this.uuid
       }
       ,{
          headers: {
            'Authorization': 'Bearer test_TOKEN123'
          }
        }).then(
        () => {
          this.update = true;
        }, 
        (response) => {
          console.log("error", response)
        })

    },
    keyDown: function (e) {
    if(e.keyCode === 13) {
       this.checkRef()
      }
    },

     checkRef : function () {
       
        let urlRegex = /(https?:\/\/[a-z0-9A-Z/:%_+.,?!@&=-]+)#([a-z0-9A-Z/:%_+.,?!@&=-]+)/g;
        var refs = [...this.content.matchAll(urlRegex)];
        for (const ref of refs) {
          var loader = this.$refs.tm.editor.dom.create('img', {'src' : this.loader, 'height' : '100'})
          let element = this.$refs.tm.editor.dom.$('p:contains("' + ref[0] + '")')
            element.replaceWith(loader);
          if(ref[0].match(window.location.origin + '/Document/')) { 
            this.searchIntern(loader, ref)
          } else {
            this.searchExtern(loader, ref)
          }
        }
    },

    createNoUrlRef: function (ref, response) {
      return this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noUrl mceNonEditable', 'contenteditable' : 'false'}, response.body.message)
    },
    createNoIdRef: function (ref, response) {
      return this.$refs.tm.editor.dom.create('ref', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noIdRef mceNonEditable', 'contenteditable' : 'false'}, response.body.message) 
    },
    createRef: function (ref, response) {
      var urlDisplay = this.$refs.tm.editor.dom.create('div', {'class' : 'urldisplay no-hover'}, '<p class="urlButton"></p>');
              var urlLink = this.$refs.tm.editor.dom.create('button', {'class' : 'ui button refSource refButton'}, '#' + ref[1]);
              var suppButton = this.$refs.tm.editor.dom.create('button', {'class' : 'ui button refSupButton refButton'}, '<i class="x icon"></i>');
              
              if(this.$refs.tm.editor.mode.isReadOnly() == true) {
                $(suppButton).hide()
              }

              this.$refs.tm.editor.dom.bind(suppButton, 'click', (e) => {
                e.toElement.parentNode.parentNode.parentNode.parentNode.remove();
              });
              this.$refs.tm.editor.dom.bind(urlLink, 'click', () => {window.open(ref[0])
              });
              urlDisplay.firstChild.appendChild(urlLink);
              urlDisplay.firstChild.appendChild(suppButton);
              
              var visionDisplay = this.$refs.tm.editor.dom.create('div', {'class' : ' versionDisplay no-hover'});
              var referencetext = this.$refs.tm.editor.dom.create('div', {'class' : 'referenceText'}, response.body.content);
              var referenceContent = this.$refs.tm.editor.dom.create('div', {'data-refurl' : ref[1], 'data-refid' : ref[2], 'class': 'mce ref mceNonEditable', 'contenteditable' : 'false'})
              var referenceEnd = this.$refs.tm.editor.dom.create('div', {'class' : 'refEnd'})
              this.$refs.tm.editor.dom.bind(referenceContent, 'mouseenter', (e) => {
                e.toElement.childNodes[0].classList.toggle('no-hover');
                e.toElement.childNodes[1].classList.toggle('no-hover');
              });
              this.$refs.tm.editor.dom.bind(referenceContent, 'mouseleave', (e) => {
                e.fromElement.childNodes[0].classList.toggle('no-hover');
                e.fromElement.childNodes[1].classList.toggle('no-hover');
              });

              if(!response.body.updated) {
                  visionDisplay.classList.add('blue');
              } else {
                  visionDisplay.classList.add('orange');
                  this.$refs.tm.editor.dom.bind(visionDisplay, 'click', () => {
                    this.$refs.tm.editor.windowManager.open({
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
                            html: response.body.content
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
                            html: response.body.cache
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
                         this.$http.put('http://localhost:3000/reference/', 
                                {
                                  'url' : ref[1],
                                  'idRef': ref[2],
                                  'content': '<div>' + response.body.content + '</div>',
                                  'uuidPage' : this.uuid
                                }
                                ,{
                                    headers: {
                                      'Authorization': 'Bearer test_TOKEN123'
                                    }
                                  }).then(
                                    () => {
                                      visionDisplay.classList.add('blue');
                                      visionDisplay.classList.remove('orange');
                                      this.$refs.tm.editor.dom.unbind(visionDisplay, 'click');
                                      api.close();
                                    }, 
                                    (response) => {
                                      console.log("error", response)
                                    }
                                  )
                      } else {
                        this.$http.post('http://localhost:3000/reference/delete', 
                                {
                                  'url' : ref[1],
                                  'idRef': ref[2],
                                  'uuidPage' : this.uuid
                                }
                                ,{
                                    headers: {
                                      'Authorization': 'Bearer test_TOKEN123'
                                    }
                                  }).then(
                                    () => {
                                      var originalBlock = this.$refs.tm.editor.dom.create('div', {}, response.body.cache);

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
       },

    searchIntern: function(loader, ref) {
          let refRegex = /\/([a-z0-9A-Z:%_+.,?!@&=-]+)#/;
          var idPageRef = ref[0].match(refRegex);
          this.$http.post('http://localhost:3000/reference/intern',
          {
          'uuidPage' : this.uuid,
          'url' : ref[1],
          'idPageRef' : idPageRef[1],
          'idRef' : ref[2],
          }
        ,{
            headers: {
              'Authorization': 'Bearer test_TOKEN123'
            }
          }).then(
          (response) => {
            this.addReference(loader, ref, response)
          }, 
          (response) => {
            console.log("error", response)
          })
    },

    searchExtern: function(loader, ref) {
          this.$http.post('http://localhost:3000/reference',
          {
          'uuidPage' : this.uuid,
          'url' : ref[1],
          'idRef' : ref[2],
          }
         ,{
            headers: {
              'Authorization': 'Bearer test_TOKEN123'
            }
          }).then(
          (response) => {
            this.addReference(loader, ref, response)
          }, 
          (response) => {
            console.log("error", response)
          })
    },

    addReference(loader, ref, response) {
            var reference;
            if(response.body.state == 'noUrl') {
              reference = this.createNoUrlRef(ref, response)
            } else if (response.body.state == 'noIdRef') {
              reference = this.createNoIdRef(ref, response)
            } else {
              reference = this.createRef(ref, response)
            }
            loader.replaceWith(reference);
            this.submit()
    },

    initEventEditor: function () {
      this.endEdit()
      this.$refs.tm.editor.once("newblock", this.identifyBlock)
      this.$refs.tm.editor.once("pastepostprocess", this.identifyPaste)
      this.content = this.InitalContent;
      setTimeout(() => {
        this.checkRef()
      }, 500);
    },
      

    identifyBlock: function (e) {
      e.target.dom.setAttribs(e.newBlock, {'id' : this.$uuid.v4(), 'class' : 'mce'} );
      this.$refs.tm.editor.once("newblock", this.identifyBlock)
    },
    identifyPaste: function (e) {
      let elements = e.node.getElementsByTagName("*")
      for(var i = 0; i < elements.length; i++) {
      elements[i].setAttribute('id', this.$uuid.v4())
      elements[i].setAttribute('class', 'mce')
      this.$refs.tm.editor.once("pastepostprocess", this.identifyPaste)
      }
    },
    addRefPlugin: function () {
    this.$refs.tm.editor.editorManager.PluginManager.add('reference', (editor) => {
      var referenceHovered;
      var referenceClicked;
      var url;
        var openDialog = () => {
        return editor.windowManager.open({
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
          this.$http.post('http://localhost:3000/reference/page',
          {
          'uuidPage' : this.uuid,
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
        })
     
      }

      
      var page2Config = (html) => { return {
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
        this.checkRef();
        api.close();
      }
      
      }}








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
 }
</script>

<!-- See also public/mce_style.css for tinyMCE content style configuration -->
<style>
.document {
  margin: 30px;
  width: 80%;
}

.btn-edit {
  position:absolute;
  right: 7%;
  z-index:5;
}

.edit-option {
  margin-top : 15px;
}

.btn-edit-top {
  margin-bottom: 10px !important;
}
</style>

    
    
    
