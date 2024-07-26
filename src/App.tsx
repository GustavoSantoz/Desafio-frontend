import "./App.css";

import { create } from "zustand";
import { Button } from "@/components/ui/button"

interface BearState {
  bears: number;
  increasePopulation: () => void;
}

const useStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears: number) => set({ bears: newBears }),
}));

function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold">
        <BearCounter />
        <Controls />
        <Button>Click me</Button>
      </h1>
    </>
  );
}

export default App;
