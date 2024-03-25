import {
  Box,
  Card,
  Layout,
  Button,
  Page,
  Text,
  BlockStack,
  CalloutCard,
  Divider,
  Grid,
  ExceptionList,
} from "@shopify/polaris";
import { ANNUAL_PLAN, MONTHLY_PLAN, authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { MobileAcceptMajor } from '@shopify/polaris-icons'

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request)

  try {
    // check if the shop has an active plan
    const billingCheck = await billing.require({
      plans: [MONTHLY_PLAN],
      isTest: true,
      // instead of redirecting to failure, just catch the error
      onFailure: () => {
        throw new Error('No active plan')
      }
    })

    // if the shop has an active subscription, log and return the details
    const subscription = billingCheck.appSubscriptions[0]
    console.log(`Shop has ${subscription.name} (id ${subscription.id})`)
    return json({ billing, plan: subscription })

  } catch (error) {
    // if no active plan, return an empty plan object
    if (error.message === 'No active plan') {
      console.log(`Shop has no active plan.`)
      return json({ billing, plan: { name: 'Free' } })
    }

    // if another error, rethrow it
    throw error
  }
}

const planData = [
  {
    title: "Free",
    description: "Free plan with basic features",
    price: 0,
    action: "Upgrade to pro",
    name: "Free",
    url: "/app/upgrade",
    features: [
      "100 wishlist per day",
      "500 Products",
      "Basic customization",
      "Basic support",
    ],
  },
  {
    title: "Pro",
    description: "Pro plan with advanced features",
    price: "10",
    name: "Monthly subscription",
    action: "Upgrade to pro",
    url: "/app/upgrade",
    features: [
      "Unlimted wishlist per day",
      "10000 Products",
      "Advanced customization",
      "Priority support",
    ]
  },
]

export default function PricingPage() {
  const { plan } = useLoaderData()
  return (
    <Page>
      <ui-title-bar title="Pricing" />
      <Layout>
        <Layout.Section>
          <CalloutCard
            title="Your plan"
            illustration="https://cdn.shopify.com/s/files/1/0583/6465/7734/files/tag.png?v=1705280535"
            primaryAction={{
              content: 'Cancel Plan',
              url: '/app/cancel',
            }}
          >
            <p>
              You're currently on free plan. Upgrade to pro to unlock more features.
            </p>
          </CalloutCard>

          <div style={{ margin: "0.5rem 0" }}>
            <Divider />
          </div>

          <Grid>
            {planData.map((plan_item, index) => (
              <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card padding="400" background={plan_item.name == plan.name ? "bg-surface-success" : "bg-surface"} sectioned>
                  <Box>
                    <Text as="h3" variant="headingMd">
                      {plan_item.title}
                    </Text>
                    <Box as="p" variant="bodyMd">
                      {plan_item.description}
                      {/* If plan_item is 0, display nothing */}
                      <br />
                      <Text as="h4" variant="headingLg" fontWeight="bold">
                        {plan_item.price === "0" ? "" : "$" + plan_item.price}
                      </Text>
                    </Box>

                    <div style={{ margin: "0.5rem 0" }}>
                      <Divider />
                    </div>

                    <BlockStack gap={100}>
                      {plan_item.features.map((feature, index) => (
                        <ExceptionList
                          key={index}
                          items={[
                            {
                              icon: MobileAcceptMajor,
                              description: feature,
                            },
                          ]}
                        />
                      ))}
                    </BlockStack>
                    <div style={{ margin: "0.5rem 0" }}>
                      <Divider />
                    </div>
                    <Button primary url={plan_item.url}>
                      {plan_item.action}
                    </Button>
                  </Box>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}