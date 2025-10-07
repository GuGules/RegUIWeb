"use client";

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { useEffect, useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';

export const profile_items = [
    {
        label: 'Mon Profil',
        icon: 'pi pi-user',
        command: () => window.location.href = '/profile'
    },
    {
        label: 'Déconnexion',
        icon: 'pi pi-sign-out',
        command: () => window.location.href = '/logout'
    }
];

export const items = [
    {
        label: 'Accueil',
        icon: 'pi pi-home',
        command: () => window.location.href = '/home'
    },
    {
        label: 'Registres',
        icon:  "pi pi-box",
        command: () => window.location.href = '/registries'
    }
];
export function EndMenu() {
    const menuRight = useRef<Menu>(null);

    return (
        <>
            <Menu model={profile_items} ref={menuRight} popup popupAlignment="right" />
            <Button
                label="Profil"
                icon="pi pi-user"
                className="mr-2"
                onClick={(event) => menuRight.current?.toggle(event)}
                aria-controls="popup_menu_right"
                aria-haspopup
            />
        </>
    );
}

export const start = (
    <img alt="logo" src="/favicon.ico" style={{ height: '2rem' }} className="mr-2" />
);

export const end = <EndMenu />;

export const CustomMenubar = () => {
    const [menuItems, setMenuItems] = useState(() => items.slice()); // copie initiale
    
    useEffect(() => {
        const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (userIsAdmin) {
             setMenuItems(prev => {
                if (prev.find(i => i.label === 'Administration')) return prev;
                return [
                    ...prev,
                    {
                        label: 'Administration',
                        icon: 'pi pi-cog',
                        items: [
                            { label: 'Paramètres', icon: 'pi pi-sliders-h', command: () => window.location.href = '/admin' },
                            { label: 'Utilisateurs', icon: 'pi pi-users', command: () => window.location.href = '/admin/users' },
                            { label: 'À propos', icon: 'pi pi-info-circle', command: () => window.location.href = '/admin/info' }
                        ]
                    }
                ];
            });
        }}, [items]);

    return (
        <Menubar model={menuItems} start={start} end={end} />
    );
}
