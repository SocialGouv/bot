import { Application, Context } from "probot";

export interface Hook<T> {
  (this: Application, context: Context<T>): Promise<void>;
}
