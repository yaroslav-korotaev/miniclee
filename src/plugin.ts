import type {
  Args,
  Plugin,
} from './types';

export function plugin<D, E>(plugin: Plugin<D, E>): Plugin<D, E> {
  return plugin;
}

export function inject<E>(get: (args: Args) => E): Plugin<{}, E> {
  return plugin({
    middleware: async (args, ctx, next) => {
      await next(get(args));
    },
  });
}
