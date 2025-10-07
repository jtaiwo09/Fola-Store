"use client";

import { ISettings, useSettings } from "@/lib/hooks/useSettings";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

interface StoreSettingsContextValue {
  settings: ISettings | null;
  loading: boolean;
  error: Error | null;
}

const StoreSettingsContext = createContext<
  StoreSettingsContextValue | undefined
>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [_, setSocket] = useState<Socket | null>(null);

  const { data, isPending, error } = useSettings();

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);

  // Setup socket connection
  useEffect(() => {
    const socketClient = io(SOCKET_URL);

    socketClient.on("connect", () => {
      console.log("⚡ Connected to Socket.IO");

      // Join store settings room
      socketClient.emit("join-store");
    });

    socketClient.on(
      "settings-updated",
      (payload: { type: string; data: any }) => {
        console.log("⚡ Settings update received:", payload);
        // Merge or replace updated settings depending on type
        setSettings((prev) => {
          if (!prev) return payload.data;

          switch (payload.type) {
            case "store":
              return { ...prev, store: payload.data };
            case "payment":
              return { ...prev, payment: payload.data };
            case "shipping":
              return { ...prev, shipping: payload.data };
            default:
              return prev;
          }
        });
      }
    );

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, []);

  return (
    <StoreSettingsContext.Provider
      value={{ settings, loading: isPending, error }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error(
      "useStoreSettings must be used within a StoreSettingsProvider"
    );
  }
  return context;
};
