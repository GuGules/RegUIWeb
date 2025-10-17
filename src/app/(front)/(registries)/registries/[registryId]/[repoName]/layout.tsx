import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: `Image - RegUI`
}

// Ajoute ce composant par défaut :
export default function RegistriesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}