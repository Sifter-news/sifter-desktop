import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const SubscriptionPlans = () => {
  const plans = [
    { name: 'Free', price: '$0', features: ['Basic features', 'Limited storage', 'Email support'] },
    { name: 'Premium', price: '$19/month', features: ['All Free features', 'Unlimited storage', 'Priority support', 'Advanced analytics'] },
    { name: 'Teams', price: 'Contact us', features: ['All Premium features', 'Team collaboration', 'Custom integrations', 'Dedicated account manager'] },
  ];

  const handleSubscribe = (plan) => {
    // Here you would integrate with Stripe to handle the subscription
    console.log(`Subscribing to ${plan} plan`);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.price}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc list-inside">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSubscribe(plan.name)}>Subscribe</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;