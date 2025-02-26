export type TSuccessResponse<T> = {
  error: number;
  statusCode: number;
  data: T;
  message: string;
};

export const handleSuccessResponse = <T>(data: T, message: string, statusCode: number): TSuccessResponse<T> => {
  return {
    error: 0,
    statusCode,
    data,
    message,
  };
};
