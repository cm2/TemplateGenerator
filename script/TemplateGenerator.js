define(function(){
    function TemplateGenerator(){
        var i = document.getElementById('inputs'), that= this;
        this.content='';
        document.addEventListener('keydown',function(evt){
            var ctrl = evt.ctrlKey || evt.metaKey;
            if(ctrl && evt.keyCode == 13){
                that.process(evt);
                evt.stopPropagation();
                evt.preventDefault();
            }
        });
        i.addEventListener('submit',this.scoped(this.process), false);
        this.ui_templates = document.getElementById('stored_templates');
        this.ui_templates.addEventListener('change',function(){
            that.scoped( that.loadStoredTemplate(that.ui_templates.value))
        } ,false);
        this.templates= this.hasLocalStorage() ? 
            window.localStorage : {};
        for(i in this.templates){
            if(this.templates.hasOwnProperty(i)){
                this.ui_addTemplateOpt(i);
            }
        }
    }
    var tg = TemplateGenerator.prototype;
    tg.scoped = function(fn){
        var that = this;
        return function(){
            fn.apply(that, arguments);
        }
    }
    tg.hasLocalStorage = function(){
        try{
            return 'localStorage' in window && window['localStorage'] !== null;
        }catch(e){
            return false;
        }

    }
    tg.ui_addTemplateOpt = function(name,selected){
        opt = document.createElement('option');
        opt.value =name;
        opt.innerHTML = name;
        opt.selected = !!selected;
        this.ui_templates.appendChild(opt);
    }
    tg.addTemplate = function(name, content, selected){
        !this.templates[name] && this.ui_addTemplateOpt(name, selected);
        this.templates[name] = content;
    };
    tg.removeTemplate = function(name){

    };
    tg.loadStoredTemplate = function( name ){
        var content = this.templates[name];
        this.loadTemplateForm(content);
    }
    tg.addTemplateAndLoad = function(name,content){
        this.addTemplate(name,content,true);
        this.loadTemplateForm(content);
    };
    tg.loadTemplateForm = function(content){
        this.content = content;
        var tags, ltags, i,content, d;
        d = document;
        tags = content.match(/(\w|:)+(?=\})/g);
        ltags= tags.length;
        d.getElementById('fieldlist').innerHTML = '';
        for(i=0; i<ltags; i++){
            (d.getElementById(tags[i]) == undefined) && this.createField(tags[i]);
        }
    }
    tg.process = function(evt){
        var inputs, output, i, re, outputs, d, linputs, output_html,ip;
        evt.stopPropagation();
        evt.preventDefault();
        d = document;
        outputs = d.getElementById('outputs');
        output = d.getElementById('output');
        output_html = d.getElementById('output_html');
        content = this.content;
        inputs = d.getElementsByTagName('textarea');
        linputs = inputs.length; for(i=0; i< linputs; i++){
            re = new RegExp('\\{'+inputs[i].id+'\\}','g');
            ip = inputs[i].value;
            content = (ip != '')? content.replace(re,ip) : content;
        }
        output.value = content;
        output_html.innerHTML = content;
    }
    tg.createField = function(id){
        var d,category,fieldset,legend,list,li;
        d = document;
        category = id.match(/\w+(?=:)/);
        category = category !== null ? category : 'general';
        fieldset = d.getElementById(category);
        list = d.getElementById(category+'_list');
        if (!fieldset){
            fieldlist = d.getElementById('fieldlist');
            fieldlist.setAttribute('class','ready');
            fieldset = d.createElement('fieldset');
            legend = d.createElement('legend');
            list = d.createElement('ol');
            list.id = category+'_list';
            legend.innerHTML = category;
            fieldset.id = category;
            fieldset.appendChild(legend);
            fieldset.appendChild(list);
            fieldlist.appendChild(fieldset);
        }
        li = d.getElementsByClassName('clone')[0].cloneNode(true);
        li.firstChild.setAttribute('for',id)
        li.lastChild.id = id;
        li.firstChild.innerHTML= id.replace(/\w+:/,'').replace(/_/g,' ');
        li.id=""
        list.appendChild(li);
    }
    return TemplateGenerator;
});
