import $ from 'jquery'

// use as mixin

var mce_eventManager = {
    methods: {
        EV_startEdit: function() {
            this.edition = true;
            this.$refs.tm.editor.setMode('design');
            $('.tox-editor-header').show()
            this.$refs.tm.editor.dom.$('.refSupButton').show()
        },
        EV_endEdit: function () {
            this.edition = false;
            this.$refs.tm.editor.setMode('readonly');
            $('.tox-editor-header').hide()
            this.$refs.tm.editor.dom.$('.refSupButton').hide()
        } 
    }
}

export default mce_eventManager;