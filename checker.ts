import { promises as dns } from "node:dns";
import PocketBase from 'pocketbase';
import { lookup } from 'dnsbl';
import { exit } from "node:process";

const pb = new PocketBase(Bun.env.PB_URL);

await pb.collection('_superusers').authWithPassword(Bun.env.PB_USER || "", Bun.env.PB_PASS || "")

if(!pb.authStore.isValid) {
    console.error('Could not connect to pocketbase!');
    exit(1);
}

const rbls = await pb.collection('rbls').getFullList({
    filter: 'disabled=false',
    fields: 'id,domain'
});

const ips = await pb.collection('ips').getFullList({
    fields: 'id,ip,ptr,listed'
});

for (const ip of ips) {
    if(!ip.ptr.length) {
        const ptr = await dns.reverse(ip.ip);
        if(ptr.length) {
            await pb.collection('ips').update(ip.id, {
                ptr: ptr[0]
            });
        }
    }
    for (const rbl of rbls) {
        const result = await lookup(ip.ip, rbl.domain, {includeTxt: true, servers: null});
        if(result.listed != ip.listed) {
            await pb.collection('ips').update(ip.id, {
                listed: result.listed
            });
            if(result.listed && Bun.env.WEBHOOK_URL) {
                await fetch(Bun.env.WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ip,
                        rbl,
                        result
                    })
                });
            }
        }
        if(result.listed) {
            await pb.collection('history').create({
                ip: ip.id,
                rbl: rbl.id,
                reason: result.txt.join("\n")
            });
        }
    }
}
