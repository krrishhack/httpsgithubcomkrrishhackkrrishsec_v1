import useLocalStorage from './useLocalStorage';

export const usePremium = () => {
  const [isPremium, setIsPremium] = useLocalStorage('krrishsec-premium-unlocked', false);

  const unlockPremium = () => {
    setIsPremium(true);
  };

  return { isPremium, unlockPremium };
};
