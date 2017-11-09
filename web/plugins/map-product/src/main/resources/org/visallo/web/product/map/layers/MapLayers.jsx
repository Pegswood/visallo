define([
    'prop-types',
    'create-react-class',
    'react-sortable-hoc',
    './MapLayersList',
    '../util/layerHelpers'
], function(
    PropTypes,
    createReactClass,
    { arrayMove },
    MapLayersList,
    layerHelpers) {

    const MapLayers = createReactClass({

        getInitialState() {
            return { futureIndex: null }
        },

        componentWillReceiveProps(nextProps) {
            if (nextProps.layerOrder !== this.props.layerOrder && this.state.futureIndex) {
                this.setState({ futureIndex: null });
            }
        },

        render() {
            const { futureIndex } = this.state;
            const { baseLayer, layers, editable, ol, map } = this.props;
            const layerList = futureIndex ? arrayMove(layers, futureIndex[0], futureIndex[1]) : layers;

            return (
                <div className="map-layers">
                    <MapLayersList
                        baseLayer={baseLayer}
                        layers={layerList}
                        editable={editable}
                        onToggleLayer={this.onToggleLayer}
                        onSelectLayer={this.onSelectLayer}
                        onOrderLayer={this.onOrderLayer}
                    />
                </div>
            );
        },

        onOrderLayer(oldSubsetIndex, newSubsetIndex) {
            const { product, layerIds, layerOrder, setLayerOrder } = this.props;
            const orderedSubset = arrayMove(layerIds, oldSubsetIndex, newSubsetIndex);

            const oldIndex = layerOrder.indexOf(orderedSubset[newSubsetIndex]);
            let newIndex;
            if (newSubsetIndex === orderedSubset.length - 1) {
                const afterId = orderedSubset[newSubsetIndex - 1];
                newIndex = layerOrder.indexOf(afterId);
            } else {
                const beforeId = orderedSubset[newSubsetIndex + 1];
                const displacementOffset = oldSubsetIndex > newSubsetIndex ? 0 : 1;
                newIndex = Math.max((layerOrder.indexOf(beforeId) - displacementOffset), 0);
            }

            //optimistically update item order in local component state so it doesn't jump
            this.setState({ futureIndex: [ oldSubsetIndex, newSubsetIndex ]});

            setLayerOrder(arrayMove(layerOrder, oldIndex, newIndex));
        },

        onToggleLayer(layer) {
            const { product, layersConfig, updateLayerConfig } = this.props;

            const layerId = layer.get('id');
            const config = { ...(layersConfig[layerId] || {}), visible: !layer.getVisible() };

            layerHelpers.setLayerConfig(config, layer);
            updateLayerConfig(config, layerId);
        }

    });

    return MapLayers;
});
