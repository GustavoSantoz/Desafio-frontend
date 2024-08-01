import { Label } from "../ui/label";

const Campo = ({ children, label, htmlFor, }: {
    children: React.ReactNode;
    label: string;
    htmlFor: string;
}) => (
    <div>
        <Label htmlFor={htmlFor}>{label}</Label>
        {children}
    </div>
);

export default Campo;