define([
    "backbone",
    "models/figure"
], function (Backbone, Figure) {

    return Backbone.Collection.extend({

        model: Figure,

        url: "http://localhost:8080/api/chess",

        parse: function (response) {
            this.currentPlayer = response.currentPlayer;
            this.gameOver = response.gameOver;
            this.inCheck = response.inCheck;

            return _.map(response.positionToPieces, function (item, key) {
                return _.extend(item, {
                    position: key

                });
            });
        }
    });
});
