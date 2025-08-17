'use client';
// Import des composants PrimeReact
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
// Import des composants React
import  { useState, useEffect } from 'react';
// Import composants Next.js
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function SetupPage(){


    const router = useRouter();
    // Implémentation de la page de mise en route de RegUI
    const [email,setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');

    useEffect(()=> {
        // Vérification de l'installation de la base de données
        fetch('/api/install/checkInstall')
        try {
            fetch('/api/install/checkInstall')
            .then( response => {
                if (response.status === 200 ){
                    // Installation ok, redirection
                    const data:unknown = response.json();
                    if ((data as {version : string}).version){
                        router.replace('/');
                    }
                }
            })
        } catch (error) {
            console.info('Database not configured, waiting for setup');
        }
    },[router])

    // Traitement du formulaire pour créer le premier compte
    const handleSumit = async (e:React.FormEvent) => {
        e.preventDefault();
        if (password !== cPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        await fetch('/api/install', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                firstName,
                lastName,
                password,
                cPassword
            })
        });
        router.replace('/');
    }

    return (
        <div>
            <Card title="Configuration de RegUI" style={{ width: '50%', margin: 'auto', marginTop: '2em' }}>
                <Image src="/favicon.ico" alt="RegUI Logo" width="100" height="100" className="mb-3" />
                <p>Bienvenue sur la page de configuration de RegUI.</p>
                <p>Les paramètres de bases de données doivent être indiqués dans les variables d&apos;environnement de l&apos;application.</p>
                <p>Créons le premier utilisateur de votre application.</p>
                <div style={{ height:'1.5rem'}}></div>
                <form onSubmit={handleSumit}>
                    <FloatLabel>
                        <InputText id="email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                    <div style={{ height:'1.5rem'}}></div>
                    <div className="grid grid-cols-2 gap-3">
                        <FloatLabel>
                            <InputText className="w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName"/>
                            <label htmlFor="firstName">Prenom</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText className="w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName"/>
                            <label htmlFor="lastName">Nom</label>
                        </FloatLabel>
                    </div>
                    <div style={{ height:'1.5rem'}}></div>
                    <div className="grid grid-cols-2 gap-3">
                        <FloatLabel>
                            <InputText className="w-full" value={password} type="password" onChange={(e) => setPassword(e.target.value)} id="password"/>
                            <label htmlFor="password">Mot de passe</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText className="w-full" value={cPassword} type="password" onChange={(e) => setCPassword(e.target.value)} id="cPassword"/>
                            <label htmlFor="cPassword">Confirmer le mot de passe</label>
                        </FloatLabel>
                    </div>
                    <div style={{ height:'1.5rem'}}></div>
                    <Button label="Démarrer l'application" className="w-full"/>
                </form>
            </Card>
        </div>
    )
}