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
            <div className="rule-list-item" style={style}>
                <input
                    type="checkbox"
                    checked={layer.getVisible()}
                    disabled={!toggleable}
                    onChange={(e) => { onToggleLayer(layer)}}
                    onClick={(e) => { e.stopPropagation() }}
                />
                { titleRenderer(layer) }
            </div>
        )
//        return (
//          <div className="rule-list-item" style={{ ...style }} onClick={(e) => { onSelectRule(rule.id)}}>
//            <input
//                type="checkbox"
//                checked={rule.enabled}
//                disabled={!toggleable}
//                onChange={(e) => { onToggleRule(rule)}}
//                onClick={(e) => { e.stopPropagation() }}
//            />
//            <div className="rule-title">
//                <div className="title" title={title}>{ title }</div>
//                <span className="subtitle">{ extension.subtitleRenderer(product, rule) }</span>
//            </div>
//            <div className="rule-icon drag-handle" title={i18n('com.visallo.product.styles.rule.list.item.sort.help')}></div>
//          </div>
//        );
    };

    const titleRenderer = (layer) => {
        const { label, element } = layer.getProperties();

        if (label) {
            return label;
        } else if (element) {
            return F.vertex.title(element);
        } else {
            return 'No title available';
        }
    };

    return SortableElement(MapLayerItem);
});
