import CustomPaletteProvider from './CustomPaletteProvider';
import CustomReplaceMenuProvider from './CustomReplaceMenuProvider';
export default {
  __init__: [ 'ReplaceMenuProvider' ],
  'paletteProvider': [ 'type', CustomPaletteProvider ],
  ReplaceMenuProvider: [ 'type', CustomReplaceMenuProvider ],
};