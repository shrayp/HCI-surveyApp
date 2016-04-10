$(function () {
    
    /*
     *   Create sidebar used for selecting items to add to survey such as:
     *  - multiple choice questions
     *  - long answer questions
     *  - scale of (1-10) questions 
     *  etc...
     */
    var setupSidebar = function(){
        $('#grid').w2layout({
        name: 'grid',
        panels: [
            { type: 'left', size: 200, resizable: true, style: 'background-color: #F5F6F7;', content: 'left' },
            { type: 'main', style: 'background-color: #F5F6F7; padding: 5px;', content: '<div class="testArea" id="testAreaDiv"></div>' }
            ]
        });
        
        w2ui['grid'].content('left', $().w2sidebar({
            name: 'sidebar',
            img: null,
            nodes: [ 
                { id: 'Elements', text: 'Elements', expanded: true, group: true,
                nodes: [ { id: 'mc', text: 'Add multiple choice' },
                        { id: 'la', text: 'Add long answer' },
                        { id: 'fillblank', text: 'Add fill in blank' },
                        { id: 'tf', text: 'Add true/false' }
                        ]
                },
            ],
            onClick: function (event) {
                //generate a name for the element and element to main display
                var divname = randstring();
                 $('#testAreaDiv').append('<div class="'+ divname +'" id="'+ divname +'", style="display: block; top: 0px; overflow: auto; background-color: rgb(245, 246, 247); padding: 5px;">');
                if(event.target == 'mc'){
                    makeMCQuestionDiv(divname);
                } else if(event.target == 'la') {
                    makeLongAnswerQuestionDiv(divname);
                } else if(event.target == 'fillblank') {
                    makeFillBlankQuestion(divname);
                } else if(event.target == 'tf') {
                    
                }
                
            }
        })

        );
    }
    
    /*
        * Setup of the toolbar used to:
        * - create a new survey
        * - save a created survey
        * - finish and publish a survey
        * - cancle a work in progess
        */
    var setupToolbar = function(){
        $('#toolbar').w2toolbar({
            name: 'toolbar',
            items: [
                { type: 'button' , id: 'New', caption: 'New', hint: 'Click this button to start over again' },
                { type: 'break',  id: 'break0' },
                { type: 'button' , id: 'Finish', caption: 'Finish', hint: 'Click this button to save your work and send it to the server' },
                { type: 'break',  id: 'break0' }
            ],
            onClick: function (event) {
                if(event.target == 'New'){
                    $('#testAreaDiv').empty();
                } else if(event.target == 'Finish'){
                    //todo send to server
                }
            }
        });
    }
    
    var appendArea = function(){
        w2ui['grid'].content('<div class="testArea" id="testAreaDiv">')
    }
    
    /**
     * Function generates a random string for use in unique IDs for div's added to testArea
     * @param <int> n - The length of the string
     */
    var randstring = function(n) {
        if(!n) { n = 5; }

        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for(var i=0; i < n; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    
    
    var makeFillBlankQuestion = function(div){
        if (!w2ui.getfillInfo) {
            $().w2form({
                name    : 'getfillInfo',
                style   : 'border: 0px; background-color: transparent;',
                url     : '/mainpage',
                fields: [
                    { field: 'question', type: 'textarea', required: true, html: { caption: 'Question', attr: 'style="width: 300px; height: 100px"' } },
                    { field: 'choice_1', type: 'text', required: true, html: { caption: 'Choice 1', attr: 'style="width: 300px"' } },
                    { field: 'choice_2', type: 'text', required: true, html: { caption: 'Choice 2', attr: 'style="width: 300px"' } },
                    { field: 'choice_3', type: 'text', required: false, html: { caption: 'Choice 3', attr: 'style="width: 300px"' } },
                    { field: 'choice_4', type: 'text', required: false, html: { caption: 'Choice 4', attr: 'style="width: 300px"' } },
                    { field: 'choice_5', type: 'text', required: false, html: { caption: 'Choice 5', attr: 'style="width: 300px"' } },
                ],
                record: { 
                    question : 'Please leave a " # " at every spot where an answer would go.',
                    choice_1 : 'Required',
                    choice_2 : 'Required',
                    choice_3 : 'Optional',
                    choice_4 : 'Optional',
                    choice_5 : 'Optional'
                },
                actions: {
                    "save": function () {
                            if(this.validate().length == 0){
                                this.save( function(res) {
                                    if(res.status == "success"){
                                        w2popup.close();
                                        var question = $("#question").val();
                                        var q = question.split('#');
                                        
                                        var choices = [$('#choice_1').val(), $('#choice_2').val(), $('#choice_3').val(), $('#choice_4').val(),$('#choice_5').val()];
                                        var ans = [];
                                        
                                        for(i=0;i<choices.length; i++){
                                            if(choices[i]){
                                                ans.push(choices[i]);
                                            }
                                        }
                                        $(div).quizyFillBlank({
                                            textItems : q,
                                            anItems : ans,
                                            anItemsCorrect:[1],
                                            blockSize:150
                                        });
                                    }
                                });
                            }
                        },
                    "reset": function () { this.clear(); },
                }
            });
        }
        $().w2popup('open', {
            title   : 'True or False Question',
            body    : '<div id="form" style="width: 100%; height: 100%;"></div>',
            style   : 'padding: 15px 0px 0px 0px',
            width   : 500,
            height  : 300, 
            showMax : true,
            onToggle: function (event) {
                $(w2ui.getfillInfo.box).hide();
                event.onComplete = function () {
                    $(w2ui.getfillInfo.box).show();
                    w2ui.getfillInfo.resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    $('#w2ui-popup #form').w2render('getfillInfo');
                }
            }
        });
    }
    
    /**
     * Makes a div for long answer questions
     * Gets the information needed to generate a long answer question
     */
    var makeLongAnswerQuestionDiv = function(div){
        if (!w2ui.laGetInfo) {
            $().w2form({
                name    : 'laGetInfo',
                style   : 'border: 0px; background-color: transparent;',
                url     : '/mainpage',
                fields: [
                    { field: 'question', type: 'textarea', required: true, html: { caption: 'Question', attr: 'style="width: 300px; height: 100px"' } },
                ],
                actions: {
                    "save": function () {
                            if(this.validate().length == 0){
                                this.save( function(res) {
                                    if(res.status == "success"){
                                        w2popup.close();
                                        var q = $("#question").val();
                                         $('#'+div).append(
                                            '<br></br>' + 
                                            '<label> Long Answer Question: ' + q +'</label>'                            
                                        );
                                    }
                                });
                            }
                        },
                    "reset": function () { this.clear(); },
                }
            });
        }
        $().w2popup('open', {
            title   : 'True or False Question',
            body    : '<div id="form" style="width: 100%; height: 100%;"></div>',
            style   : 'padding: 15px 0px 0px 0px',
            width   : 500,
            height  : 300, 
            showMax : true,
            onToggle: function (event) {
                $(w2ui.laGetInfo.box).hide();
                event.onComplete = function () {
                    $(w2ui.laGetInfo.box).show();
                    w2ui.laGetInfo.resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    $('#w2ui-popup #form').w2render('laGetInfo');
                }
            }
        });
    }
    
    /**
     * Gets the information needed to generate a MC question
     * Gets the question and number of possible choices and each choice

     */
    var makeMCQuestionDiv = function(div){
            if (!w2ui.mcGetInfo) {
            $().w2form({
                name    : 'mcGetInfo',
                style   : 'border: 0px; background-color: transparent;',
                url     : '/mainpage',
                fields: [
                    { field: 'question', type: 'text', required: true, html: { caption: 'Question', attr: 'style="width: 300px"' } },
                    { field: 'choice_1', type: 'text', required: true, html: { caption: 'Choice 1', attr: 'style="width: 300px"' } },
                    { field: 'choice_2', type: 'text', required: true, html: { caption: 'Choice 2', attr: 'style="width: 300px"' } },
                    { field: 'choice_3', type: 'text', required: false, html: { caption: 'Choice 3', attr: 'style="width: 300px"' } },
                    { field: 'choice_4', type: 'text', required: false, html: { caption: 'Choice 4', attr: 'style="width: 300px"' } },
                    { field: 'choice_5', type: 'text', required: false, html: { caption: 'Choice 5', attr: 'style="width: 300px"' } },
                ],
                record: { 
                    question : 'Enter Question Here',
                    choice_1 : 'Required',
                    choice_2 : 'Required',
                    choice_3 : 'Optional',
                    choice_4 : 'Optional',
                    choice_5 : 'Optional',
                },
                actions: {
                    "save": function () {
                            w2popup.close();
                            this.save(function(res){
                                var q = $("#question").val();
                                var choices = [$('#choice_1').val(), $('#choice_2').val(), $('#choice_3').val(), $('#choice_4').val(),$('#choice_5').val()];
                                var ans = [];

                                for(i=0;i<choices.length; i++){
                                    if(choices[i]){
                                        ans.push(choices[i]);
                                    }
                                }
                                $('#'+div).append(
                                    '<br></br>' + 
                                    '<label> Multiple Choice Question: ' + q +'</label>'                            
                                );
                                
                                for(i=0;i<ans.length; i++){
                                    $('#'+div).append(
                                        '<div class= choice'+ i +'>' +
                                        '<label> Choice ' + i + ': ' + ans[i] +'</label>' +
                                        '</div>' 
                                    )
                                }
                                
                            });
                            
                        },
                    "reset": function () { this.clear(); },
                }
            });
        }
        $().w2popup('open', {
            title   : 'Multiple Choice Question',
            body    : '<div id="form" style="width: 100%; height: 100%;"></div>',
            style   : 'padding: 15px 0px 0px 0px',
            width   : 500,
            height  : 300, 
            showMax : true,
            onToggle: function (event) {
                $(w2ui.mcGetInfo.box).hide();
                event.onComplete = function () {
                    $(w2ui.mcGetInfo.box).show();
                    w2ui.mcGetInfo.resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    $('#w2ui-popup #form').w2render('mcGetInfo');
                }
            }
        });
    }
    
    setupSidebar();
    setupToolbar();
    appendArea();
});