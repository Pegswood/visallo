define([
    'prop-types',
    'create-react-class',
    'react-virtualized',
    './SortableList',
    './MapLayerItem'
], function(
    PropTypes,
    createReactClass,
    { AutoSizer },
    SortableList,
    MapLayerItem) {

    const ROW_HEIGHT = 40;
    const SORT_DISTANCE_THRESHOLD = 10;

    const MapLayersList = ({ layers, editable, onOrderLayer, ...itemProps }) => (
        <div className="rule-list">
            {layers.values ?
                <div className="flex-fix">
                    <AutoSizer>
                        {({ width, height }) => (
                            <SortableList
                                ref={(instance) => { this.SortableList = instance; }}
                                items={layers}
                                shouldCancelStart={() => !editable}
                                onSortStart={() => {
                                    this.SortableList.container.classList.add('sorting')
                                }}
                                onSortEnd={({ oldIndex, newIndex }) => {
                                    this.SortableList.container.classList.remove('sorting');

                                    if (oldIndex !== newIndex) {
                                        onOrderLayer(oldIndex, newIndex);
                                    }
                                }}
                                rowRenderer={mapLayerItemRenderer({ editable, ...itemProps })}
                                rowHeight={ROW_HEIGHT}
                                lockAxis={'y'}
                                lockToContainerEdges={true}
                                helperClass={'sorting'}
                                distance={SORT_DISTANCE_THRESHOLD}
                                width={width}
                                height={height}
                            />
                        )}
                    </AutoSizer>
                </div>
            :
                <div className="empty">
                    <p>{ i18n('com.visallo.product.styles.rule.list.empty') }</p>
                </div>
            }
        </div>
    );

    const mapLayerItemRenderer = (itemProps) => (listProps) => {
        const { editable, ...rest } = itemProps;
        const { index, style, key, value: layer } = listProps;

        return (
            <MapLayerItem
                key={key}
                index={index}
                layer={layer}
                extension={'layer'}
                style={style}
                toggleable={editable}
                {...rest}
            />
        )
    };

    return MapLayersList;
});
