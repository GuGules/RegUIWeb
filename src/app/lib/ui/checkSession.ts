"use client";

import { useRouter } from "next/navigation";

export function checkSession(){
  const router = useRouter();
  // Vérification de la session
  fetch("/api/checkSession").then(async (res) => {
    var userData = await res.json()
    if (!userData.isConnected) {
      // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
      router.replace("/");
    } 
  });
}

export function checkSessionForLoginPage(){
  const router = useRouter();
  // Vérification de la session
  fetch("/api/checkSession").then(async (res) => {
    var userData = await res.json()
    if (userData.isConnected) {
      // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
      router.replace("/home");
    } 
  });
}

export function checkSessionForAdmin(){
  const router = useRouter();
  // Vérification de la session
  fetch("/api/checkSession").then(async (res) => {
    var userData = await res.json()
    if (!(userData.isConnected && userData.isAdmin)) {
      // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
      router.replace("/home");
    }  
  }); 
}