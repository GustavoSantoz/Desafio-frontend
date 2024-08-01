import { useEffect, useState } from 'react';
import supabase from '@/Supabase/supabaseClient';
import { getInitialsFromEmail } from '@/utils/getAvatar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const UserAvatar = () => {
    const [initials, setInitials] = useState<string>('');

    useEffect(() => {
        const fetchInitials = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;

                const userEmail = data.session?.user.email;
                if (userEmail) {
                    setInitials(getInitialsFromEmail(userEmail));
                }
            } catch (error) {
                console.error('Erro ao obter sessão do usuário:', error);
            }
        };

        fetchInitials();
    }, []);

    return (
        <Avatar>
            <AvatarImage  alt="Avatar" />
            <AvatarFallback>{initials || 'EU'}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
