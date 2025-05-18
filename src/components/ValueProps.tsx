
import React from 'react';

interface ValuePropCardProps {
  icon: string;
  title: string;
  description: string;
}

const ValuePropCard: React.FC<ValuePropCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-voomics-indigo mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const ValueProps: React.FC = () => {
  const valueProps = [
    {
      icon: "📚",
      title: "100% Indian webcomics & toons",
      description: "Authentic stories that reflect our culture, humor, and experiences"
    },
    {
      icon: "🎨",
      title: "Regional stories & fresh formats",
      description: "Content in multiple languages with innovative storytelling approaches"
    },
    {
      icon: "🤳",
      title: "Swipe-to-read mobile UI",
      description: "Optimized for on-the-go reading with a smooth, intuitive interface"
    },
    {
      icon: "💰",
      title: "Fair rev-share for creators",
      description: "Supporting artists with transparent monetization opportunities"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-voomics-offwhite to-white">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => (
            <ValuePropCard
              key={index}
              icon={prop.icon}
              title={prop.title}
              description={prop.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
