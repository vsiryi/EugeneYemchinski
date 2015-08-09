define([
    "backbone"
], function (Backbone) {

    return Backbone.Collection.extend({
        url: "http://localhost:8080/api/chess/moves"
    });
});
