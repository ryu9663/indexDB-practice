import { addSalaryForMonth, getSalaryForMonth } from "@/utils/db";
import { Button } from "junyeol-components";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

type Inputs = {
  salary: string;
};

interface SalaryFormInterface {
  onTransactionAdded: () => void; // 리스트 업데이트 콜백
}
export const SalaryForm = ({ onTransactionAdded }: SalaryFormInterface) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [salary, setSalary] = useState<number>(0);
  const onSubmit: SubmitHandler<Inputs> = async ({ salary }) => {
    await addSalaryForMonth(parseFloat(salary));
    onTransactionAdded();
  };

  useEffect(() => {
    const fetchSalary = async () => {
      const _salary = await getSalaryForMonth();
      console.log(_salary);
      setSalary(_salary);
    };

    fetchSalary();
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="number"
        placeholder={`${
          salary ? salary.toLocaleString() + "원" : "월급을 한번만 입력하세요."
        }`}
        {...register("salary", { required: true })}
      />

      <Button type="submit">월급 입력</Button>
    </Form>
  );
};

const Form = styled.form`
  margin: 10px 0;
  display: flex;
  gap: 20px;
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
