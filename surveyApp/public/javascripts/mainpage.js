$(function () {
    var numElements = 0;
    var setupSidebar = function(){
        /*
        Create sidebar used for selecting items to add to survey such as:
        - multiple choice questions
        - long answer questions
        - scale of (1-10) questions 
        etc...
        */
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
                    makeMCQuestionDiv();
                } else if(event.target == 'la') {
                    
                } else if(event.target == 'rating') {
                    
                } else if(event.target == 'tf') {
                    
                }
                
            }
        })
        
        
        );
    }
    
    var setupToolbar = function(){
        /*
        Setup of the toolbar used to:
        - create a new survey
        - save a created survey
        - finish and publish a survey
        - cancle a work in progess
        */
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
    
    /**
     * Gets the information needed to generate a MC question
     * Gets the question and number of possible choices and each choice
     * 
     */
    var makeMCQuestionDiv = function(){
            if (!w2ui.mcGetInfo) {
            $().w2form({
                name: 'mcGetInfo',
                style: 'border: 0px; background-color: transparent;',
                fields: [
                    { field: 'question_to_ask', type: 'text', required: true, html: { caption: 'Question', attr: 'style="width: 300px"' } },
                    { field: 'num_choices', type: 'int', required: true, html: { caption: 'Number of choices (max 10)', attr: 'style="width: 300px"' }  },
                ],
                record: { 
                    question_to_ask : 'Enter Question Here',
                    num_choices     : '5',
                },
                actions: {
                    "save": function () {
                            
                            if(this.validate().length > 0){
                            //required fields not filled
                                   console.log(w2ui['mcGetInfo'].validate());
                            } else {
                                
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
                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler, which would make this code execute too early and hence not deliver.
                    $('#w2ui-popup #form').w2render('mcGetInfo');
                }
            }
        });
    }
    
    setupSidebar();
    setupToolbar();
    appendArea();
});