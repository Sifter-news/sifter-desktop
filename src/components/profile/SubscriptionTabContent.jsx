import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { Check, Zap } from 'lucide-react';

const SubscriptionTabContent = ({ userId }) => {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan_id, subscription_start_date, subscription_end_date')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      price: '$0',
      period: '(Free)',
      description: "What's included:",
      features: [
        'Unlimited public projects',
        'Basic features',
        'Email support',
        'One click deploy'
      ]
    },
    {
      id: 'pro',
      name: 'PRO',
      price: '$19',
      period: '/ month',
      description: 'Everything in Free, plus:',
      features: [
        'Private projects',
        '> 10x higher rate limits',
        'Pay as you go, if daily AI credits run out',
        'Early access to AI-powered features',
        'Priority support'
      ]
    },
    {
      id: 'teams',
      name: 'TEAMS',
      price: null,
      description: 'Early access for partners',
      features: [
        'Collaborate on projects',
        'Connect existing codebases',
        'Custom rate limits',
        'Dedicated support'
      ]
    }
  ];

  if (isLoading) {
    return <div>Loading subscription details...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className="relative">
          <CardHeader>
            <div className="flex items-center space-x-2">
              {plan.id === 'pro' && <Zap className="h-5 w-5 text-primary" />}
              <CardTitle>{plan.name}</CardTitle>
            </div>
            {plan.price && (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
              </div>
            )}
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full mt-6" 
              variant={plan.id === 'teams' ? 'outline' : 'default'}
            >
              {plan.id === 'teams' ? 'Get in touch' : 'Manage subscription'}
            </Button>
          </CardContent>
          {subscription?.subscription_plan_id === plan.id && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
              Active
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionTabContent;