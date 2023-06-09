// photos from flickr with creative commons license


window.onload = function () {
    var images = ['aphid', 'cat', 'ladybug', 'rose', 'bird', 'grasshopper', 'plant', 'wheat'];
    var urls = {};

    for (var i = 0; i < images.length; i++) {
        var imgElement = document.getElementById(images[i] + 'Img');
        var canvas = document.createElement('canvas');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        canvas.getContext('2d').drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
        urls[images[i]] = canvas.toDataURL();
    }

    var cy = cytoscape({
        container: document.getElementById('cy'),

        boxSelectionEnabled: false,
        autounselectify: true,

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'height': 80,
                'width': 80,
                'background-fit': 'cover',
                'border-color': '#000',
                'border-width': 3,
                'border-opacity': 0.5
            })
            .selector('.eating')
            .css({
                'border-color': 'red'
            })
            .selector('.eater')
            .css({
                'border-width': 9
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                'width': 6,
                'target-arrow-shape': 'triangle',
                'line-color': '#ffaaaa',
                'target-arrow-color': '#ffaaaa'
            })
            .selector('#aphid')
            .css({
                'background-image': urls['aphid']
            })
            .selector('#cat')
            .css({
                'background-image': urls['cat']
            })
            .selector('#ladybug')
            .css({
                'background-image': urls['ladybug']
            })
            .selector('#rose')
            .css({
                'background-image': urls['rose']
            })
            .selector('#bird')
            .css({
                'background-image': urls['bird']
            })
            .selector('#grasshopper')
            .css({
                'background-image': urls['grasshopper']
            })
            .selector('#plant')
            .css({
                'background-image': urls['plant']
            })
            .selector('#wheat')
            .css({
                'background-image': urls['wheat']
            }),

        elements: {
            nodes: [
                {data: {id: 'cat'}},
                {data: {id: 'bird'}},
                {data: {id: 'ladybug'}},
                {data: {id: 'aphid'}},
                {data: {id: 'rose'}},
                {data: {id: 'grasshopper'}},
                {data: {id: 'plant'}},
                {data: {id: 'wheat'}}
            ],
            edges: [
                {data: {source: 'cat', target: 'bird'}},
                {data: {source: 'bird', target: 'ladybug'}},
                {data: {source: 'bird', target: 'grasshopper'}},
                {data: {source: 'grasshopper', target: 'plant'}},
                {data: {source: 'grasshopper', target: 'wheat'}},
                {data: {source: 'ladybug', target: 'aphid'}},
                {data: {source: 'aphid', target: 'rose'}}
            ]
        },

        layout: {
            name: 'breadthfirst',
            directed: true,
            padding: 10
        }
    }); // cy init

    cy.on('tap', 'node', function () {
        var nodes = this;
        var tapped = nodes;
        var food = [];

        nodes.addClass('eater');

        for (; ;) {
            var connectedEdges = nodes.connectedEdges(function (el) {
                return !el.target().anySame(nodes);
            });

            var connectedNodes = connectedEdges.targets();

            Array.prototype.push.apply(food, connectedNodes);

            nodes = connectedNodes;

            if (nodes.empty()) {break;}
        }

        var delay = 0;
        var duration = 500;
        for (var i = food.length - 1; i >= 0; i--) {
            (function () {
                var thisFood = food[i];
                var eater = thisFood.connectedEdges(function (el) {
                    return el.target().same(thisFood);
                }).source();

                thisFood.delay(delay, function () {
                    eater.addClass('eating');
                }).animate({
                    position: eater.position(),
                    css: {
                        'width': 10,
                        'height': 10,
                        'border-width': 0,
                        'opacity': 0
                    }
                }, {
                    duration: duration,
                    complete: function () {
                        thisFood.remove();
                    }
                });

                delay += duration;
            })();
        } // for

    }); // on tap


}; // onload
