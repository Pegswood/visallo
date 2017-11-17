define([
    'public/v1/api',
    'openlayers',
    '../util/layerHelpers',
    'util/mapConfig',
    'util/vertex/formatters'
], function(
    api,
    ol,
    layerHelpers,
    mapConfig,
    F) {
    'use strict';

    return api.defineComponent(GeoShapePreview);

    function GeoShapePreview() {

        this.attributes({
            ignoreUpdateModelNotImplemented: true
        })

        this.before('initialize', function(node, config) {
            this.element = config.model;

            $(node).css({
                'height': '240px',
                'margin-top': '1px',
                'overflow': 'hidden'
            })
        });

        this.after('initialize', function() {
            this.setupMap();
        })

        this.setupMap = function() {
            const { vectorXhr: layerHelper, tile } = layerHelpers.byType;
            const { source, sourceOptions } = mapConfig();

            const { layer: tileLayer } = tile.configure('base', { source, sourceOptions });
            const { source: olSource, layer: geoShapeLayer } = layerHelper.configure(this.element.id, {
                id: this.element.id,
                element: this.element,
                propName: 'http://visallo.org#raw',
                propKey: '',
                mimeType: F.vertex.prop(this.element, 'http://visallo.org#mimeType')
            });

            const map = new ol.Map({
                target: this.node,
                layers: [
                    tileLayer,
                    geoShapeLayer
                ],
                controls: [new ol.control.Zoom()],
                view: new ol.View({
                    zoom: 2,
                    minZoom: 1,
                    center: [0, 0],
                })
            });

            this.geoShapeLayer = geoShapeLayer;
            this.map = map;

            layerHelper.loadFeatures(olSource, geoShapeLayer)
                .then(() => {
                    const view = this.map.getView();
                    const olSource = this.geoShapeLayer.getSource();
                    view.fit(olSource.getExtent());
                });
        };
    }
});
