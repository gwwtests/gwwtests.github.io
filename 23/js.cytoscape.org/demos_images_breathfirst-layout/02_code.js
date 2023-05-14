// photos from flickr with creative commons license

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
            'border-opacity': 0.5,
            'visibility': 'hidden' // initially hidden
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
            'target-arrow-color': '#ffaaaa',
            'visibility': 'hidden' // initially hidden
        })
        .selector('#bird')
        .css({
            'background-image': 'url(bird.jpg)'
        })
        .selector('#cat')
        .css({
            'background-image': 'url(cat.jpg)',
            'visibility': 'visible' // root initially visible
        })
        .selector('#ladybug')
        .css({
            'background-image': 'url(ladybug.jpg)'
        })
        .selector('#aphid')
        .css({
            'background-image': 'url(aphid.jpg)'
        })
        .selector('#rose')
        .css({
            'background-image': 'url(rose.jpg)'
        })
        .selector('#grasshopper')
        .css({
            'background-image': 'url(grasshopper.jpg)'
        })
        .selector('#plant')
        .css({
            'background-image': 'url(plant.jpg)'
        })
        .selector('#wheat')
        .css({
            'background-image': 'url(wheat.jpg)'
        }),


    elements: {
        nodes: [
            {data: {id: 'cat', originalPosition: null}},
            {data: {id: 'bird', originalPosition: null}},
            {data: {id: 'ladybug', originalPosition: null}},
            {data: {id: 'aphid', originalPosition: null}},
            {data: {id: 'rose', originalPosition: null}},
            {data: {id: 'grasshopper', originalPosition: null}},
            {data: {id: 'plant', originalPosition: null}},
            {data: {id: 'wheat', originalPosition: null}}
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
        padding: 10,
    }

}); // cy init

// Apply the layout after initialization
var layout = cy.layout({
    name: 'breadthfirst',
    directed: true,
    padding: 10,
});

// Run the layout and then store the original positions
layout.run().promiseOn('layoutstop').then(function () {
    cy.nodes().forEach(function (node) {
        node.data('originalPosition', node.position()); // store original position
    });
});

// // remember original node positions
// cy.nodes().forEach(function (node) {
//     node.data('orgPos', node.position());
// });

cy.on('tap', 'node', function () {
    var nodes = this;
    var edges = nodes.connectedEdges();

    // check if the node has any child 'hidden'
    var hasHiddenChild = edges.connectedNodes().some(function (node) {
        return node.style('visibility') === 'hidden';
    });

    if (hasHiddenChild) {
        // make the children visible and animate them to their original positions
        edges.style('visibility', 'visible');
        edges.connectedNodes().style('visibility', 'visible').animate({
            position: function (node) { // function to return original position
                return node.data('originalPosition');
            }
        }, {
            duration: 500
        });
    } else {
        // execute the eating animation
        edges.style('visibility', 'visible');
        edges.connectedNodes().style('visibility', 'visible');

        nodes.addClass('eater');

        var food = [];

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
                        thisFood.style('visibility', 'hidden'); // hide the food instead of removing
                        eater.removeClass('eating');
                    }
                });

                delay += duration;
            })();
        } // for
    }
}); // on tap

