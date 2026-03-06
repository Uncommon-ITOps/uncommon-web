import * as migration_20260306_184006_initial from './20260306_184006_initial';

export const migrations = [
  {
    up: migration_20260306_184006_initial.up,
    down: migration_20260306_184006_initial.down,
    name: '20260306_184006_initial'
  },
];
