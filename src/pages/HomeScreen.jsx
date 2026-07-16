import { useSelector } from 'react-redux';
import HeroCarousel from '../components/HeroCarousel'
import MagazineSection from '../components/MagazineSection'
import PodcastSection from '../components/PodcastSection'
import AboutSection from '../components/AboutSection'
import AnimatedMediaSection from '../components/AnimatedMediaSection'
import SubscribeSection from '../components/SubscribeSection'


export default function HomeScreen() {
    const {user}                                    = useSelector((state) => state.auth);
return (
    <>
        <HeroCarousel user={user}/>
        <MagazineSection user={user}/>

        <AboutSection />
        
        <SubscribeSection />
        {
            /*
            <HeroCarousel />
            {/* <PodcastSection /> * /}
            <AboutSection />
            {/*<AnimatedMediaSection />* /}
            
            */
        }
    </>
    )
}