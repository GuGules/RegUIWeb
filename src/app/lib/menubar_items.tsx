"use client";

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { useRef } from 'react';

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
        command: () => window.location.href = '/'
    },
    {
        label: 'Registre',
        icon:  "pi pi-box",
        items: [
            {
                label: 'Nouveautés',
                icon: 'pi pi-tags',
                command: () => console.log('Nouveautés')
            },
            {
                label: 'Promotions',
                icon: 'pi pi-percentage',
                command: () => console.log('Promotions')
            },
            {
                label: 'Catégories',
                icon: 'pi pi-list',
                items: [
                    {
                        label: 'Électronique',
                        icon: 'pi pi-mobile',
                        command: () => console.log('Électronique')
                    },
                    {
                        label: 'Maison',
                        icon: 'pi pi-home',
                        command: () => console.log('Maison')
                    }
                ]
            }
        ]
    },
        {
        label: 'Administration',
        icon: 'pi pi-cog',
        items: [
            {
                label: 'Paramètres',
                icon: 'pi pi-sliders-h',
                command: () => window.location.href = '/admin'
            },
            {
                label: 'Utilisateurs',
                icon: 'pi pi-users',
                command: () => window.location.href = '/admin/users'
            },
            {
                label: 'À propos',
                icon: 'pi pi-info-circle',
                command: () => window.location.href = '/admin/info'
            }
        ]
    }
];
export function EndMenu() {
    const menuRight = useRef(null);

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