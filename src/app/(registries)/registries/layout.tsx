import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Registres - RegUI'
}

// Ajoute ce composant par défaut :
export default function RegistriesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}