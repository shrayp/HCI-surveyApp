$(function () {
    var numElements = 0;
    
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
                        { id: 'rating', text: 'Add rating' },
                        { id: 'tf', text: 'Add true/false' }
                        ]
                },
            ],
            onClick: function (event) {
                //generate a name for the element and element to main display
                var divname = randstring();
                 $('#testAreaDiv').append('<div class="'+ divname +'" id="'+ divname +'">');
                if(event.target == 'mc'){
                    makeMCQuestionDiv(divname);
                } else if(event.target == 'la') {
                    makeLongAnswerQuestionDiv(divname);
                } else if(event.target == 'rating') {
                    
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
                { type: 'button' , id: 'New', caption: 'New', icon: 'fa-star'},
                { type: 'break',  id: 'break0' },
                { type: 'button' , id: 'Finish', caption: 'Finish', icon: 'fa-star'},
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
                                        //todo add contents of form to page
                                    }
                                });
                            }
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
     * 
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
                    { field: 'field_radio', type: 'radio', required: false, html: { attr: 'style="width: 10px"' }, options: {
                        items: [
                            { id: 0, text: 'Pickle, Susan' },
                            { id: 1, text: 'Adams, John' },
                            { id: 2, text: 'Openhimer, Peter' },
                            { id: 3, text: 'Woznyak, Steve' },
                            { id: 4, text: 'Rusevelt, Franklin' },
                            { id: 5, text: 'Stalone, Silvester' },
                            { id: 6, text: 'Mann, Fred' },
                            { id: 6, text: 'Ford, Mary' },
                            { id: 8, text: 'Purky, Mon' },
                            { id: 9, text: 'Min, Hla' }
                        ]
                    }
                }
                ],
                record: { 
                    question : 'Enter Question Here',
                    choice_1 : 'Required',
                    choice_2 : 'Required',
                    choice_3 : 'Optional',
                    choice_4 : 'Optional',
                    choice_5 : 'Optional',
                    field_radio : 0
                },
                actions: {
                    "save": function () {
                            if(this.validate().length == 0){
                                this.save(function(res) {
                                    if(res.status == "success"){
                                        w2popup.close();
                                        //todo add contents of form to page
                                    }
                                });
                            }
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