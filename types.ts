import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  details: {
    type: string;
    period: string;
    cost: string;
  };
}

export interface PlanItem {
  id: string;
  title: string;
  price: string;
  subTitle: string;
  features: string[];
  icon: React.ReactNode;
  isPopular?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  author?: {
    name: string;
    avatar: string;
  };
  summary?: string;
  content?: string; // Changed from React.ReactNode to string for storage
  checkpoints?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  budget: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}