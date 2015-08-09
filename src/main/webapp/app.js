requirejs.config({
    "baseUrl": "chess/src",

    "paths": {
        "jquery": "../libs/jquery.min",
        "toastr": "../libs/toastr",

        "backbone": "../libs/backbone.min",
        "underscore": "../libs/underscore.min",
        "text": "../libs/text"
    },

    "shim": {
        "underscore": {
            exports: "_"
        },

        "toastr": {
            "deps": ["jquery"],
            "exports": "toastr"
        },

        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"
        }
    }
});

requirejs(["main"]);