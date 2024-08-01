import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Form from "../Form/AuthForm";
import { useAuthStore } from "@/stores/authStore";

const AuthCard = () => {
  const { isRegister, toggleIsRegister } = useAuthStore();

  return (
    <Card className="mx-auto max-w-sm h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {isRegister ? "Cadastro" : "Login"}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Crie sua conta inserindo seu e-mail e senha."
            : "Digite seu e-mail e senha para acessar sua conta."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form isRegister={isRegister} onToggle={toggleIsRegister} />
      </CardContent>
    </Card>
  );
};

export default AuthCard;
