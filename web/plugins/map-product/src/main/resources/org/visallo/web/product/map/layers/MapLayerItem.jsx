define([
    'prop-types',
    'classnames',
    'react-sortable-hoc',
    'util/vertex/formatters'
], function(
    PropTypes,
    classNames,
    { SortableElement },
    F) {

    const MapLayerItem = ({ layer, style, toggleable, onToggleLayer }) => {
        const layerStatus = layer.get('status');
        const statusMessage = _.isObject(layerStatus) && layerStatus.message;
        const hasError = _.isObject(layerStatus) && layerStatus.type === 'error';

        return (
            <div className={classNames('layer-item', { 'error': hasError })} style={{ ...style, zIndex: 50 }}>
                <input
                    type="checkbox"
                    checked={layer.getVisible()}
                    disabled={!toggleable || hasError}
                    onChange={(e) => { onToggleLayer(layer)}}
                    onClick={(e) => { e.stopPropagation() }}
                />
                <div className="layer-title">
                    <div className="title">{ titleRenderer(layer) }</div>
                    <span className="subtitle" title={statusMessage}>{ statusMessage || null }</span>
                </div>
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
            return i18n('org.visallo.web.product.map.MapWorkProduct.layer.no.title');
        }
    };

    return SortableElement(MapLayerItem);
});
