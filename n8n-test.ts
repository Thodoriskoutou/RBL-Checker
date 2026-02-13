import PocketBase from 'pocketbase';
import { exit } from "node:process";

type WebhookData = {
    ip: string;
    timestamp: string;
    data: {
        rbl: string;
        reason: string;
    }[];
}

const pb = new PocketBase(Bun.env.PB_URL);

await pb.collection('_superusers').authWithPassword(Bun.env.PB_USER || "", Bun.env.PB_PASS || "");

if(!pb.authStore.isValid) {
    console.error('Could not connect to pocketbase!');
    exit(1);
}

const history = await pb.collection('history').getFullList({
    expand: 'ip,rbl',
    fields: 'reason,created,expand.ip.ip,expand.rbl.name',
    sort: 'ip,-created'
});

const grouped = Object.groupBy(history, item => item.expand?.ip.ip);

const webhookData = Object.keys(grouped).map(key => {
    return {
        ip: key,
        timestamp: new Date().toISOString(),
        data: grouped[key]?.map(g => {
            return {
                rbl: g.expand?.rbl.name,
                reason: g.reason
            }
        })
    }
})

console.log(JSON.stringify(webhookData));

if(webhookData.length && Bun.env.WEBHOOK_URL) {
    await fetch(Bun.env.WEBHOOK_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
    });
}