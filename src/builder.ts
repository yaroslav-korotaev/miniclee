import type {
  Plugin,
  Main,
  Exec,
} from './types';

export type PluginBuilder<C> = {
  <E>(plugin: Plugin<C, E>): Builder<C & E>;
};

export type MainBuilder<C> = {
  (main: Main<C>): Builder<C>;
};

export type Builder<C> = {
  plugin: PluginBuilder<C>;
  main: MainBuilder<C>;
  build: () => Exec;
};

export function create(): Builder<{}> {
  let plugins: Plugin<any, any>[] = [];
  let command: Main<any> = null!;
  
  const builder: Builder<any> = {
    plugin: plugin => {
      plugins.push(plugin);
      return builder;
    },
    main: main => {
      command = main;
      return builder;
    },
    build: () => {
      return build(plugins, command);
    },
  };
  
  return builder;
}

export function build(plugins: Plugin<any, any>[], main: Main<any>): Exec {
  return async args => {
    const executePlugin = async (ctx: any, i: number): Promise<void> => {
      if (i < plugins.length) {
        const plugin = plugins[i];
        const middleware = plugin.middleware;
        
        await middleware(args, ctx, async extension => {
          await executePlugin({ ...ctx, ...extension }, i + 1);
        });
      } else {
        const handler = main.handler;
        
        await handler(args, ctx);
      }
    };
    
    await executePlugin({}, 0);
  };
}
