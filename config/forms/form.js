export let obj = {

    filename : {
        element : 'input',
        label : 'filename',
        attributes : {
            id : 'filename',
            name : 'filename',
            type : 'text',
            value : '',
            validation : 'isLength(3,30);isNotEmpty()',

        },
    },
    content: {
        element : 'textarea',
        label : 'content',
        attributes : {
            id : 'content',
            name : 'content',
            value : '',
            rows:10,
            cols:120,
        },

    },

    submit : {
        element : 'button',
        attributes : {
            id : 'submit',
            name : 'postId',
            type : 'text',
            class : 'w3-button w3-green',
            value : 'Submit',
            onclick : 'forma.submitForm(`editPost`); return false;'
        }
    },

}