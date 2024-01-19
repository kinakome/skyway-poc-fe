import { format } from 'date-fns';

export const formatDateArgsString = (date: string): string => {
  return format(new Date(date), 'yyyy/MM/dd');
};

export const formatDateArgsDate = (date: Date): string => {
  return format(date, 'yyyy/MM/dd');
};

export const classNames = (...classNames: string[]): string => {
  return classNames
    .map((className) => {
      return className;
    })
    .join(' ')
    .trim();
};
