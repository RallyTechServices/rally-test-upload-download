Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    defaults: { padding: 5, margin: 5 },
    logger: new Rally.technicalservices.Logger(),
    items: [
        {xtype:'container',itemId:'form_box', defaults: {padding:5,margin:5}, items: [
            {xtype:'filefield',itemId:'file_upload_selector'},
            {xtype:'container',html:'Try something other than an html file.  Also, look at the console for more output'},
            {xtype:'container',itemId:'file_info_box'},
            {xtype:'rallyrichtexteditor',itemId:'text_field'},
            {xtype:'container',layout:{type:'hbox'}, defaults: { padding: 5 }, items:[
                {xtype:'rallytextfield',itemId:'field_name_field',fieldLabel:'File Name:'},
                {xtype:'rallybutton',itemId:'save_button',text:'Save File'}]
            }
        ]},
        {xtype:'container',itemId:'messages', defaults: {padding:5}, items: [
            {xtype:'container',html:'Messages:'}
        ]}
    ],
    launch: function() {
        var me = this;
        if ( !this.isAbleToLoadFiles() ) {
            alert("Your browser is old");
        }
        if ( !this.isAbleToDownloadFiles()){
            alert("Can't do download");
        }
        // attach the listener to the actual file-upload element (which Ext hides)
        this.down('#file_upload_selector').on('afterrender',function(selector){
            selector.fileInputEl.on('change', this.readFile, this);
        },this);
        // save button
        this.down('#save_button').on('click',this.saveFile,this);
    },
    isAbleToDownloadFiles: function() {
        var message_box = this.down('#messages');
        message_box.add({xtype:'container',html:'Checking for blobability'});
        try { 
            var isFileSaverSupported = !!new Blob(); 
        } catch(e){
            message_box.add({xtype:'container',html:'Cannot do blob stuff'});
            return false;
        }
        message_box.add({xtype:'container',html:'Finished checking blobability'});
        return true;
    },
    isAbleToLoadFiles: function() {
        var message_box = this.down('#messages');
        
        message_box.add({xtype:'container',html:'Checking window.File'});
        if ( !window.File) {
            return false;
        } 
        
        message_box.add({xtype:'container',html:'Checking window.FileReader'});
        if ( !window.FileReader ) {
            return false;
        }
        
        message_box.add({xtype:'container',html:'Checking window.FileList'});
        if ( !window.FileList ) {
            return false;
        }
        
        message_box.add({xtype:'container',html:'Checking window.Blob'});
        if ( !window.Blob ) {
            return false;
        }
        
        message_box.add({xtype:'container',html:'Finished checking FileReader availability'});
        return true;
    },
    saveFile: function(button,evt) {
        var me = this;
        var file_name = this.down('#field_name_field').getValue();
        var content = this.down('#text_field').getValue();
        if ( !file_name ) {
            alert('Cannot save without a file name');
        } else {
            if ( !content ) {
                alert('Cannot save without contents to put in the file (put in the rich text editor)');
            } else {
                me.logger.log(this,"file name to use:",file_name);
                me.logger.log(this,"content to save:",content);
                
                var blob = new Blob([content],{type:'text/plain;charset=utf-8'});
                saveAs(blob,file_name);
            }
        }
    },
    readFile: function(evt) {
        var me = this;
        this.logger.log(this,'event',evt);
        var message_box = this.down('#file_info_box');
        message_box.removeAll();
        
        var f = evt.target.files[0];

        if (f){
            var reader = new FileReader();
            // reading the file is asynchronous
            reader.onload = function(e) {
                var contents = e.target.result;
                me.logger.log(me,contents);
                message_box.add({xtype:'container',html:'File information:'});
                message_box.add({xtype:'container',html:'Name:' + f.name});
                message_box.add({xtype:'container',html:'Type:' + f.type});
                message_box.add({xtype:'container',html:'Size (bytes):' + f.size});
                me.down('#text_field').setValue(contents);
            }
            reader.readAsText(f);
        }
    }
});
