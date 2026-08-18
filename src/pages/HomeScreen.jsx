import { useSelector } from 'react-redux';
import HeroCarousel from '../components/HeroCarousel'
import MagazineSection from '../components/MagazineSection'
import PodcastSection from '../components/PodcastSection'
import AboutSection from '../components/AboutSection'
import SubscribeSection from '../components/SubscribeSection'
import AnimatedPodcastSection from '../components/AnimatedPodcastSection';


export default function HomeScreen() {
    const {user}                                    = useSelector((state) => state.auth);
    return (
        <>
            <HeroCarousel user={user}/>
            <MagazineSection user={user}/>
            <PodcastSection user={user}/>
            <AboutSection />
            <AnimatedPodcastSection />
            <SubscribeSection />
        {
            /*
            <HeroCarousel />
            {/* <PodcastSection /> * /}
            <AboutSection />
            {/** /}
            
            */
        }
    </>
    )
}