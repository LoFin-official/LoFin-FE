import { useRouter } from 'next/router';

export default function useBackNavigation(defaultPath: string) {
  const router = useRouter();

  return () => {
    const hasHistory = window.history.length > 1;

    if (hasHistory) {
      router.back();
    } else {
      router.push(defaultPath);
    }
  };
}
