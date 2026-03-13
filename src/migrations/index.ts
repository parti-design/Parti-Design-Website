import * as migration_20260306_194129 from './20260306_194129';
import * as migration_20260307_124310 from './20260307_124310';
import * as migration_20260310_172907 from './20260310_172907';
import * as migration_20260313_184605_add_venture_theme_color from './20260313_184605_add_venture_theme_color';
import * as migration_20260314_001000_update_venture_status_stages from './20260314_001000_update_venture_status_stages';
import * as migration_20260314_001500_convert_venture_theme_color_to_hex from './20260314_001500_convert_venture_theme_color_to_hex';

export const migrations = [
  {
    up: migration_20260306_194129.up,
    down: migration_20260306_194129.down,
    name: '20260306_194129',
  },
  {
    up: migration_20260307_124310.up,
    down: migration_20260307_124310.down,
    name: '20260307_124310',
  },
  {
    up: migration_20260310_172907.up,
    down: migration_20260310_172907.down,
    name: '20260310_172907',
  },
  {
    up: migration_20260313_184605_add_venture_theme_color.up,
    down: migration_20260313_184605_add_venture_theme_color.down,
    name: '20260313_184605_add_venture_theme_color'
  },
  {
    up: migration_20260314_001000_update_venture_status_stages.up,
    down: migration_20260314_001000_update_venture_status_stages.down,
    name: '20260314_001000_update_venture_status_stages',
  },
  {
    up: migration_20260314_001500_convert_venture_theme_color_to_hex.up,
    down: migration_20260314_001500_convert_venture_theme_color_to_hex.down,
    name: '20260314_001500_convert_venture_theme_color_to_hex',
  },
];
