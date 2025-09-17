import { BambooStalk } from './TikiDecorations';

export function MenuHeader() {
  return (
    <header className="text-center mb-12 relative">
      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: '20px', left: '5%', opacity: '0.6' }}>
        <BambooStalk size={20} height={80} />
      </div>
      <div style={{ position: 'absolute', top: '25px', right: '8%', opacity: '0.6' }}>
        <BambooStalk size={18} height={70} />
      </div>
      <div style={{ position: 'absolute', top: '30px', left: '15%', opacity: '0.5', transform: 'rotate(5deg)' }}>
        <BambooStalk size={16} height={60} />
      </div>
      <div style={{ position: 'absolute', top: '35px', right: '18%', opacity: '0.5', transform: 'rotate(-3deg)' }}>
        <BambooStalk size={15} height={55} />
      </div>
      
      <div className="bamboo-divider mb-6"></div>
      <h1 className="tiki-header text-5xl md:text-7xl mb-6 relative z-10">
        The Tiki Lounge
      </h1>
      <p className="text-readable text-lg md:text-xl font-light mb-4 relative z-10">
        Polynesian-Inspired Cocktails & Island Fare
      </p>
      <div className="bamboo-divider"></div>
    </header>
  );
}