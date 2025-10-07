"use client";

import { useRouter } from "next/navigation";


export default function LogoutPage() {
    const router = useRouter();

    fetch('/api/logout').then((res)=>{
        if (res.ok){
            localStorage.clear();
            router.replace('/login');
        }
    });

    return (
        <div>
            <h1>Déconnexion en cours...</h1>
            <p>Vous allez être redirigé vers la page de connexion.</p>
        </div>
    );
}