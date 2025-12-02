import React from 'react';

interface SectionTitleProps {
  title: string;
  subTitle: string;
  centered?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subTitle, centered = true }) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4 inline-block relative">
        {title}
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-brand-orange opacity-30 rounded-full"></span>
      </h2>
      <p className="text-gray-600 mt-4 text-sm tracking-wider">{subTitle}</p>
    </div>
  );
};

export default SectionTitle;
