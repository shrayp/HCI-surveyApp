$(function () {
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
                $('#testAreaDiv').append('<h1>test</hi>')
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
                { type: 'button' , id: 'Save', caption: 'Save', icon: 'fa-star'},
                { type: 'break',  id: 'break1' },
                { type: 'button' , id: 'Finish', caption: 'Finish', icon: 'fa-star'},
                { type: 'spacer' },
                { type: 'button' , id: 'Cancel', caption: 'Cancel', icon: 'fa-star'}
            ],
            onClick: function (event) {
                //TODO
            }
        });
    }
    
    var appendArea = function(){
        w2ui['grid'].content('<div class="testArea" id="testAreaDiv">')
    }
    
    setupSidebar();
    setupToolbar();
    appendArea();
});