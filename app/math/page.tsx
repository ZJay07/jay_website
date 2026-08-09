import MathGame from '@/components/MathGame';

export const metadata = {
  title: 'Math Sprint - Jay Choy',
  description: 'A quick arithmetic game: answer as many questions as you can before time runs out.',
};

export default function MathPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <MathGame />
    </main>
  );
}
