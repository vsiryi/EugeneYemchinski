define([
    "backbone",
    "views/cell",
    "views/figure",
    "collections/cells",
    "collections/moves",
    "collections/figures",
    "text!templates/board.html",
    "text!templates/edge-cell.html",
    "toastr"
], function (Backbone, CellView, FigureView, Cells, Moves, Figures, Template, EdgeCellTpl, toastr) {
    return Backbone.View.extend({

        className: "chessboard",

        template: _.template(Template),

        events: {
            'click button[data-id="resetGame"]': 'resetGame'
        },

        initialize: function () {
            this.cellsCollection = new Cells();
            this.figuresCollection = new Figures();
            this.movesCollection = new Moves();

            this.listenTo(this.movesCollection, "sync", this.onMovesSync);
            this.listenTo(this.figuresCollection, "change:position", this.onFigureMoved);
            this.listenTo(this.figuresCollection, "sync reset", this.renderFigures);
        },

        resetGame: function () {
            var board = this;
            this.startLoadingSpinner();

            $.ajax({
                type: "POST",
                url: "http://localhost:8080/api/chess",
                success: function (response) {
                    board.figuresCollection.remove(board.figuresCollection.models);
                    board.figuresCollection.reset(board.figuresCollection.parse(response));
                    board.movesCollection.fetch();
                }
            });
        },

        startLoadingSpinner: function () {
            var $spinner = this.$spinner;
            $spinner.data("loading", true);
            _.delay(function () {
                if ($spinner.data("loading")) {
                    $spinner.addClass("loading");
                }
            }, 300);
        },

        stopLoadingSpinner: function () {
            this.$spinner.data("loading", false);
            this.$spinner.removeClass("loading");
        },

        render: function () {

            this.$el.html(this.template());

            this.$currentPlayer = this.$('strong[data-id="currentPlayer"]');
            this.$spinner = this.$(".spinner");

            this.startLoadingSpinner();

            var $tbody = $('<tbody/>');

            _.each(_.range(10).reverse(), function (y) {
                var $row = $('<tr/>');
                _.each(_.range(10), function (x) {
                    var xToStrChar = String.fromCharCode(x + 96);
                    if (x == 0 || x == 9 || y == 0 || y == 9) {
                        var edgeCellText = (x == 0 || x == 9) && (y != 0 && y != 9) ? y : ((x != 0 && x != 9) ? xToStrChar : "");
                        $row.append(_.template(EdgeCellTpl)({text: edgeCellText}));
                    } else {
                        var cellView = new CellView({
                            model: this.cellsCollection.push({
                                position: xToStrChar + y
                            })
                        });

                        this.listenTo(cellView, "selected", this.onCellClick);

                        $row.append(cellView.el);
                    }
                }, this);

                $tbody.append($row);

            }, this);

            this.$("table").append($tbody);

            this.figuresCollection.fetch();
            this.movesCollection.fetch();

            return this;
        },

        onFigureMoved: function (figureModel) {
            var position = figureModel.get("position"),
                previousPosition = figureModel.previous("position"),
                cellModel = this.cellsCollection.findWhere({position: position}),
                previousCellModel = this.cellsCollection.findWhere({position: previousPosition});

            cellModel.set("figure", previousCellModel.get("figure"));
            previousCellModel.set("figure", null);
            this.showInfo();
            this.setPlayer();

            this.movesCollection.fetch();
        },

        onMovesSync: function () {
            this.stopLoadingSpinner();
            this.highlightAvailableMoves();
        },

        highlightAvailableMoves: function (figureModel) {
            var availableMoves = figureModel ? this.getAvailableMoves(figureModel) : [];

            this.cellsCollection.each(function (cell) {
                cell.set("highlighted", _.contains(availableMoves, cell.get("position")));
            }, this);
        },

        highlightSelectedFigure: function (figureModel) {
            this.figuresCollection.each(function (figure) {
                figure.set("selected", figure == figureModel);
            }, this);
        },

        onCellClick: function (model) {
            var figureModel = model.has("figure") ? model.get("figure").model : null;

            if (model.get("highlighted")) {
                if (figureModel && this.figuresCollection.currentPlayer !== figureModel.get("owner")) {
                    this.figuresCollection.remove(figureModel);
                }
                this.figuresCollection.findWhere({selected: true}).move(model.get("position"))
            } else if (figureModel && this.figuresCollection.currentPlayer === figureModel.get("owner")) {
                this.highlightAvailableMoves(figureModel);
                this.highlightSelectedFigure(figureModel);
            }
        },

        getAvailableMoves: function (figureModel) {
            return _.map(this.movesCollection.where({origin: figureModel.get("position")}), function (model) {
                return model.get("destination");
            });
        },

        showInfo: function () {
            if (this.figuresCollection.gameOver) {
                toastr.success((this.figuresCollection.currentPlayer.toLowerCase() == "white" ? "Black" : "White") + " wins!");
            } else if (this.figuresCollection.gameOver) {
                toastr.success(this.figuresCollection.currentPlayer + " are under check!");
            }
        },

        setPlayer: function () {
            this.$currentPlayer.text(this.figuresCollection.currentPlayer);
        },

        renderFigures: function () {
            this.showInfo();
            this.setPlayer();
            this.figuresCollection.each(function (figure) {
                var cellModel = this.cellsCollection.findWhere({position: figure.get("position")}),
                    figureView = new FigureView({model: figure}).render();

                cellModel.set("figure", figureView);
            }, this);
        }
    })
});
