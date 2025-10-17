"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useCheckSession() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/checkSession").then(async (res) => {
      const userData = await res.json();
      if (!userData.isConnected) {
        router.replace("/");
      }
    });
  }, [router]);
}

export function useCheckSessionForLoginPage() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/checkSession").then(async (res) => {
      const userData = await res.json();
      if (userData.isConnected) {
        router.replace("/home");
      }
    });
  }, [router]);
}

export function useCheckSessionForRootPage() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/checkSession").then(async (res) => {
      const userData = await res.json();
      if (userData.isConnected) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    });
  }, [router]);
}

export function useCheckSessionForAdmin() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/checkSession").then(async (res) => {
      const userData = await res.json();
      if (!(userData.isConnected && userData.isAdmin)) {
        router.replace("/home");
      }
    });
  }, [router]);
}

export function isAdmin() {
  return fetch("/api/checkSession").then(async (res) => {
    const userData = await res.json();
    return userData.isConnected && userData.isAdmin
  });
}