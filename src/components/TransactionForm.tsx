import { addTransaction } from "@/utils/db";
import { Button, DatePicker, DateValue } from "junyeol-components";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

type TransactionFormProps = {
  onTransactionAdded: () => void; // 리스트 업데이트 콜백
};

type Inputs = {
  title: string;
  money: string;
};

const TransactionForm = ({ onTransactionAdded }: TransactionFormProps) => {
  const [date, setDate] = useState<DateValue | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async ({ title, money }) => {
    await addTransaction({ title, money: parseFloat(money), date });
    setDate(null);
    reset();
    onTransactionAdded();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormItems>
          <FormItem>
            <input
              type="text"
              placeholder="뭐 샀어"
              {...register("title", { required: true })}
            />
            {errors.title && <span>This field is required</span>}
          </FormItem>
          <FormItem>
            <input
              type="number"
              placeholder="얼마썼어"
              {...register("money", { required: true })}
            />
            {errors.money && <span>This field is required</span>}
          </FormItem>
          <FormItem>
            <DatePicker
              placeholder="날짜를 선택해주세요"
              value={date}
              onChange={setDate}
            />
          </FormItem>
        </FormItems>

        <Button type="submit">Add Transaction</Button>
      </Form>
    </>
  );
};

export default TransactionForm;

export const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  z-index: 9999;
`;

const FormItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;

  input {
    width: 200px;
    height: 30px;
    padding: 5px 10px;
    color: #667ba3;
    border: 1px #b2bdd1 solid;
    border-radius: 3px;

    &::placeholder {
      color: #b2bdd1;
    }
  }
`;
