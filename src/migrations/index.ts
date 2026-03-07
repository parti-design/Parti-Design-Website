import * as migration_20260306_194129 from './20260306_194129';
import * as migration_20260307_124310 from './20260307_124310';

export const migrations = [
  {
    up: migration_20260306_194129.up,
    down: migration_20260306_194129.down,
    name: '20260306_194129',
  },
  {
    up: migration_20260307_124310.up,
    down: migration_20260307_124310.down,
    name: '20260307_124310'
  },
];
