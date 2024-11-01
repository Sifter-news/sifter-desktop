import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { Check, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getStripe } from '@/config/stripe';

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
      stripe_price_id: null,
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
      stripe_price_id: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
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
      stripe_price_id: null,
      features: [
        'Collaborate on projects',
        'Connect existing codebases',
        'Custom rate limits',
        'Dedicated support'
      ]
    }
  ];

  const handleSubscription = async (plan) => {
    try {
      if (plan.id === 'teams') {
        // Handle teams plan differently (e.g., contact sales)
        toast.info('Please contact our sales team for Teams plan');
        return;
      }

      if (plan.id === 'free') {
        // Handle downgrade to free plan
        const { error } = await supabase.functions.invoke('handle-subscription-change', {
          body: { action: 'downgrade', userId }
        });
        
        if (error) throw error;
        toast.success('Successfully downgraded to Free plan');
        return;
      }

      // Create Stripe checkout session
      const { data: { sessionId }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId: plan.stripe_price_id, userId }
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      const stripe = await getStripe();
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) throw stripeError;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process subscription: ' + error.message);
    }
  };

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
              onClick={() => handleSubscription(plan)}
              disabled={subscription?.subscription_plan_id === plan.id}
            >
              {subscription?.subscription_plan_id === plan.id 
                ? 'Current Plan'
                : plan.id === 'teams' 
                  ? 'Get in touch' 
                  : plan.id === 'free' 
                    ? 'Downgrade to Free'
                    : 'Upgrade to ' + plan.name}
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