import { DateValue } from "junyeol-components";

export type SpendingHistoryResponse = {
  title: string;
  money: number;
  date: DateValue | null;
  id: number;
};

export interface SpendingHistoryRequest {
  title: string;
  money: number;
  date: DateValue | null;
}
