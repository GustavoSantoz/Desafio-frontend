import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, FormData } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import supabase from "@/Supabase/supabaseClient";
import FormInput from "../Auth/AuthInput";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

interface FormProps {
  isRegister: boolean;
  onToggle: () => void;
}

const Form = ({ isRegister, onToggle: handleToggle }: FormProps) => {
  const { email, password, setEmail, setPassword, isLoading, setLoading } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email, password },
  });

  const onSubmit = async (data: FormData) => {
    setEmail(data.email);
    setPassword(data.password);
    setLoading(true);

    try {
      let response;
      if (isRegister) {
        response = await supabase.auth.signUp({ email: data.email, password: data.password });
      } else {
        response = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      setTimeout(() => {
        navigate('/inventory');
        setLoading(false);
      }, 1500);
    } catch (error) {
      const typedError = error as Error;
      toast.error(`${isRegister ? 'Cadastro' : 'Login'} falhou: ${typedError.message}`);
      setLoading(false);
    }
  };




  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        id="email"
        label="E-mail"
        type="email"
        placeholder="m@example.com"
        register={register}
        error={errors.email?.message}
      />
      <FormInput
        id="password"
        label="Senha"
        type="password"
        register={register}
        error={errors.password?.message}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : isRegister ? 'Cadastrar' : 'Acessar'}
      </Button>
      <Button type="button" className="w-full mt-2" onClick={handleToggle} disabled={isLoading}>
        {isRegister ? 'Fazer login' : 'Fazer cadastro'}
      </Button>
    </form>
  );
};

export default Form;
