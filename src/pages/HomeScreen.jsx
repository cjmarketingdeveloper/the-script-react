import HeroCarousel from '../components/HeroCarousel'
import MagazineSection from '../components/MagazineSection'
import PodcastSection from '../components/PodcastSection'
import AboutSection from '../components/AboutSection'
import AnimatedMediaSection from '../components/AnimatedMediaSection'
import SubscribeSection from '../components/SubscribeSection'


export default function HomeScreen() {
return (
    <>
        <HeroCarousel />

        <AboutSection />
        {
            /*
            <HeroCarousel />
            <MagazineSection />
            {/* <PodcastSection /> * /}
            <AboutSection />
            {/*<AnimatedMediaSection />* /}
            <SubscribeSection />
            */
        }
    </>
    )
}