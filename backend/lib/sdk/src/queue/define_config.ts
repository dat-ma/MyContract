import { QueueConfig } from "../../types/queue.js";

export function defineConfig<T extends Record<string, any>>(
  config: QueueConfig<T>
): QueueConfig<T> {
  return config
}
