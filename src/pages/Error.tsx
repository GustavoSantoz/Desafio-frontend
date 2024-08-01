import { Button } from "@/components/ui/button";

const NotFoundPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 rounded-lg">
        <div className="text-center">
            <h1 className="text-8xl font-bold text-gray-200">
                404
            </h1>
            <h2 className="mb-6 text-2xl font-bold text-gray-200">
                Ops! Essa página não pode ser encontrada.
            </h2>
            <p className="mb-8 text-gray-200">
                Desculpe, mas a página que você procura não existe.
            </p>
            <Button
                variant="outline"
                type="button"
                onClick={() => window.history.back()}
            >
                Voltar
            </Button>
        </div>
    </div>
);

export default NotFoundPage;
