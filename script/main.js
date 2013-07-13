require([
        'DropZone',
        'TemplateGenerator',
],function(DropZone,TemplateGenerator){
    var tg = new TemplateGenerator();
    var dz = new DropZone(document.body,function(file,dropzone){
        var reader;
        if(file.type != 'text/plain'){
            dropzone.setDropState('error','Please load a text file.');
        }else{
            //begin file read
            reader = new FileReader();
            reader.onload = function(evt){
                var content = evt.target.result;
                tg.addTemplateAndLoad(file.name,content);
            };
            reader.readAsText(file);
        }
    });
});

