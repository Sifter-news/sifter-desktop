import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import InvestigationCard from '../components/InvestigationCard';
import ReportCard from '../components/ReportCard';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MindMapView from '../components/MindMapView';
import TextView from '../components/TextView';
import TimeView from '../components/TimeView';
import MapView from '../components/MapView';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("mind");
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
  };

  const investigations = [
    { 
      id: 1, 
      title: 'Human Survival Needs', 
      description: 'An investigation into the essential elements required for human survival, including physiological needs, safety, and psychological well-being.',
      reports: [
        { id: 1, title: 'Basic Physiological Needs', content: 'Humans require air, water, food, shelter, and sleep to survive. This article explores the minimum requirements for each of these essential needs...', image: '/placeholder.svg' },
        { id: 2, title: 'Safety and Security', content: 'Beyond basic physiological needs, humans require safety and security for long-term survival. This includes physical safety, financial security, and health...', image: '/placeholder.svg' },
        { id: 3, title: 'Psychological Well-being', content: 'Mental health is crucial for human survival. This report examines the importance of social connections, purpose, and self-actualization in maintaining psychological well-being...', image: '/placeholder.svg' },
      ]
    },
    { 
      id: 2, 
      title: 'Startup Investment Due Diligence', 
      description: 'A comprehensive investigation into the key aspects of evaluating a potential startup investment, covering financial, legal, and market analysis.',
      reports: [
        { id: 4, title: 'Financial Analysis', content: 'This report delves into the startup\'s financial health, including revenue models, burn rate, and projections. It also examines the company\'s funding history and capitalization table...', image: '/placeholder.svg' },
        { id: 5, title: 'Market Opportunity', content: 'An in-depth look at the target market size, growth potential, and competitive landscape. This analysis also covers the startup\'s unique value proposition and go-to-market strategy...', image: '/placeholder.svg' },
        { id: 6, title: 'Team Assessment', content: 'Evaluating the founding team\'s experience, skills, and track record. This report also examines the company culture and ability to attract and retain top talent...', image: '/placeholder.svg' },
        { id: 7, title: 'Legal and Regulatory Review', content: 'A comprehensive review of the startup\'s legal structure, intellectual property rights, and any potential regulatory challenges or compliance issues...', image: '/placeholder.svg' },
      ]
    },
    { 
      id: 3, 
      title: 'Climate Change', 
      description: 'Climate change is a long-term shift in global or regional climate patterns. Often climate change refers specifically to the rise in global temperatures from the mid-20th century to present.',
      reports: [
        { id: 8, title: 'Global Warming Trends', content: 'Recent studies show an alarming increase in global temperatures over the past century, with significant acceleration in the last few decades...' },
        { id: 9, title: 'Impact on Ecosystems', content: 'Climate change is having far-reaching effects on plant and animal species worldwide, disrupting delicate ecological balances...' },
      ]
    },
    { 
      id: 4, 
      title: 'Artificial Intelligence', 
      description: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.',
      reports: [
        { id: 10, title: 'Machine Learning Breakthroughs', content: 'Recent advancements in machine learning algorithms have led to significant improvements in natural language processing and computer vision...' },
        { id: 11, title: 'AI Ethics and Governance', content: 'As AI systems become more prevalent in society, questions of ethics, privacy, and governance are becoming increasingly important...' },
        { id: 12, title: 'AI in Healthcare', content: 'AI is revolutionizing healthcare through improved diagnostic tools, personalized treatment plans, and drug discovery processes...' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Sifter Logo" />
                <AvatarFallback>SL</AvatarFallback>
              </Avatar>
              <span className="text-xl font-bold">Sifter</span>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="relative -mb-px">
            <TabsList>
              <TabsTrigger value="mind">Mind</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="time">Time</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>
          </Tabs>
          <UserProfile user={user} />
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="mind">
            <MindMapView investigations={investigations} />
          </TabsContent>
          <TabsContent value="text">
            <TextView investigations={investigations} />
          </TabsContent>
          <TabsContent value="time">
            <TimeView investigations={investigations} />
          </TabsContent>
          <TabsContent value="map">
            <MapView investigations={investigations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HomePage;