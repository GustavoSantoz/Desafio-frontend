import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Form from "./Form";

const AuthCard: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

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
        <Form
          isRegister={isRegister}
          onToggle={() => setIsRegister(!isRegister)}
        />
      </CardContent>
    </Card>
  );
};

export default AuthCard;
