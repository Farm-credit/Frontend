import Header from '../molecules/header';
import Footer from '../molecules/footer';
import { HandHelping, Accessibility, Plus } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-gray-100 overflow-hidden m-0 p-0 pt-6">
      <Header />
      
      <section
  className="relative rounded-[30px] overflow-hidden max-w-11/12 mx-auto bg-cover bg-center mt-8"
  style={{ backgroundImage: "url('/Vector.png')", minHeight: '800px' }}
>
  <img
    src="/danmeyersfarm.png"
    alt="Background farm landscape"
    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    aria-hidden="true"
  />
  <div
    className="absolute inset-0"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
    aria-hidden="true"
  ></div>
<div
  className="absolute inset-0 px-4 sm:px-6 md:px-10 lg:px-10 xl:px-2 flex flex-col justify-center mx-auto"
  style={{ maxWidth: '1200px' }}
>
<div className="max-w-5xl relative z-10 text-left">
  <span className="inline-block text-white text-[10px] sm:text-[16px] font-semibold rounded-full border border-white px-3 py-[3px] mb-3 uppercase tracking-widest">
    EMPOWERING MODERN AGRICULTURE
  </span>
  <h1 className="text-white font-extrabold text-5xl sm:text-6xl md:text-7xl leading-tight mb-4">
    Empowering Farmers with Blockchain &amp; AI
  </h1>
  <p className="text-yellow-400 text-lg sm:text-xl mb-6 leading-relaxed font-medium max-w-md"> {/* Added max-w-md */}
    FarmCredit revolutionizes agriculture by leveraging blockchain and AI
    to provide farmers with transparent, secure, and efficient access to
    carbon credit markets.
  </p>
  <div className="flex space-x-4">
    <button className="bg-green-400 hover:bg-green-500 text-black font-semibold text-base sm:text-lg rounded-full px-5 py-2">
      Get Started
    </button>
    <button className="border border-white text-white text-base sm:text-lg rounded-full px-5 py-2 hover:bg-white hover:text-black transition">
      Learn More
    </button>
  </div>
</div>
</div>
  <div
    className="absolute bottom-0 left-0 w-[280px] h-[280px] rounded-tl-[30px] rounded-bl-[30px] pointer-events-none"
    style={{ mixBlendMode: 'multiply', opacity: 0.15 }}
    aria-hidden="true"
  ></div>
</section>
<section
  className="relative min-h-1/3 bg-cover bg-center grid place-items-center p-20"
  style={{ backgroundImage: "url('/Vector.png')" }}
>
  <img
    src="/boxlines.jpg"
    alt="Boxlines overlay"
    className="absolute w-full h-full object-cover pointer-events-none"
    style={{ top: '25%', position: 'absolute' }}
    aria-hidden="true"
  />
  <div className="relative z-10 text-center max-w-xl mx-auto py-8 min-h-[300px]"> {/* Added min-height and padding */}
    <h1 className="text-[#6B8E23] text-4xl sm:text-5xl font-semibold mb-2"> {/* Increased heading size */}
      Why Carbon Farming?
    </h1>
    <p className="text-gray-600 text-base sm:text-lg leading-tight"> {/* Increased paragraph size */}
      Carbon farming is a transformative approach that enhances soil health, boosts crop yields, and combats climate change by sequestering carbon dioxide in the soil. By integrating blockchain and AI technologies, FarmCredit amplifies these benefits, offering a transparent, efficient, and data-driven solution for modern agriculture.
    </p>
  </div>
</section>
<section
  className="bg-[#5a7a22] text-white px-6 py-10 md:py-16 md:px-20 relative overflow-visible"
>
  <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-8 md:gap-12">
    {/* Left Column */}
    <div className="flex flex-col md:w-1/2 lg:w-2/5 space-y-6">
      <h2 className="text-lg md:text-xl font-semibold tracking-wider text-gray-100 uppercase"> {/* Increased heading size */}
        WHAT IS FARMCREDIT?
      </h2>
      
      <div className="space-y-3">
        <h3 className="text-sm md:text-base font-semibold text-gray-100"> {/* Increased subheading size */}
          Blockchain & AI
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-gray-300 max-w-[280px]"> {/* Increased paragraph size */}
          Backed by leading innovation partners and powered by blockchain and AI, 
          FarmCredit is redefining the future of agricultural finance and 
          sustainability in Africa.
        </p>
      </div>
      
      <div className="relative pl-10 pt-6 border-l-2 border-gray-400/30 space-y-3">
        <p className="text-sm md:text-base font-semibold text-gray-100">Our Mission</p> {/* Increased subheading size */}
        <p className="text-sm md:text-base leading-relaxed text-gray-300"> {/* Increased paragraph size */}
          To democratize access to agricultural financing through cutting-edge 
          technology, fostering a resilient and prosperous farming community.
        </p>
        <button className="text-sm md:text-base font-semibold text-[#f1e2e0] hover:underline flex items-center gap-2 transition-all"> {/* Increased button text size */}
          Know more
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Right Column */}
    <div className="flex flex-col md:w-1/2 lg:w-2/5 space-y-6 md:mt-12">
      <div className="space-y-3">
        <h3 className="text-sm md:text-base font-semibold text-gray-100"> {/* Increased subheading size */}
          Farmers and Sustainability First
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-gray-300 max-w-[280px]"> {/* Increased paragraph size */}
          In collaboration with farmers, cooperatives, and local institutions, 
          we're enabling a shift toward regenerative agriculture—boosting soil 
          health, increasing yields, and unlocking verified carbon credits that 
          reward sustainable practices.
        </p>
      </div>
      
      <div className="relative pl-10 pt-6 border-l-2 border-gray-400/30 space-y-3">
        <p className="text-sm md:text-base font-semibold text-gray-100">Our Vision</p> {/* Increased subheading size */}
        <p className="text-sm md:text-base leading-relaxed text-gray-300"> {/* Increased paragraph size */}
          Our ambition is to transform a million hectares of both farmland and 
          degraded grassland across Africa into thriving ecosystems of 
          sustainability and productivity by 2030.
          <br /><br />
          This is our pledge to the Earth and its stewards.
        </p>
        <button className="text-sm md:text-base font-semibold text-[#f3e4e1] hover:underline flex items-center gap-2 transition-all"> {/* Increased button text size */}
          Know more
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
  <div
    className="absolute left-0 right-0 bottom-16 pointer-events-none select-none"
  >
    <h1
      className="text-[125px] font-extrabold text-[#77973f] leading-none tracking-[0.1em] uppercase opacity-8 select-none pointer-events-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      REDD CARBON SUSTAINABILITY
    </h1>
  </div>
  <div
    className="absolute top-[50%] left-[13%] w-[178px] h-[269px] flex items-center justify-center"
    style={{
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
      fontSize: '340.5px',
      lineHeight: '50%',
      letterSpacing: 0,
      textTransform: 'lowercase',
      color: '#77973f',
      opacity: 0.2,
    }}
  >
    fc
  </div>
</section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div className="md:w-1/2">
            <h1 className="text-[#0a1a38] text-3xl md:text-4xl font-semibold leading-tight">
              Shared Success
            </h1>
          </div>
          <div className="md:w-1/2 md:pt-2">
            <p className="text-sm md:text-base text-[#0a1a38]/90 leading-relaxed max-w-md">
              Dive into our pioneering work in carbon credit tokenization, empowering farmers while ensuring sustainability for a green earth.
            </p>
          </div>
        </div>

        {/* Cards section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer card */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[500px]">
            <img 
              alt="Farmer's hands holding grains" 
              className="w-full h-2/3 object-cover"
              src="/grain.png"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#4f8a1e] p-4 md:p-6 rounded-b-3xl rounded-t-none md:rounded-t-3xl"> {/* Adjusted rounded corners */}
              <h2 className="text-white font-serif font-semibold text-lg md:text-2xl mb-2">
                Empowering Farmers
              </h2>
              <p className="text-white text-sm md:text-base leading-tight md:leading-relaxed">
                If you grow cereals or legumes, FarmCredit is your trusted partner in carbon farming. From tillage to cover crops, we guide you in adopting sustainable practices that boost yields and earn carbon credits. With FarmCredit, growing your farm and helping the planet go hand in hand.
              </p>
            </div>
          </div>

          {/* Rancher card */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[500px]">
            <img 
              alt="Aerial view of field" 
              className="w-full h-2/3 object-cover"
              src="/field.png"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#c07a0a] p-4 md:p-6 rounded-b-3xl rounded-t-none md:rounded-t-3xl"> {/* Adjusted rounded corners */}
              <h2 className="text-white font-serif font-semibold text-lg md:text-2xl mb-2">
                Empowering Ranchers
              </h2>
              <p className="text-white text-sm md:text-base leading-tight md:leading-relaxed">
                Ready to transform your ranch? FarmCredit is your guide to regenerative ranching. Whether it's rotational grazing or pasture recovery, we're here to support your shift to sustainable practices. Our carbon farming tools help you boost environmental impact while unlocking new income from your land.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#0a1a0a]">
  <div className="w-full mx-auto py-28 px-4 md:px-12"> {/* Added horizontal padding */}
    <div
      className="flex flex-col md:flex-row items-center bg-[#3a5200] w-full mx-auto rounded-none md:rounded-none overflow-hidden" 
    >
      <div className="md:flex-1 px-10 py-8 md:py-12 text-white">
        <h2 className="font-semibold text-3xl md:text-4xl leading-snug max-w-md"> {/* Increased text size */}
          Are you ready to elevate your practices and grow your income?
        </h2>
        <p className="text-lg md:text-xl mt-2 text-[#b7b7b7] max-w-xs"> {/* Increased text size */}
          FarmCredit is your gateway to the future of agriculture.
        </p>
        <button
          className="mt-4 bg-[#a3d55d] text-[#1a3a00] text-base font-semibold rounded-full px-4 py-2 hover:bg-[#8cc43a] transition-colors" 
          type="button"
        >
          Join Waitlist
        </button>
      </div>
      <div className="md:flex-1 slant-left overflow-hidden">
        <img
          alt="Man wearing orange cap and green apron watering plants in a garden with green and yellow bushes and blue sky with clouds"
          className="w-full h-full object-cover"
          height="180"
          src="/garden.jpg"
          width="400"
        />
      </div>
    </div>
  </div>
</section>
      <section className="bg-[#dfe0db] text-[#0f1f35] min-h-[50vh] flex items-center justify-center py-28 p-6">
  <div className="max-w-7xl w-full">
    <div className="max-w-xl mb-10">
      <h2 className="text-5xl font-medium leading-tight mb-4"> {/* Increased heading size */}
        Why adopt our<br />technology?
      </h2>
      <p className="text-base leading-6 text-[#0f1f35] max-w-xs"> {/* Increased paragraph size */}
        We combine proprietary blockchain infrastructure, industry-specific expertise, and a tailored approach to deliver real value in a rapidly evolving digital world.
      </p>
    </div>
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="bg-[#004a5a] rounded-xl p-6 flex-1 min-w-[250px] shadow-lg"> {/* Added shadow for depth */}
        <div className="text-sm mb-3 text-[#a9c6cc] flex items-center gap-2">
          <HandHelping className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white"> {/* Increased heading size */}
          Hands-on support & guidance
        </h3>
        <p className="text-base leading-6 text-[#a9c6cc]"> {/* Increased paragraph size */}
          Expert agronomy guidance and ongoing assistance to help you succeed in your carbon farming journey.
        </p>
      </div>
      <div className="bg-[#e1e2e1] rounded-xl p-6 flex-1 min-w-[250px] shadow-lg"> {/* Added shadow for depth */}
        <div className="text-sm mb-3 text-[#0f1f35] flex items-center gap-2">
          <Accessibility className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#0f1f35]"> {/* Increased heading size */}
          Access to required resources & inputs
        </h3>
        <p className="text-base leading-6 text-[#0f1f35]"> {/* Increased paragraph size */}
          Gain the tools you need and unlock new income through fully transparent, high-integrity certified carbon credits – ensuring trust, accountability, and real impact every step of the way.
        </p>
      </div>
      <div className="bg-[#e3d6aa] rounded-xl p-6 flex-1 min-w-[250px] shadow-lg"> {/* Added shadow for depth */}
        <div className="text-sm mb-3 text-[#0f1f35] flex items-center gap-2">
          <Plus className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#0f1f35]"> {/* Increased heading size */}
          Additional carbon revenue stream
        </h3>
        <p className="text-base leading-6 text-[#0f1f35]"> {/* Increased paragraph size */}
          Unlock an additional revenue stream through certified, transparent, and farmer-first carbon credits designed to reward your sustainable practices.
        </p>
      </div>
    </div>
  </div>
</section>
<section className="bg-[#07303a] min-h-[50vh] flex items-center justify-center py-28 p-6">
  <div className="max-w-7xl w-full">
    <h2 className="text-center text-white text-5xl font-medium mb-10"> {/* Increased heading size */}
      How it Works
    </h2>
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center">
      <div className="bg-[#dccda7] rounded-lg p-6 mx-auto sm:mx-0 max-w-xs sm:max-w-[320px] flex flex-col justify-start shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-1.5 bg-[#d9a12f] rounded-sm h-full"></div> {/* Set height to full */}
          <div>
            <p className="font-extrabold text-xl leading-7 text-black mb-1"> {/* Increased text size */}
              Plan & Adopt
            </p>
            <p className="text-base leading-6 text-black max-w-[270px]"> {/* Increased text size */}
              Your journey starts with a personalized conversation. Work with
              FarmCredit experts to build a carbon farming plan tailored to your
              land. We support you with the inputs, knowledge, and tools needed
              to adopt sustainable practices.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#064a5e] rounded-lg p-6 mx-auto sm:mx-0 max-w-xs sm:max-w-[320px] flex flex-col justify-start shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-1.5 bg-[#d9a12f] rounded-sm h-full"></div> {/* Set height to full */}
          <div>
            <p className="font-extrabold text-xl leading-7 text-white mb-1"> {/* Increased text size */}
              Certify
            </p>
            <p className="text-base leading-6 text-white max-w-[270px]"> {/* Increased text size */}
              As you implement regenerative methods, FarmCredit helps track and
              verify your progress—ensuring your efforts meet the standards for
              certified carbon credits.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#d9d9d9] rounded-lg p-6 mx-auto sm:mx-0 max-w-xs sm:max-w-[320px] flex flex-col justify-start shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-1.5 bg-[#d9a12f] rounded-sm h-full"></div> {/* Set height to full */}
          <div>
            <p className="font-extrabold text-xl leading-7 text-black mb-1"> {/* Increased text size */}
              Get Paid
            </p>
            <p className="text-base leading-6 text-black max-w-[270px]"> {/* Increased text size */}
              Once your credits are certified, companies purchase them—and you
              get paid. With FarmCredit, your commitment to sustainability
              directly rewards you.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="bg-[#E3E4E3] min-h-[50vh] flex items-center justify-center py-28 px-28">
<div className="w-full mx-auto"> {/* Changed max-w-3xl to w-full */}
  <h2 className="font-extrabold text-3xl leading-9 text-[#2B2B2B] mb-4"> {/* Increased heading size */}
    FAQs
  </h2>
  <hr className="border-t border-[#8B8B8B] mb-4 w-full" /> {/* Added w-full to the border */}
  <div className="divide-y divide-[#8B8B8B] w-full"> {/* Added w-full to the container */}
    <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full"> {/* Added w-full */}
      <span className="w-full"> {/* Changed max-w-[70%] to w-full */}
        What models does Coda AI leverage?
      </span>
      <Plus className="w-7 h-7 text-[#2B2B2B]" />
    </div>
    <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full"> {/* Added w-full */}
      <span className="w-full"> {/* Changed max-w-[70%] to w-full */}
        How does Coda AI use my data?
      </span>
      <Plus className="w-7 h-7 text-[#2B2B2B]" />
    </div>
    <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full"> {/* Added w-full */}
      <span className="w-full"> {/* Changed max-w-[70%] to w-full */}
        How can I learn more about using Coda AI for work?
      </span>
      <Plus className="w-7 h-7 text-[#2B2B2B]" />
    </div>
    <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full"> {/* Added w-full */}
      <span className="w-full"> {/* Changed max-w-[70%] to w-full */}
        Was there a Coda AI Beta?
      </span>
      <Plus className="w-7 h-7 text-[#2B2B2B]" />
    </div>
  </div>
</div>
</section>
      
      <Footer />
    </div>
  );
}