import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl from '@kepler.gl/components';
import {addDataToMap} from '@kepler.gl/actions';
import {layerToggleVisibility} from '@kepler.gl/actions';
import {processCsvData} from '@kepler.gl/processors';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import layersConfig from "./layer"


// Redux Setup
const reducers = combineReducers({
  keplerGl: keplerGlReducer
});
const middlewares = enhanceReduxMiddleware([]);
const store = createStore(reducers, {}, compose(applyMiddleware(...middlewares)));


// Zoom Handler with layerToggleVisibility
const ZoomHandler = () => {
  const dispatch = useDispatch();
  const zoom = useSelector(state => state.keplerGl?.map?.mapState?.zoom);
  const layers = useSelector(state => state.keplerGl?.map?.visState?.layers);

  useEffect(() => {
    if (zoom === undefined || !layers) return;

    layersConfig.forEach(l => {
      const layer = layers.find(_ => _.id === l.id);
      const shouldBeVisible = zoom >= l.minZoom && zoom <= l.maxZoom;

      if (layer?.config?.isVisible !== shouldBeVisible) {
        dispatch(layerToggleVisibility(l.id, shouldBeVisible));
      }
    });
  }, [zoom, dispatch, layers]);

  return null;
};


// App Component
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(
    addDataToMap({
      datasets: layersConfig.map(l => ({
        info: {label: l.label, id: l.id},
        data: processCsvData(l.data)
      })),
      config: {
        visState: {
          layers: layersConfig.map(l => ({
            id: l.id,
            type: 'hexagonId',
            config: {
              dataId: l.id,
              label: l.label,
              columns: {hex_id: 'h3_index'},
              isVisible: false, // default semua off, nanti dikontrol dari ZoomHandler
              colorField: {
                name: '_sum',
                type: 'real'
              },
              colorScale: 'quantize',
              sizeField: {
                name: '_sum',
                type: 'real'
              },
              sizeScale: 'sqrt',
              visConfig: {
                opacity: 0.8,
                elevationScale: 5,
                enable3d: true
              }
            }
          }))
        }
      }
    })
  );
}, [dispatch]);


  return (
    <div style={{position: 'absolute', width: '100%', height: '100%'}}>
      <ZoomHandler />
      <AutoSizer>
        {({height, width}) => (
          <KeplerGl
            id="map"
            mapboxApiAccessToken="YOUR_MAPBOX_TOKEN_HERE"
            width={width}
            height={height}
          />
        )}
      </AutoSizer>
    </div>
  );
};

// Bootstrap
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
