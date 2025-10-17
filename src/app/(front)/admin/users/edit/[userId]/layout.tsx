import type { Metadata } from 'next'
import 'primereact/resources/themes/lara-light-blue/theme.css'; // ou un autre thème PrimeReact
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export const metadata: Metadata = {
    title: 'Modifier Utilisateur - RegUI'
}

// Ajoute ce composant par défaut :
export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}