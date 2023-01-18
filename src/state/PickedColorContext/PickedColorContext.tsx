import * as React from 'react'

export interface Color {
  base: string;
  hover: string;
  border: string;
}

type PickedColorContextType = ReturnType<typeof React.useState<Color>>

const PickedColorContext = React.createContext<PickedColorContextType>([
  undefined,
  () => undefined,
]);

export function PickedColorProvider({ children }: React.PropsWithChildren) {
  const colorState = React.useState<Color>();
  return (
    <PickedColorContext.Provider value={colorState}>
      {children}
    </PickedColorContext.Provider>
  );
}

export function usePickedColor() {
  const ctx = React.useContext(PickedColorContext);
  if (!ctx && ctx !== '') {
    throw new Error('No PickedColorContext available');
  }
  return ctx;
}
