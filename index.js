const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const fetch = require('node-fetch');

// DATA
let listData = [], pricelist = {}, adminList = [], payCaption = '', commandList = [];
let botId;
let banList = [];


// LOAD FILE
try { listData = JSON.parse(fs.readFileSync('./list.json')); } catch {}
try { pricelist = JSON.parse(fs.readFileSync('./pricelist.json')); } catch {}
try { adminList = JSON.parse(fs.readFileSync('./admin.json')); } catch {}
try { payCaption = fs.readFileSync('./pay_caption.json', 'utf-8'); } catch {}
try { commandList = JSON.parse(fs.readFileSync('./commands.json')); } catch {}
try { banList = JSON.parse(fs.readFileSync('./banlist.json')); } catch {}


function safeMention(id) {
    if (!id || typeof id !== 'string') return [];
    return [ { id } ];
}

// CEK ADMIN
function isAdmin(id) {

// Helper untuk mentions yang aman
function safeMention(id) {
return (typeof id === 'string' && id.endsWith('@c.us')) ? [id] : [];
}

    return id === '6285172337723@c.us' || adminList.includes(id);
}

const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', async () => {
    console.log('Bot siap!');
    botId = client.info.wid._serialized;
console.log(`✅ Bot berjalan sebagai: ${botId}`);

    const ownerId = '6285172337723@c.us';
    if (!adminList.includes(ownerId)) {
        adminList.push(ownerId);
        fs.writeFileSync('./admin.json', JSON.stringify(adminList, null, 2));
        console.log(`✅ ${ownerId} ditambahkan sebagai admin utama`);
    }
});

const axios = require('axios');



client.on('message', async msg => {
    const fullMessage = msg.body.trim();
    const lowerMsg = fullMessage.toLowerCase();
    const from = msg.from;
    const senderId = msg.author || from;

    

// === LOGGING PER USER ===
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// === LOGGING PER USER DALAM FORMAT JSON ===
const logsFolder = path.join(__dirname, 'logs');
if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
}

const logFileName = path.join(logsFolder, `${senderId.replace('@c.us', '')}.json`);

// Format waktu lokal Indonesia (WIB)
const waktu = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

// Data log baru
const newLog = {
    timestamp: waktu,
    from: msg.fromMe ? 'BOT' : 'USER',
    message: fullMessage
};

// Baca file log yang sudah ada (kalau ada)
let logs = [];
if (fs.existsSync(logFileName)) {
    try {
        const existingData = fs.readFileSync(logFileName, 'utf8');
        logs = JSON.parse(existingData);
    } catch (err) {
        console.error(`❌ Gagal baca file log ${logFileName}:`, err);
    }
}

// Tambahkan log baru
logs.push(newLog);

// Simpan kembali ke file JSON
fs.writeFile(logFileName, JSON.stringify(logs, null, 2), err => {
    if (err) console.error(`❌ Gagal simpan log JSON untuk ${senderId}:`, err);
});


//Server growtopia
const axios = require('axios');

if (msg.body === '.sgt') {
    try {
        const url = `https://www.growtopiagame.com/detail?_=${Date.now()}`; // <== anti cache pake timestamp
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json',
                'Referer': 'https://www.growtopiagame.com/',
                'Origin': 'https://www.growtopiagame.com'
            }
        });

        const players = data.online_user;
        const status = data.status === 1 ? '🟢 *Online*' : '🔴 *Offline*';
        const update = new Date(data.last_world_update * 1000).toLocaleTimeString('id-ID');

        const replyText = `
🌐 *Growtopia Server Info*
👥 Pemain Online : *${players.toLocaleString()}*
📶 Status Server : ${status}
🕒 Terakhir Update: *${update}*
        `.trim();

        msg.reply(replyText);
    } catch (err) {
        console.error('❌ Gagal fetch data GT:', err.message);
        msg.reply('❌ Gagal ambil data Growtopia (mungkin diblokir sementara).');
    }
}


    

    
    


    await client.sendSeen(from);
    setTimeout(() => client.sendSeen(from), 1000);

    // === ADMIN ===
    if (lowerMsg.startsWith('.admin ')) {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa mengatur admin.');
        const args = fullMessage.slice(7).trim().split(' ');
        const action = args[0];
        const mentioned = msg.mentionedIds[0];
        if (!action || !mentioned) return msg.reply('⚠️ Format salah!\n.admin add @user\n.admin del @user');

        if (action === 'add') {
            if (adminList.includes(mentioned)) return msg.reply('⚠️ User tersebut sudah admin.');
            adminList.push(mentioned);
            fs.writeFileSync('./admin.json', JSON.stringify(adminList, null, 2));
            return msg.reply('✅ User tersebut sekarang admin.');
        }

        if (action === 'del') {
            const index = adminList.indexOf(mentioned);
            if (index === -1) return msg.reply('⚠️ User tersebut bukan admin.');
            adminList.splice(index, 1);
            fs.writeFileSync('./admin.json', JSON.stringify(adminList, null, 2));
            return msg.reply('🗑️ User tersebut telah dihapus dari admin.');
        }

        return msg.reply('⚠️ Format salah!\n.admin add @user\n.admin del @user');
    }

// === HIDE TAG ===
if (lowerMsg.startsWith('.h ')) {
const chat = await msg.getChat();
if (!chat.isGroup) return msg.reply('❌ Perintah ini hanya untuk grup.');

const senderId = msg.author || msg.from;
const isBotOwner = senderId === '6285172337723@c.us'; // ganti sesuai nomor lo

if (!isAdmin(senderId) && !isBotOwner) {
    return msg.reply('❌ Hanya admin bot atau owner yang bisa pakai perintah ini.');
}

const participants = chat.participants.map(p => p.id._serialized);
if (participants.length === 0) return msg.reply('❌ Grup ini kosong?');

const customMessage = msg.body.slice(3).trim();
const mentionText = customMessage.length > 0 ? customMessage : "👥 Hai semua!";

await chat.sendMessage(mentionText, {
    mentions: participants
});
}


// === LINK GRUP ===
if (lowerMsg === '.linkgc') {
const chat = await msg.getChat();
if (!chat.isGroup) return msg.reply('❌ Perintah ini hanya bisa digunakan di grup.');

const isBotOwner = msg.author === '6285172337723@c.us'; // nomor lo
const senderId = msg.author || msg.from;
const sender = chat.participants.find(p => p.id._serialized === senderId);
const isGroupAdmin = sender && (sender.isAdmin || sender.isSuperAdmin);

if (!isGroupAdmin && !isBotOwner) {
return msg.reply('❌ Hanya admin grup atau owner yang bisa ambil link grup.');
}

try {
const inviteCode = await chat.getInviteCode();
const groupLink = `https://chat.whatsapp.com/${inviteCode}`;
msg.reply(`🔗 GIRI MARKET:\n${groupLink}`);
} catch (err) {
msg.reply('❌ Gagal mengambil link. Pastikan bot adalah admin grup.');
}
}




// === CEK ID ML ===
if (lowerMsg.startsWith('.mlreg')) {
const args = msg.body.trim().split(' ');
if (args.length < 3) return msg.reply('❌ Format: .mlreg <id> <server>');

const id = args[1];
const server = args[2];

const url = `https://api.isan.eu.org/nickname/ml?id=${id}&server=${server}`;

try {
const response = await fetch(url);
const data = await response.json();

if (!data.success || !data.name) {
return msg.reply('❌ ID atau server tidak ditemukan.');
}

const reply = `🔎 Mobile Legends 🔍
🏷 Nickname: ${data.name}
🌍 Country: Indonesia 🇮🇩
GIRI MARKET`;

await msg.reply(reply);
} catch (err) {
console.error(err);
msg.reply('❌ Terjadi kesalahan saat memproses permintaan.');
}
}

// === CEK ID FF ===
if (lowerMsg.startsWith('.idff')) {
const args = msg.body.trim().split(' ');
if (args.length < 2) return msg.reply('❌ Format: .idff <id>');

const id = args[1];

const url = `https://api.isan.eu.org/nickname/ff?id=${id}`;

try {
const response = await fetch(url);
const data = await response.json();

if (!data.success || !data.name) {
return msg.reply('❌ ID tidak ditemukan.');
}

const reply = `🔎 Free Fire 🔍
🏷 Nickname: ${data.name}
🌍 Country: Indonesia 🇮🇩
GIRI MARKET`;

await msg.reply(reply);
} catch (err) {
console.error(err);
msg.reply('❌ Terjadi kesalahan saat memproses permintaan.');
}
}

// === CEK ID PUBG ===
if (lowerMsg.startsWith('.idpg')) {
const args = msg.body.trim().split(' ');
if (args.length < 2) return msg.reply('❌ Format: .idpg <id>');

const id = args[1];

const url = `https://api.isan.eu.org/nickname/pubg?id=${id}`;

try {
const response = await fetch(url);
const data = await response.json();

if (!data.success || !data.name) {
return msg.reply('❌ ID tidak ditemukan.');
}

const reply = `🔎 PUBG 🔍
🏷 Nickname: ${data.name}
🌍 Country: Indonesia 🇮🇩
GIRI MARKET`;

await msg.reply(reply);
} catch (err) {
console.error(err);
msg.reply('❌ Terjadi kesalahan saat memproses permintaan.');
}
}


    // === STIKER ===
    if (lowerMsg === '.sticker') {
        let media;
    
        // Cek kalau ada media langsung
        if (msg.hasMedia) {
            media = await msg.downloadMedia();
        }
        // Kalau gak ada, cek apakah reply dari pesan yang ada media
        else if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                media = await quotedMsg.downloadMedia();
            } else {
                return msg.reply('❌ Pesan yang direply gak ada medianya.');
            }
        } else {
            return msg.reply('❌ Kirim media atau reply media dengan .sticker');
        }
    
        // Kirim stiker
        return client.sendMessage(from, media, {
            sendMediaAsSticker: true,
            stickerAuthor: '@giri.store',
            stickerName: 'GiBot'
        });
    }

        // === STIKER BRAT ===
    if (lowerMsg.startsWith('.brat')) {
        const quotedText = msg.hasQuotedMsg ? (await msg.getQuotedMessage()).body : null;
        const inputText = msg.body.slice(6).trim(); // ambil teks setelah .brat

        if (!inputText && !quotedText) {
            return msg.reply('❌ Kirim atau reply teks pakai format: *.brat teksnya*');
        }

        let media;
        try {
            media = await MessageMedia.fromUrl(`https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(inputText || quotedText)}`, { unsafeMime: true });
        } catch {
            try {
                media = await MessageMedia.fromUrl(`https://mannoffc-x.hf.space/brat?q=${encodeURIComponent(inputText || quotedText)}`, { unsafeMime: true });
            } catch {
                return msg.reply('❌ Semua server Brat lagi down.');
            }
        }

        await client.sendMessage(msg.from, media, {
            sendMediaAsSticker: true,
            stickerAuthor: '@giri.store',
            stickerName: 'GiBOT'
        });
    }

    

    if (lowerMsg === '.ungkap') {
        if (!msg.hasQuotedMsg) return msg.reply('❌ Reply media sekali lihat dengan .ungkap');
    
        try {
            const quoted = await msg.getQuotedMessage();
            if (!quoted.hasMedia) return msg.reply('❌ Pesan yang direply tidak ada medianya.');
    
            const media = await quoted.downloadMedia();
            if (!media) return msg.reply('⚠️ Gagal ambil media.');
    
            await client.sendMessage(from, media, { caption: 'Succes' });
        } catch (err) {
            console.error('❌ Error ungkap:', err);
            msg.reply('❌ Gagal ungkap media.');
        }
    }
    


    
    // === LIST ===
    if (lowerMsg.startsWith('.addlist ')) {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa menambah list.');
        const item = fullMessage.slice(9).trim();
        if (!item) return msg.reply('❌ Format salah. Contoh: .addlist MLBB');
        listData.push(item);
        fs.writeFileSync('./list.json', JSON.stringify(listData, null, 2));
        return msg.reply(`✅ Ditambahkan ke list: ${item}`);
    }

    if (lowerMsg.startsWith('.dellist ')) {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa menghapus list.');
        const item = fullMessage.slice(9).trim();
        const index = listData.findIndex(x => x.toLowerCase() === item.toLowerCase());
        if (index !== -1) {
            listData.splice(index, 1);
            fs.writeFileSync('./list.json', JSON.stringify(listData, null, 2));
            return msg.reply(`🗑️ Dihapus dari list: ${item}`);
        }
        return msg.reply('❌ Item tidak ditemukan di list.');
    }

    // === RESET LIST ===
    if (lowerMsg === '.resetlist') {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa mereset list.');
        listData = [];
        fs.writeFileSync('./list.json', JSON.stringify([], null, 2));
        return msg.reply('✅ List berhasil direset.');
    }

    if (lowerMsg.replace(/^\./, '') === 'list') {
        if (listData.length === 0) return msg.reply('📭 List kosong.');
        const now = new Date();
        const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const bulan = now.toLocaleString('en-US', { month: 'short' });
        const tanggal = `${bulan} ${now.getDate().toString().padStart(2, '0')}, ${now.getFullYear()}`;
        const isiList = listData.map((x, i) => `${i + 1}. ${x}`).join('\n');
        return msg.reply(`*Alternatif jika tombol .list tidak muncul*\n\n${isiList}\n\nJam: ${jam}\nTanggal: ${tanggal}`);
    }

    // === PRICELIST ===
    if (lowerMsg.startsWith('.addprice ')) {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa menambah pricelist.');
        const [key, ...value] = fullMessage.slice(10).split('|').map(x => x.trim());
        if (!key || value.length === 0) return msg.reply('⚠️ Format salah!\nGunakan: *.addprice nama | isi*');
        pricelist[key.toLowerCase()] = value.join(' | ');
        fs.writeFileSync('./pricelist.json', JSON.stringify(pricelist, null, 2));
        return msg.reply(`✅ Pricelist untuk *${key}* berhasil ditambahkan / diupdate.`);
    }

    if (lowerMsg.startsWith('.delprice ')) {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa menghapus pricelist.');
        const key = fullMessage.slice(10).trim().toLowerCase();
        if (!pricelist[key]) return msg.reply(`❌ Tidak ditemukan pricelist dengan nama: *${key}*`);
        delete pricelist[key];
        fs.writeFileSync('./pricelist.json', JSON.stringify(pricelist, null, 2));
        return msg.reply(`🗑️ Pricelist untuk *${key}* berhasil dihapus.`);
    }

    // === AUTO-REPLY DARI PRICELIST ===
    const keys = Object.keys(pricelist);
    const matchKey = keys.find(k => lowerMsg === k.toLowerCase());
    if (matchKey) {
        return msg.reply(pricelist[matchKey]);
    }

    // === SETPAY ===
    if (lowerMsg.startsWith('.setpay')) {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa mengatur PAY.');
        if (!msg.hasMedia) return msg.reply('❌ Kirim .setpay bersama gambar dan caption-nya.');
        const media = await msg.downloadMedia();
        fs.writeFileSync('./pay.jpg', media.data, 'base64');
        const caption = msg.body.split('\n').slice(1).join('\n').trim();
        fs.writeFileSync('./pay_caption.json', caption);
        payCaption = caption;
        return msg.reply('✅ PAY berhasil disimpan dengan gambar dan caption.');
    }

    if (lowerMsg === 'pay') {
        if (fs.existsSync('./pay.jpg')) {
            const media = MessageMedia.fromFilePath('./pay.jpg');
            return client.sendMessage(from, media, { caption: payCaption });
        }
        return msg.reply('⚠️ PAY belum disetting, kirim .setpay + gambar + caption.');
    }

    // === ADMINLIST ===
    if (lowerMsg === '.adminlist') {
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa melihat daftar admin.');
        if (adminList.length === 0) return msg.reply('📭 Belum ada admin terdaftar.');
        
        const ownerId = '6285172337723@c.us';
        const adminText = adminList.map((id, i) => {
            const label = id === ownerId ? ' (Owner)' : '';
            return `${i + 1}. wa.me/${id.replace('@c.us', '')}${label}`;
        }).join('\n');
    
        return msg.reply(`👑 Admin:\n\n${adminText}`);
    }
    
    // === .CMD FITUR ===
// === .CMD FITUR (pakai array string format)
if (lowerMsg === '.cmd') {
    if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa melihat command.');
    if (commandList.length === 0) return msg.reply('📭 Belum ada command terdaftar.');
    const commandText = commandList.map((cmd, i) => `${i + 1}. ${cmd}`).join('\n');
    return client.sendMessage(senderId, `📜 *Daftar Command:*\n\n${commandText}`);
}

if (lowerMsg.startsWith('.addcmd ')) {
    if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa menambah command.');
    const isi = fullMessage.slice(8).trim();
    if (!isi || !isi.includes(' - ')) return msg.reply('⚠️ Format salah!\nContoh: .addcmd .list - Menampilkan list');
    commandList.push(isi);
    fs.writeFileSync('./commands.json', JSON.stringify(commandList, null, 2));
    return msg.reply('✅ Command berhasil ditambahkan.');
}

if (lowerMsg.startsWith('.delcmd ')) {
    if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin yang bisa menghapus command.');
    const cmd = fullMessage.slice(8).trim().toLowerCase();
    const index = commandList.findIndex(x => x.toLowerCase().startsWith(cmd));
    if (index !== -1) {
        const removed = commandList.splice(index, 1);
        fs.writeFileSync('./commands.json', JSON.stringify(commandList, null, 2));
        return msg.reply(`🗑️ Command *${removed}* berhasil dihapus.`);
    }
    return msg.reply(`❌ Command *${cmd}* tidak ditemukan.`);
}


    
    
        // === PROMOTE ===
if (lowerMsg.startsWith('.promote')) {
const chat = await msg.getChat();
if (!chat.isGroup) return msg.reply('❌ Hanya untuk grup.');
if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin bot yang bisa pakai perintah ini.');
if (!msg.mentionedIds || msg.mentionedIds.length === 0) return msg.reply('⚠️ Tag member yang mau dipromosikan.');

for (let id of msg.mentionedIds) {
try {
await chat.promoteParticipants([id]);
await msg.reply(`✅ Promosi jadi admin: @${id.replace('@c.us', '')}`, { mentions: safeMention(id) });
} catch (err) {
await msg.reply(`❌ Gagal promosiin: @${id.replace('@c.us', '')}`, { mentions: safeMention(id) });
}
}
}

// === DEMOTE ===
if (lowerMsg.startsWith('.demote')) {
    const chat = await msg.getChat();
    if (!chat.isGroup) return msg.reply('❌ Hanya untuk grup.');
    if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin bot yang bisa pakai perintah ini.');
    if (!msg.mentionedIds || msg.mentionedIds.length === 0) return msg.reply('⚠️ Tag member yang mau diturunin.');

    for (let rawId of msg.mentionedIds) {
        const id = typeof rawId === 'string' ? rawId : (rawId?.id || rawId?._serialized || '');
        if (!id || !id.endsWith('@c.us')) continue;

        try {
            await chat.demoteParticipants([id]);
            await msg.reply(`⬇️ Diturunin dari admin: @${id.replace('@c.us', '')}`, {
                mentions: [id]
            });
        } catch (err) {
            console.error(`❌ Gagal demote ${id}:`, err);
            try {
                await msg.reply(`❌ Gagal nurunin: @${id.replace('@c.us', '')}`, {
                    mentions: [id]
                });
            } catch (e) {
                console.error('❌ Gagal reply error ke user:', e);
            }
        }
    }
}

// === BAN ===
if (lowerMsg.startsWith('.ban')) {
    const chat = await msg.getChat();
    if (!chat.isGroup) return msg.reply('❌ Hanya untuk grup.');
    if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin bot yang bisa pakai perintah ini.');
    if (!msg.mentionedIds || msg.mentionedIds.length === 0) return msg.reply('⚠️ Tag member yang mau diban.');

    for (let rawId of msg.mentionedIds) {
        const id = typeof rawId === 'string' ? rawId : (rawId?.id || rawId?._serialized || '');
        if (!id || !id.endsWith('@c.us')) continue;

        if (!banList.includes(id)) {
            banList.push(id);
            fs.writeFileSync('./banlist.json', JSON.stringify(banList, null, 2));
        }

        try {
            const contact = await client.getContactById(id); // FIX: ambil Contact object
            await chat.removeParticipants([id]);
            await msg.reply(`🔨 Dibanned dan dikeluarkan: @${id.replace('@c.us', '')}`, {
                mentions: [contact] // SAFE: pakai Contact
            });
        } catch (err) {
            console.error('❌ Error saat ban:', err);
            try {
                const contact = await client.getContactById(id);
                await msg.reply(`❌ Gagal ban @${id.replace('@c.us', '')}`, {
                    mentions: [contact]
                });
            } catch {
                await msg.reply(`❌ Gagal ban (ID: ${id})`);
            }
        }
    }
}



    

    
    

    // === CLOSE & OPEN ===
    if (lowerMsg === '.close' || lowerMsg === '.open') {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Hanya untuk grup.');
        if (!isAdmin(senderId)) return msg.reply('❌ Hanya admin bot yang bisa mengatur grup.');
        const lock = lowerMsg === '.close';
        await chat.setMessagesAdminsOnly(lock);
        return msg.reply(lock ? '🔒 Grup ditutup.' : '🔓 Grup dibuka.');
    }
});

// === EVENT WELCOME / LEAVE ===
client.on('group_join', async (notification) => {
    const chat = await notification.getChat();

    for (let id of notification.recipientIds) {
        try {
            const contact = await client.getContactById(id);
            const name = contact.pushname || contact.number;
            const mentionId = contact.id?._serialized;

            if (!mentionId || typeof mentionId !== 'string') continue;

            let media;
            try {
                const ppUrl = await client.getProfilePicUrl(mentionId);
                media = await MessageMedia.fromUrl(ppUrl);
            } catch {
                media = MessageMedia.fromFilePath('./welcome.jpg'); // ganti jadi welcome.jpg
            }

            const caption = `👋 Selamat datang @${contact.number}!\nSemoga betah di grup *${chat.name}*! 🎉`;

            await client.sendMessage(chat.id._serialized, media, {
                caption,
                mentions: [mentionId]
            });
        } catch (err) {
            console.error('❌ Error handle join:', err);
        }
    }
});




client.on('group_leave', async (notification) => {
    try {
        const chat = await notification.getChat();
        const leftId = notification.id.participant; // INI ID ORANG YANG KELUAR

        if (!leftId || typeof leftId !== 'string') return;

        const contact = await client.getContactById(leftId);
        const name = contact.pushname || contact.number;

        let media;
        try {
            const ppUrl = await client.getProfilePicUrl(leftId);
            media = await MessageMedia.fromUrl(ppUrl);
        } catch {
            media = MessageMedia.fromFilePath('./bye.jpg');
        }

        const caption = `👋 @${contact.number} telah keluar dari grup *${chat.name}*.\nSampai jumpa dan semoga sukses! 🌟`;

        await client.sendMessage(chat.id._serialized, media, {
            caption,
            mentions: [leftId]
        });
    } catch (err) {
        console.error('❌ Error handle leave:', err);
    }

    const chat = await notification.getChat();
    for (let id of notification.recipientIds) {
        if (banList.includes(id)) {
            await chat.removeParticipants([id]);
            await client.sendMessage(chat.id._serialized, `⛔ User @${id.replace('@c.us', '')} telah dibanned.`, {
                mentions: safeMention(id)
            });
            continue;
        }

        // Proses welcome biasa...
    }
    
});







client.initialize();
