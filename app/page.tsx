import Bio from '@/components/Bio';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import PersonalProjects from '@/components/PersonalProjects';
import RelatedWork from '@/components/RelatedWork';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Bio />
      <Experience />
      <PersonalProjects />
      <RelatedWork />
      <Contact />
    </main>
  );
}
