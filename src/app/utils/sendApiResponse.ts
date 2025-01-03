import { Response } from 'express';

type TLinks = {
  [key: string]: {
    href: string;
    method: string;
  };
};

type TPagination = {
  totalPage: number;
  totalItems: number;
  page: number;
  limit: number;
};

type TResponseData<T> = {
  statusCode: number;
  message: string;
  payload: T;
  accessToken?: string;
  links?: TLinks;
  pagination?: TPagination;
};

export const sendApiResponse = <T>(res: Response, data: TResponseData<T>) => {
  const dataResponse: {
    payload: T;
    pagination?: TPagination;
    links?: TLinks;
  } = {
    payload: data.payload,
  };

  if (data.pagination) dataResponse.pagination = data.pagination;
  if (data.links) dataResponse.links = data.links;

  return res.status(data?.statusCode).json({
    success: true,
    message: data?.message,
    accessToken: data.accessToken,
    data: dataResponse,
  });
};