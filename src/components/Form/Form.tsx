import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, FormData } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import supabase from "@/api/supabaseClient";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import { useAuthStore } from "@/components/stores/useStore";
import { useNavigate } from "react-router-dom";

interface FormProps {
  isRegister: boolean;
  onToggle: () => void;
}

const Form: React.FC<FormProps> = ({ isRegister, onToggle }) => {
  const { email, password, setEmail, setPassword } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
      password,
    },
  });

  const onSubmit = async (data: FormData) => {
    setEmail(data.email);
    setPassword(data.password);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error("Erro ao se registrar: " + error.message);
      } else {
        toast.success("Registro bem-sucedido!");
        setTimeout(() => {
          navigate("/inventory");
        }, 2000);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error("Erro ao fazer login: " + error.message);
      } else {
        toast.success("Login bem-sucedido!");
        setTimeout(() => {
          navigate("/inventory");
        }, 2000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        id="email"
        label="Email"
        type="email"
        placeholder="m@example.com"
        register={register}
        error={errors.email?.message}
      />
      <FormInput
        id="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password?.message}
      />
      <Button type="submit" className="w-full">
        {isRegister ? "Register" : "Login"}
      </Button>
      <Button type="button" className="w-full mt-2" onClick={onToggle}>
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </Button>
    </form>
  );
};

export default Form;
