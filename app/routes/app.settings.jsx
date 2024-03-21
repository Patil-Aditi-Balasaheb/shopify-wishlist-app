import {
    Box,
    Card,
    InlineGrid,
    TextField,
    Page,
    Text,
    BlockStack,
    useBreakpoints,
    Divider,
    Button,
} from "@shopify/polaris";
import { useState } from "react";
import { json } from "@remix-run/node"
import { useLoaderData, Form } from "@remix-run/react";

// Import prisma db
import db from "../db.server.js"

export async function loader() {
    /*
    // static data
    let settings = {
        name: "My app",
        description: "My app description"
    }

    return json(settings)
    */

    // get data from database
    let settings = await db.settings.findFirst();
    return json(settings)
}

export async function action({ request }) {
    let settings = await request.formData();
    settings = Object.fromEntries(settings)

    // update the database
    await db.settings.upsert({
        where: {
            id: '1'
        },
        update: {
            id: '1',
            name: settings.name,
            description: settings.description
        },
        create: {
            id: '1',
            name: settings.name,
            description: settings.description
        }
    })

    return json({ settings: settings, message: 'Settings updated' })
}

export default function SettingsPage() {
    const { smUp } = useBreakpoints();

    const settings = useLoaderData();

    const [formSaved, setFormSaved] = useState(settings);

    return (
        <Page>
            <ui-title-bar title="Settings" />
            <BlockStack gap={{ xs: "800", sm: "400" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box
                        as="section"
                        paddingInlineStart={{ xs: 400, sm: 0 }}
                        paddingInlineEnd={{ xs: 400, sm: 0 }}
                    >
                        <BlockStack gap="400">
                            <Text as="h3" variant="headingMd">
                                Settings
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Update app settings and preferences
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <Form method="POST">
                            <BlockStack gap="400">
                                <TextField label="App name" name="name" value={formSaved?.name} onChange={(value) => setFormSaved({ ...formSaved, name: value })} />
                                <TextField label="Description" name="description" value={formSaved?.description} onChange={(value) => setFormSaved({ ...formSaved, description: value })} />
                                <Button submit={true}>Save</Button>
                            </BlockStack>
                        </Form>
                    </Card>
                </InlineGrid>
                {smUp ? <Divider /> : null}
            </BlockStack>
        </Page>
    );
}

function Code({ children }) {
    return (
        <Box
            as="span"
            padding="025"
            paddingInlineStart="100"
            paddingInlineEnd="100"
            background="bg-surface-active"
            borderWidth="025"
            borderColor="border"
            borderRadius="100"
        >
            <code>{children}</code>
        </Box>
    );
}
