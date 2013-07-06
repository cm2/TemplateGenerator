define(function(){
    function DropZone(target,callback){
        this.drop = (typeof target == 'string')? 
            document.getElementById(target) : target;

        this.cb = callback;
        this.placeholder = this.drop.getAttribute('data-placeholder');
        this.setDropState(false);
        this.drop.addEventListener('drop',this.scoped(this.loadFile), false);
        this.drop.addEventListener('dragover',this.scoped(this.dragover), false);
        this.drop.addEventListener('dragexit',this.scoped(this.dragout), false);
    }
    var dz = DropZone.prototype;
    dz.scoped = function(fn){
        var that = this;
        return function(){
            fn.apply(that, arguments);
        }
    }
    dz.dragover = function (evt){
        this.setDropState('dragable');
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };
    dz.dragexit = function (evt){
        this.setDropState('');
        evt.stopPropagation();
        evt.preventDefault();
    };
    dz.setDropState = function(state, custom_text) {
        /*
        this.drop.innerHTML = (custom_text == undefined || custom_text == '')?
            this.placeholder : custom_text;
        */
        this.drop.setAttribute('data-state', (state == false)? '': state);
    };
    dz.loadFile = function (evt){
        evt.stopPropagation();
        evt.preventDefault();
        this.file = evt.dataTransfer.files[0];
        this.setDropState('active','Loaded file ' + this.file.name);
        //callback is provided the file and the dropzone
        this.cb && this.cb(this.file,this);
    };
    dz.getFile = function() {
        return this.file;
    };
    return DropZone;
});
