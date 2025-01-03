import React, { useEffect, useState } from "react";
import { getTransactions } from "@/utils/db";
import TransactionForm from "@/components/TransactionForm";
import Calendar from "@/components/Calendar";
import styled from "styled-components";
import { SpendingHistoryResponse } from "@/utils/types";
import { SalaryForm } from "@/components/SalaryForm";

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<SpendingHistoryResponse[]>(
    [],
  );

  const fetchTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Layout>
      <Heading1>가계부</Heading1>
      <SalaryForm onTransactionAdded={fetchTransactions} />
      <TransactionForm onTransactionAdded={fetchTransactions} />
      <Calendar transactions={transactions} />
    </Layout>
  );
};

export default App;

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const Heading1 = styled.h1`
  margin: 30px;
`;
