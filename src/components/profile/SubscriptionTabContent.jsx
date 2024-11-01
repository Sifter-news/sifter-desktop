import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

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

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading subscription details...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your subscription plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {plans?.map((plan) => (
            <Card key={plan.id} className={`relative ${subscription?.subscription_plan_id === plan.id ? 'border-2 border-primary' : ''}`}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>${plan.price}/month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </CardContent>
              {subscription?.subscription_plan_id === plan.id ? (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Current Plan
                </div>
              ) : (
                <Button className="mt-4" variant="outline">
                  Upgrade to {plan.name}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {subscription?.subscription_end_date && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Your subscription {subscription.subscription_end_date ? `expires on ${new Date(subscription.subscription_end_date).toLocaleDateString()}` : 'is active'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionTabContent;