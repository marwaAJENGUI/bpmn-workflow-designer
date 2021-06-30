import CustomPaletteProvider from './CustomPaletteProvider';
import ReplaceMenuProvider from './CustomReplaceMenuProvider';
export default {
  __init__: [ 'ReplaceMenuProvider' ],
  'paletteProvider': [ 'type', CustomPaletteProvider ],
  'ReplaceMenuProvider': [ 'type', ReplaceMenuProvider ],
};