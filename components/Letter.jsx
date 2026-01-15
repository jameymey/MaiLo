import { Cormorant_Garamond } from 'next/font/google';
import Header from './header';
import Footer from './footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function Letter() {
  return (
    <>
      <Header />
      <div className={`min-h-screen bg-gray-100 py-12 px-4 ${cormorant.className}`}>
        <div className="max-w-2xl mx-auto">
          {/* Letter Container */}
          <div className="bg-white p-12 shadow-lg" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            {/* Paper texture effect */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' seed=\'2\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' fill=\'%23f3f1e8\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}></div>
            {/* Letter Header */}
            <div className="mb-20 pb-0">
              <p className="text-right mb-8 text-[#1f324f]" style={{ fontFamily: "'Myfont'" }}>{new Date().toLocaleDateString()}</p>
            </div>

            {/* Letter Content */}
            <div className="space-y-6 text-[#1f324f] leading-relaxed text-xl" style={{ fontFamily: "'Myfont'" }}>
              <p>Happy 3rd anniversary, my waki.</p>

              <p>Three years together, and I am forever grateful that I get to live this life with you. It still amazes me how far we've come. Sometimes I can't believe we made it here, yet deep down, I always knew we would. We wouldn't be this strong, or this lasting, if you didn't choose me every single day. Thank you for choosing me especially on the days when things were hard, when everything felt heavy, and when walking away might have been easier.</p>

              <p>We've faced so many challenges together. We stumbled, we learned, and we grew but we never stopped choosing each other. That's the strength of our bond. It doesn't break under pressure; it only grows stronger with time. Every trial shaped us, every struggle brought us closer, and every victory reminded me why you are my person.</p>

              <p>Thank you for being my partner in everything—my other half, my lover, my safe place, and my source of strength. I wouldn't have come this far, baby, if it weren't for you. You believed in me even when I doubted myself. You reminded me that I am capable, that I can do things, that I can keep going as long as I have you by my side.</p>

              <p>Thank you for standing with me, for staying when things weren't perfect, and for loving me in ways that healed parts of me I didn't know were broken. Thank you for being patient with me, for understanding me, and for growing with me.</p>

              <p>I see you, my waki.</p>

              <p>I'm sorry for the moments when I caused you pain. I never meant to hurt you, and I'm still learning how to love you better every day. Thank you for your forgiveness, your grace, and your unwavering love.</p>

              <p>I love you always, in all ways<br/>Happy anniversary, my waki.</p>

              {/* Closing */}
              <div className="mt-12 pt-8">
                <p className="text-[#1f324f]">Always and Forever,</p>
                <p className="text-[#1f324f]">Jamaica</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
