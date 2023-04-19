export type Args = Record<string, string | undefined>;
export type Next<E> = (extension: E) => Promise<void>;
export type Middleware<C, E> = (args: Args, ctx: C, next: Next<E>) => Promise<void>;
export type Handler<C> = (args: Args, ctx: C) => Promise<void>;

export type Plugin<C, E> = {
  middleware: Middleware<C, E>;
};

export type Main<C> = {
  handler: Handler<C>;
};

export type Exec = (args: Args) => Promise<void>;
