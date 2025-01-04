import { createContext, useContext, useState, useEffect } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";
import { AppThemes, type AppTheme } from "@/utils/constants";
import { isAppTheme } from "@/utils/helpers/isAppTheme";

const store = new LazyStore("settings.json");

type AppSettingContextType = {
  isCompleteInit: boolean;
  store: LazyStore;
  theme: AppTheme;
  setTheme: (theme: string) => void;
};

const AppSettingContext = createContext<AppSettingContextType>({
  isCompleteInit: false,
  store,
  theme: AppThemes.SYSTEM,
  setTheme: () => {},
});

export const AppSettingStoreKeys = {
  THEME: "theme",
  FONT_SIZE: "fontSize",
  AUTO_SAVE: "autoSave",
};

export const AppSettingProvider = ({
  children,
}: {
  children: (isCompleteInit: boolean) => React.ReactNode;
}) => {
  const [isStoreInit, setIsStoreInit] = useState(false);
  const [isCompleteInit, setIsCompleteInit] = useState(false);

  const [theme, setTheme] = useState<AppSettingContextType["theme"]>(
    AppThemes.SYSTEM
  );

  const provideSetTheme = (theme: string) => {
    if (isAppTheme(theme)) {
      store.set(AppSettingStoreKeys.THEME, theme).then(() => {
        setTheme(theme);
      });
    }
  };

  useEffect(() => {
    const initTheme = store.get(AppSettingStoreKeys.THEME).then((value) => {
      if (isAppTheme(value)) {
        setTheme(value);
      } else {
        setTheme(AppThemes.SYSTEM);
      }
    });
    Promise.all([initTheme]).then(() => {
      setIsCompleteInit(true);
    });
  }, [isStoreInit]);

  useEffect(() => {
    store.init().then(() => {
      setIsStoreInit(true);
    });
  }, []);

  return (
    <AppSettingContext.Provider
      value={{ isCompleteInit, store, theme, setTheme: provideSetTheme }}
    >
      {children(isCompleteInit)}
    </AppSettingContext.Provider>
  );
};

export const useAppSettingContext = () => {
  return useContext(AppSettingContext);
};
