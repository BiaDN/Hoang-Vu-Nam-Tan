export type ResponseType<T> = {
  statusCode: number
  message: string
  data: T
}

export type TError = {
  message: string;
}