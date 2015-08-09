define([
    "backbone",
    "models/cell"
], function (Backbone, Cell) {

    return Backbone.Collection.extend({
        model: Cell
    });
});
