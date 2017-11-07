define([
    'react-redux',
    'react-dom',
    'configuration/plugins/registry',
    'data/web-worker/store/selection/actions',
    'data/web-worker/store/product/actions',
    'data/web-worker/store/product/selectors',
    'data/web-worker/store/ontology/selectors',
    'util/dnd',
    './worker/actions',
    'components/DroppableHOC',
    './Map'
], function(
    redux,
    ReactDom,
    registry,
    selectionActions,
    productActions,
    productSelectors,
    ontologySelectors,
    dnd,
    mapActions,
    DroppableHOC,
    Map) {
    'use strict';

    registry.registerExtension('org.visallo.product.toolbar.item', {
        identifier: 'org-visallo-map-layers',
        itemComponentPath: 'org/visallo/web/product/map/dist/MapLayersContainer',
        placementHint: 'popover',
        label: 'Layers',
        canHandle: (product) => product.kind === 'org.visallo.web.product.map.MapWorkProduct',
        initialize: () => {
            //set initial order + opacity
        }
    });

    const mimeTypes = [VISALLO_MIMETYPES.ELEMENTS];

    return redux.connect(

        (state, props) => {
            return {
                ...props,
                workspaceId: state.workspace.currentId,
                configProperties: state.configuration.properties,
                ontologyProperties: ontologySelectors.getProperties(state),
                panelPadding: state.panel.padding,
                selection: productSelectors.getSelectedElementsInProduct(state),
                viewport: productSelectors.getViewport(state),
                productElementIds: productSelectors.getElementIdsInProduct(state),
                product: productSelectors.getProduct(state),
                elements: productSelectors.getElementsInProduct(state),
                pixelRatio: state.screen.pixelRatio,
                mimeTypes,
                style: { height: '100%' }
            }
        },

        (dispatch, props) => {
            return {
                onClearSelection: () => dispatch(selectionActions.clear()),
                onSelectElements: (selection) => dispatch(selectionActions.set(selection)),
                onSelectAll: (id) => dispatch(productActions.selectAll(id)),

                onUpdatePreview: (id, dataUrl) => dispatch(productActions.updatePreview(id, dataUrl)),

                // TODO: these should be mapActions
                onUpdateViewport: (id, { pan, zoom }) => dispatch(productActions.updateViewport(id, { pan, zoom })),

                // For DroppableHOC
                onDrop: (event) => {
                    const elements = dnd.getElementsFromDataTransfer(event.dataTransfer);
                    if (elements) {
                        event.preventDefault();
                        event.stopPropagation();

                        dispatch(mapActions.dropElements(props.product.id, elements, { undoable: true }))
                    }
                },

                onDropElementIds(elementIds) {
                    dispatch(mapActions.dropElements(props.product.id, elementIds, { undoable: true }));
                },

                onRemoveElementIds: (elementIds) => {
                    dispatch(mapActions.removeElements(props.product.id, elementIds, { undoable: true }))
                },

                onVertexMenu: (element, vertexId, position) => {
                    $(element).trigger('showVertexContextMenu', { vertexId, position });
                }
            }
        }

    )(DroppableHOC(Map));
});
