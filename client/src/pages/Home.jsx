import usePageTitle from '../hooks/usePageTitle';
import Hero from '../components/home/Hero';
import SubjectGrid from '../components/home/SubjectGrid';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedServices from '../components/home/FeaturedServices';
import CallToAction from '../components/home/CallToAction';
import './Home.css';

export default function Home() {
  usePageTitle(null);

  return (
    <div className="home">
      <Hero />
      <SubjectGrid />
      <HowItWorks />
      <FeaturedServices />
      <CallToAction />
    </div>
  );
}
