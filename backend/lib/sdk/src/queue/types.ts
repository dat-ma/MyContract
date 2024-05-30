import { ConnectionOptions, Job, JobsOptions, Queue, QueueOptions, WorkerOptions } from 'bullmq'

export { Job }

export type QueueConfig<T> = {
  connection: ConnectionOptions
  queue: QueueOptions
  queues: T
  jobs: JobsOptions
  worker: WorkerOptions
}

export interface QueueList {}
export type QueueName = keyof QueueList

export interface JobList {}
export type JobName = keyof JobList

export type DataForJob<K extends string> = K extends keyof JobList
  ? JobList[K]
  : Record<string, unknown>

export type DispatchOptions = JobsOptions & {
  queueName?: keyof QueueList
}

export type DispatchOverrides = Partial<{
  options: Partial<DispatchOptions>
  disabled: boolean
  payload: any
}>

export interface QueueService {
  dispatch<K extends JobName>(
    jobName: K,
    payload: DataForJob<K>,
    options: DispatchOptions
  ): Promise<Job<any, any, string> | null>
  process<Q extends QueueName>(queueName: Q): Promise<this>
  clear(queueName: QueueName): Promise<void>
  list(): Queue[]
  get<K extends QueueName>(queueName: K): Queue | null
  removeRepeatable(queues: Array<QueueName>): Promise<void>
  schedule<T extends JobName>(
    job: T,
    payload: DataForJob<T>,
    dispatchOptions: DispatchOptions,
    overrides?:
      | Partial<{
          options: Partial<DispatchOptions>
          disabled: boolean
          payload: any
        }>
      | undefined
  ): Promise<void>
}

export interface JobHandlerContract<TPayload = any> {
  handle(payload: TPayload): Promise<void>
  failed(): Promise<void>
}
