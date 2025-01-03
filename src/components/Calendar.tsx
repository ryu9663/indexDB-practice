import { getSalaryForMonth, groupTransactionsByDate } from "@/utils/db";
import { SpendingHistoryResponse } from "@/utils/types";
import { useEffect, useState } from "react";
import styled from "styled-components";

type Transaction = { title: string; money: number; date: string };

type GroupedTransactions = Record<string, Transaction[]>;

interface CalendarProps {
  transactions: SpendingHistoryResponse[];
}

const Calendar = ({ transactions }: CalendarProps) => {
  const [transactionsByDate, setTransactionsByDate] =
    useState<GroupedTransactions>({});

  const [salary, setSalary] = useState<number>(0);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchData = async () => {
      const grouped = await groupTransactionsByDate();

      setTransactionsByDate(grouped);
    };
    fetchData();
  }, [transactions]);

  useEffect(() => {
    const fetchSalary = async () => {
      const _salary = await getSalaryForMonth();
      setSalary(_salary);
    };

    fetchSalary();
  }, [transactions]);

  // 올해 1월 1일 날짜 계산
  const currentYear = new Date().getFullYear();
  const firstDayOfMonth = new Date(currentYear, 0, 1); // 1월 1일
  const firstWeekday = firstDayOfMonth.getDay(); // 요일 (0 = Sunday, 1 = Monday, ...)

  // 1월의 총 일수 계산
  const daysInMonth = new Date(currentYear, 1, 0).getDate();

  const totalSpending = transactions.reduce((acc, cur) => acc + cur.money, 0);

  return (
    <Wrapper>
      <MoneyInfos>
        <Info>월급: {salary?.toLocaleString() || 0}원,</Info>
        <Info>총 쓴 금액: {totalSpending.toLocaleString()}원,</Info>
        <Info>잔액: {(salary - totalSpending).toLocaleString()}원</Info>
      </MoneyInfos>
      <CalendarWrapper>
        {/* 요일 헤더 */}
        <CalendarHeader>
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </CalendarHeader>

        {/* 날짜별 데이터 */}
        <CalendarContainer>
          {/* 빈칸 추가 (1월 1일 이전) */}
          {Array.from({ length: firstWeekday }).map((_, index) => (
            <DayBox key={`empty-${index}`} />
          ))}

          {/* 1월의 각 날짜 */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            if (index === 0) {
              return;
            }
            const date = new Date(currentYear, 0, index + 1)
              .toISOString()
              .split("T")[0]; // YYYY-MM-DD 형식

            return (
              <DayBox key={index}>
                <DayHeader>{index}</DayHeader>
                {transactionsByDate[date]?.length ? (
                  <TransactionList>
                    {transactionsByDate[date].map(({ title, money }, i) => (
                      <div key={i}>
                        {title}: {money}원
                      </div>
                    ))}
                  </TransactionList>
                ) : (
                  <NoData>No Transactions</NoData>
                )}
              </DayBox>
            );
          })}
        </CalendarContainer>
      </CalendarWrapper>
    </Wrapper>
  );
};

export default Calendar;

const Wrapper = styled.div`
  z-index: 1;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MoneyInfos = styled.div`
  display: flex;
  gap: 10px;
`;

const Info = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const CalendarWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  text-align: center;
  background-color: #f1f1f1;
  padding: 10px 0;
  margin-bottom: 10px;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const DayBox = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 100px;
  background-color: #fff;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const DayHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
`;

const TransactionList = styled.div`
  font-size: 12px;
  overflow-y: auto;
  max-height: 70px;

  & > div {
    margin-bottom: 4px;
  }
`;

const NoData = styled.div`
  color: #999;
  font-size: 12px;
`;
