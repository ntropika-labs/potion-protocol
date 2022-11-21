import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";

import { AutotaskClient, CreateAutotaskRequest, UpdateAutotaskRequest } from "defender-autotask-client";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const AutotaskName = "[Goerli] Potion Testnet Competition";
const LocalAutotaskFolder = "./autotaskTestComp";
const RelayerId = "5d34227d-a696-4ec6-a50d-b76854ff2b78";
const Trigger = {
    type: "schedule" as CreateAutotaskRequest["trigger"]["type"],
    cron: "0 9 * * *",
};

async function main(): Promise<void> {
    if (!process.env.OZ_API_KEY) {
        throw new Error("Missing OZ_API_KEY env var");
    }
    if (!process.env.OZ_API_SECRET) {
        throw new Error("Missing OZ_API_SECRET env var");
    }

    const client = new AutotaskClient({ apiKey: process.env.OZ_API_KEY, apiSecret: process.env.OZ_API_SECRET });

    // Check if autotask exists
    const autotasks = await client.list();
    for (const autotask of autotasks.items) {
        if (autotask.name === AutotaskName) {
            // Update Autotask
            const request: UpdateAutotaskRequest = {
                name: autotask.name,
                autotaskId: autotask.autotaskId,
                encodedZippedCode: await client.getEncodedZippedCodeFromFolder(resolve(__dirname, LocalAutotaskFolder)),
                relayerId: autotask.relayerId,
                trigger: autotask.trigger,
                paused: autotask.paused,
            };

            const updatedTask = await client.update(request);

            console.log(`\nAutotask ${AutotaskName} with ID ${updatedTask.autotaskId} updated!`);

            return;
        }
    }

    // Create Autotask
    console.log(`Creating autotask ${AutotaskName}...`);
    const request: CreateAutotaskRequest = {
        name: AutotaskName,
        encodedZippedCode: await client.getEncodedZippedCodeFromFolder(resolve(__dirname, LocalAutotaskFolder)),
        relayerId: RelayerId,
        trigger: Trigger,
        paused: true,
    };

    const createdTask = await client.create(request);

    console.log(`\nAutotask ${AutotaskName} with ID ${createdTask.autotaskId} created!`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
