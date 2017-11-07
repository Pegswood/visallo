define([
    'react-redux',
    'data/web-worker/store/selection/actions',
    'data/web-worker/store/product/actions',
    'data/web-worker/store/product/selectors',
    'data/web-worker/store/ontology/selectors',
    '../worker/actions',
    './MapLayers'
], function(
    redux,
    selectionActions,
    productActions,
    productSelectors,
    ontologySelectors,
    mapActions,
    MapLayers) {
    'use strict';

    const mimeTypes = [VISALLO_MIMETYPES.ELEMENTS];

    return redux.connect(
        (state, props) => {
            const { product, map, cluster, layersWithSources, ...injectedProps } = props;
            const editable = state.workspace.byId[state.workspace.currentId].editable;
            const layers = map.getLayers().getArray().slice(0).reverse();
            const layerOrder = layers.reduce((order, layer) => {
                order.push(layer.get('id'));
                return order;
            }, []);

            return {
                ...injectedProps,
                product,
                map,
                layerOrder,
                layers,
                editable
            };
        },
        (dispatch, props) => {
            return {
                setLayerOrder: (layerOrder) => dispatch(mapActions.setLayerOrder(props.product.id, layerOrder))
            };
        }
    )(MapLayers)
});
