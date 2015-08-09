define([
    'backbone'
], function (Backbone) {

    var figuresMap = {
        pBlack: "♟",
        rBlack: "♜",
        nBlack: "♞",
        bBlack: "♝",
        qBlack: "♛",
        kBlack: "♚",
        pWhite: "♙",
        rWhite: "♖",
        nWhite: "♘",
        bWhite: "♗",
        qWhite: "♕",
        kWhite: "♔"
    };

    return Backbone.View.extend({

        className: "item",

        initialize: function () {
            this.listenTo(this.model, "change:selected", this.toggleSelected);
            this.listenTo(this.model, "remove", this.remove);
        },

        toggleSelected: function (model, selected) {
            this.$el.toggleClass("selected", selected)
        },

        render: function () {
            this.$el.html($('<strong/>').text(figuresMap[this.model.get("type") + this.model.get("owner")]));
            return this;
        }
    });
});
