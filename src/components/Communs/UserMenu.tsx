import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import supabase from '@/Supabase/supabaseClient';
import UserAvatar from '@/components/Communs/Avatar';


const User = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw new Error('Erro ao sair: ' + error.message);
            }

            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button>
                    <UserAvatar />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer'>Perfil</DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>Equipe</DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>Assinatura</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' onClick={handleSignOut}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default User;
