import hex8 from './data/Hex8';
import hex9 from './data/Hex9';
import hex10 from './data/Hex10';
import hex11 from './data/Hex11';

export default layersConfig = [
  {
    id: 'layer_hex8',
    label: 'Hex8',
    data: hex8,
    minZoom: 0,
    maxZoom: 12
  },
  {
    id: 'layer_hex9',
    label: 'Hex9',
    data: hex9,
    minZoom: 12,
    maxZoom: 15
  },
  {
    id: 'layer_hex10',
    label: 'Hex10',
    data: hex10,
    minZoom: 15,
    maxZoom: 18
  },
  {
    id: 'layer_hex11',
    label: 'Hex11',
    data: hex11,
    minZoom: 18,
    maxZoom: 26
  },
//   {
//     id: 'layer_hex12',
//     label: 'Hex12',
//     data: hex12,
//     minZoom: 11,
//     maxZoom: 99
//   }
];
