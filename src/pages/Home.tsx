import React from "react";
import CardLogin from "@/components/Login/CardLogin";

const Home: React.FC = () => {
  return (
    <>
      <main className="flex justify-center items-center flex-col mt-20 ">
        <CardLogin />
      </main>
    </>
  );
};

export default Home;
