define([
    "views/board"
], function (Board) {
    $(function () {
        $('.container').append(new Board().render().el);
    });
});
