import { DB_NAME, STORE_NAME } from "@/utils/constants";
import { SpendingHistoryRequest, SpendingHistoryResponse } from "@/utils/types";
import { openDB } from "idb";
import { format } from "date-fns";
type Transaction = {
  title: string;
  money: number;
  id: number;
  date: string;
};
type GroupedTransactions = Record<string, Transaction[]>;

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains("salary")) {
        db.createObjectStore("salary");
      }
    },
  });
  return db;
};

export const addTransaction = async (transaction: SpendingHistoryRequest) => {
  try {
    const db = await initDB();
    const result = await db.add("transactions", transaction);
    console.log("데이터 추가 성공:", result);
  } catch (error) {
    console.error("데이터 추가 실패:", error);
    throw error;
  }
};
export const getTransactions = async (): Promise<SpendingHistoryResponse[]> => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const groupTransactionsByDate = async () => {
  const transactions = await getTransactions();
  const grouped = transactions
    .map(({ date, ...rest }) => ({
      ...rest,
      date: format(date as Date, "yyyy-MM-dd"),
    }))
    .map((e) => {
      return {
        [e.date]: e,
      };
    })
    .reduce((acc: GroupedTransactions, item) => {
      const [key, transaction] = Object.entries(item)[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(transaction);
      return acc;
    }, {});

  return grouped;
  // console.log("transactions", transactions);
  // const grouped = transactions.reduce((acc, transaction) => {
  //   const date = new Date(transaction.date as Date).toISOString().split("T")[0]; // YYYY-MM-DD 형식
  //   if (!acc[date]) {
  //     acc[date] = [];
  //   }
  //   acc[date].push({
  //     ...transaction,
  //     money: transaction.money.toLocaleString(),
  //     date: format(transaction.date as Date, "yyyy-MM-dd"),
  //   });
  //   return acc;
  // }, {} as Record<string, { title: string; money: string; date: string }[]>);
  // return grouped;
};

export const addSalaryForMonth = async (salary: number) => {
  const db = await initDB();
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const key = `${year}-${month}`;
  await db.add("salary", salary, key);
};

export const getSalaryForMonth = async () => {
  const db = await initDB();
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const key = `${year}-${month}`;
  return await db.get("salary", key);
};
