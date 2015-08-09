define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        move: function (destination) {
            var model = this;

            return $.ajax({
                type: "POST",
                url: "http://localhost:8080/api/chess/moves",
                dataType: "json",
                processData: false,
                contentType: "application/json",
                data: JSON.stringify({
                    origin: model.get("position"),
                    destination: destination
                }),
                success: function (response) {
                    model.collection.currentPlayer = response.currentPlayer;
                    model.collection.gameOver = response.gameOver;
                    model.collection.inCheck = response.inCheck;

                    model.set("position", destination);
                }
            })
        }
    });
});
