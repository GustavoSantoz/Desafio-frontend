import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/components/stores/useStore";
import supabase from "@/api/supabaseClient";
import { toast } from "react-toastify";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = z.infer<typeof schema>;

const Component: React.FC = () => {
  const { email, password, setEmail, setPassword } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
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
    console.log(data);
    setEmail(data.email);
    setPassword(data.password);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Erro ao se registrar:", error.message);
        toast.error("Erro ao se registrar: " + error.message);
      } else {
        console.log("Registro bem-sucedido!");
        toast.success("Registro bem-sucedido!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Erro ao fazer login:", error.message);
        toast.error("Erro ao fazer login: " + error.message);
      } else {
        console.log("Login bem-sucedido!");
        toast.success("Login bem-sucedido!");
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {isRegister ? "Register" : "Login"}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Create your account by entering your email and password"
            : "Enter your email and password to login to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            {isRegister ? "Register" : "Login"}
          </Button>
          <Button
            type="button"
            className="w-full mt-2"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Switch to Login" : "Switch to Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Component;
