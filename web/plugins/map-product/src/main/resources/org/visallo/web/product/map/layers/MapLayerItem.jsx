define([
    'prop-types',
    'react-sortable-hoc',
    'util/vertex/formatters'
], function(
    PropTypes,
    { SortableElement },
    F) {

    const MapLayerItem = ({ layer, style, toggleable, onToggleLayer }) => {
        return (
            <div className="layer-item" style={{ ...style, zIndex: 50 }}>
                <input
                    type="checkbox"
                    checked={layer.getVisible()}
                    disabled={!toggleable}
                    onChange={(e) => { onToggleLayer(layer)}}
                    onClick={(e) => { e.stopPropagation() }}
                />
                <div className="layer-title">{ titleRenderer(layer) }</div>
                <div
                    className="layer-icon drag-handle"
                    title={i18n('org.visallo.web.product.map.MapWorkProduct.layers.sort.help')}
                ></div>
            </div>
        )
    };

    const titleRenderer = (layer) => {
        const { label, element } = layer.getProperties();

        if (label) {
            return label;
        } else if (element) {
            return F.vertex.title(element);
        } else {
            return i18n('org.visallo.map.layer.no.title');
        }
    };

    return SortableElement(MapLayerItem);
});
