import Image, { StaticImageData } from "next/image"
// import globe from "../public/images/couples.jpg"
import image1 from "../public/images/Image1.png"
import image2 from "../public/images/Image2.png"
import image3 from "../public/images/Image3.png"


const HowItWorksSection: React.FC = () => {
    interface SectionImages  {
      image: StaticImageData,
      alt: string,
      heading: string,
      paragraph: string,
    }

     const sectionImages: SectionImages[] = [
    {
      image: image1,
      alt: "Globe",
      heading: "Select A Project",
      paragraph: "Choose from verified carbon credit programs or tree planting initiatives around the world"
     },
    {
      image: image2,
      alt: "Globe",
      heading: "Pay With Crypto",
      paragraph: "Complete your purchase instantly using stablecoins or other crytocurrencies"
     },
     {
      image: image3,
      alt: "Globe",
      heading: "Get Blockchain Proof",
      paragraph: "Receive an NFT certificate with permanent, verifiable proof of your contribution"
     }]

    return (
        <>
        <section className="py-12 md:py-16 lg:py-20 p-12 bg-white">
            <div className="md:flex md:justify-between items-center text-black mb-2 md:mb-18">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-0">How it Works</h1>
                <p className="max-w-md text-sm md:text-lg text-gray-600">Farm Credit makes climate action seamless: choose a project, pay with crypto, and receive verifiable proof of your offset-all secured and tracked on the blockchain</p>
            </div>
            <div className="text-black">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-2 md:gap-4">
                    {sectionImages.map((item: SectionImages, idx: number) => (
                        <div key={idx}>
                          <div className="text-left">
                           <Image 
                           src={item.image} 
                           alt={item.alt} 
                           loading= "lazy"
                          className={`rounded-4xl w-screen md:w-[500px] object-cover ${idx === 1 ? " md:h-[350px]" : "md:h-[500px]"}`} 
                          />
                            <h2 className="text-2xl md:text-3xl mb-2 md:mb-4 mt-3 md:mt-6">{item.heading}</h2>
                            <p className={`text-sm md:text-lg text-gray-600 ${idx === 1 ? "max-w-md" : "max-w-sm"}`}>{item.paragraph}</p>
                          </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </section>
        </>
    )
}
export default HowItWorksSection