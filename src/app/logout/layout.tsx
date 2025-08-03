import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Déconnexion - RegUI'
}

// Ajoute ce composant par défaut :
export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}