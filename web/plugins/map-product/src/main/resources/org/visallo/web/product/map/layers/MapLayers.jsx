define([
    'prop-types',
    'create-react-class',
    'react-sortable-hoc',
    './MapLayersList'
], function(
    PropTypes,
    createReactClass,
    { arrayMove },
    MapLayersList) {

    const MapLayers = createReactClass({

        getInitialState() {
            return { futureIndex: null }
        },

        componentWillReceiveProps(nextProps) {
            if (nextProps.layers !== this.props.layers && this.state.futureIndex) {
                this.setState({ futureIndex: null });
            }
        },

        render() {
            const { layers, editable, ol, map } = this.props;

            return (
                <div className="map-layers">
                    <MapLayersList
                        layers={layers}
                        editable={editable}
                        onToggleLayer={this.onToggleLayer}
                        onSelectLayer={this.onSelectLayer}
                        onOrderLayer={this.onOrderLayer}
                    />
                </div>
            );
        },

        onOrderLayer(oldSubsetIndex, newSubsetIndex) {
            const { product, layerOrder, setLayerOrder } = this.props;
            const productLayerOrder = product.extendedData.layerOrder;
            const orderedSubset = arrayMove(layerOrder, oldSubsetIndex, newSubsetIndex);

            const oldIndex = productLayerOrder.indexOf(orderedSubset[newSubsetIndex]);
            let newIndex;
            if (newSubsetIndex === orderedSubset.length - 1) {
                const afterId = orderedSubset[newSubsetIndex - 1];
                newIndex = productLayerOrder.indexOf(afterId);
            } else {
                const beforeId = orderedSubset[newSubsetIndex + 1];
                const displacementOffset = oldSubsetIndex > newSubsetIndex ? 0 : 1;
                newIndex = Math.max((productLayerOrder.indexOf(beforeId) - displacementOffset), 0);
            }

            //optimistically update rules order in local component state so it doesn't jump
            this.setState({ futureIndex: [ oldSubsetIndex, newSubsetIndex ]});

            setLayerOrder(arrayMove(productLayerOrder, oldIndex, newIndex));
        },

        onToggleLayer(layerId) {
            const { layers } = this.props;

            const layer = layers.find(layer => layer.get('id') === layerId);
            layer.setOpacity()
        }

    });

    return MapLayers;
});
