define([
    "backbone"
], function (Backbone) {

    return Backbone.View.extend({

        tagName: "td",

        initialize: function () {
            _.bindAll(this, "onClick");
            this.listenTo(this.model, "change:figure", this.toggleFigure);
            this.listenTo(this.model, "change:highlighted", this.toggleHighlight);

            this.$el.click(this.onClick);
        },

        toggleFigure: function (model, figure) {
            if (figure) {
                this.$el.append(figure.el);
            }
        },


        toggleHighlight: function (model, highlighted) {
            this.$el.toggleClass("highlighted", highlighted)
        },

        onClick: function () {
            this.trigger("selected", this.model);
        }
    });
});
