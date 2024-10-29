const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const playerObj = require('./playerobj.js');
const location = require('./locationdata.js');
const pgdata = require('./playergamedata.js');
//const game = require('./../commands/adventuregame/game.js');
// Initialise Database
const db = new sqlite3.Database('./game.db', (err) => {
if (err)
{
    console.error('Error connecting to database:', err.message);
}
else
{
  console.log('Connected to the SQLite database.');
  // get empty Player
  //player = new playerObj.Player(0, 'newPlayer', 100, 0, 'none', 'Grasslands', 'Foothills', 0);
  //const serializedObject = JSON.stringify(player);
  db.run('CREATE TABLE IF NOT EXISTS playerData (userId TEXT PRIMARY KEY, pdata BLOB)');
}});

//let p;
let plist = [];

function updateDBPlayer(userId, player)
{
  // get empty Player
  //player = new playerObj.Player(0, 'newPlayer', 100, 0, 'none', 'Grasslands', 'Foothills', 0);
  const serializedObject = JSON.stringify(player);
  db.run('INSERT OR REPLACE INTO playerData (userId, pdata) VALUES (?, ?)', [userId, serializedObject], (err) => {
    if (err) {
      console.error('Error updating player DB:', err.message);
    } else {
      console.log(`Updated player in DB.`);
    }
  });
  //console.log(player);
}

async function retrieveAllDBPlayers()
{
  db.all(`SELECT * FROM playerData`, (err, rows) =>
  {
    if (err)
    {
      console.error(err);
    }
    else
    {
      rows.forEach((row) =>
      {
        const deserializedObject = JSON.parse(row.pdata);
        console.log(deserializedObject); // { name: 'John', age: 30 }
      });
    }
  });
}

async function getThisPlayer(userId, userName)
{
  //console.log(`getThisPlayer: uid:${userId} - userName: ${userName}}`);
  var p = new playerObj.Player(userId, userName, 100, 0, 'none', 'Grasslands', 'Foothills', 0, pgdata.map);
  let dbp;
  db.get('SELECT pdata FROM playerData WHERE userId = ?', [userId], (err, dbplayer) =>
  {
    if (err) {
      console.log(`getThisPlayer DATABASE Error: ${err}`);
    } else if (dbplayer === undefined) {
      // Player not found in database, create new
      //p = new playerObj.Player(userId, userName, 100, 0, 'none', 'Grasslands', 'Foothills', 0, location.map);
      //updateDBPlayer(userId, p);
      //plist.push(p);
      console.log(`getThisPlayer dbplayer === undefined: ${userName} - ${userId} NOT found. New Player Created. Plist len: ${plist.length}`);
    } else {
      // Player found      
      dbp = JSON.parse(dbplayer.pdata);
      plist.push(dbp);
      console.log(`getThisPlayer else: ${userName} - ${userId} FOUND. Location: ${dbp.location} PlayerId: ${dbp.id} Plist len: ${plist.length}`);      
    }
  });
  var pl = findInPlist(userId);
  if (pl == undefined)
  {
    plist.push(dbp);
    console.log(`getThisPlayer: pl undefined - player must exist in DB - pushed into Plist len: ${plist.length}`);
  }
  return dbp;
}

async function findInPlist(id)
{
  for (let j = 0; j < plist.length; j++)
  {
    console.log(`findinPlist: ${plist[j].id} == ${id} : ${plist[j].id == id}`);
    if(plist[j].id == id)
    {
      return plist[j];
    }
  }
}

async function runGame(i,pl)
{
  //console.log("here");
  //var pl = await findInPlist(i.user.id);
  if(pl == undefined)
  {
    console.log(`run game top - ${i.user.id} pl undefined`);
    return;
  }
  //console.log(i.user.id, pl.id);
  if(i.user.id != pl.id)
  {
    console.log(`run game top2 - ${i.user.id} != ${pl.id}`);
    return;
  }
  console.log(`ok player found in plist: ${pl.name}`);
  const row = await buildButtons(pl);
  const { embed, imgu } = await buildEmbed(pl,i.member.user);

  //Display embed with buttons in actionrow in row     
  const reply = await i.reply({ embeds: [embed], components: [row], files: [imgu] });

  // Filter users that have clicked correct button
  //const filter = (i) => reply.userId//!winnerArray.includes(i.user.id);
  
  // Button Interaction Collector
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 300000
  });

  // Button Interaction Event Listener
  collector.on("collect", async (i) => {
    var pl = await findInPlist(i.user.id);
    if(pl == undefined){ return;}
    if(i.user.id != pl.id)
    {
      return;
    }
    i.deferUpdate();
    console.log(`${pl.name} clicked ${i.customId} button`);
    pl.location = i.customId;
    // for(var j in plist)
    // {
    //   if(plist[j].id == i.user.id)
    //   {
    //     plist[j].location = i.customId;
    //   }
    // }
    updateDBPlayer(i.user.id, pl);
    const row = await buildButtons(pl);
    const { embed, imgu } = await buildEmbed(pl,i.member.user); 
    reply.edit({ embeds: [embed], components: [row], files: [imgu] });
    //collector.stop();    
  });

  collector.on("end", async (i) => {
    // remove message from player - implement massage Xo)
    // save player to db? nahh
    // remove player from plist
    console.log(i);
    const embed = new EmbedBuilder()
      .setTitle(`Game has timed out. Use /game to continue.`)
      .setThumbnail('https://cdn.discordapp.com/attachments/1187246980993392731/1300293958924107776/GoldChaliceTransparent128.png?ex=6720509e&is=671eff1e&hm=532fa056863d1e290c7be291da53dcdad1e43548856a4fbf250dbc594f289e43&')
      .setColor(0xFFFF00)
      .setFooter({ text: `Gold Chalice Created by TG.`, iconURL: 'https://cdn.discordapp.com/attachments/1187246980993392731/1300293958924107776/GoldChaliceTransparent128.png?ex=6720509e&is=671eff1e&hm=532fa056863d1e290c7be291da53dcdad1e43548856a4fbf250dbc594f289e43&' });
      reply.edit({ embeds: [embed], components: [], files:[]}).catch(() => {});
  });
}

async function buildEmbed(pl,user)
{
  const place = location.map[pl.area][pl.location].description;
  const imgu = new AttachmentBuilder(location.map[pl.area][pl.location].imagepath, { name: location.map[pl.area][pl.location].filename });
  const embed = new EmbedBuilder()
  .setTitle(`Area: ${pl.area} - Location: ${pl.location}`)
  .setDescription(`${user}\n${place}`)
  .setThumbnail('https://cdn.discordapp.com/attachments/1187246980993392731/1300293958924107776/GoldChaliceTransparent128.png?ex=6720509e&is=671eff1e&hm=532fa056863d1e290c7be291da53dcdad1e43548856a4fbf250dbc594f289e43&')
  .setImage(`attachment://${imgu.name}`)
  .setColor(0xFFFF00)
  .setFooter({ text: `Gold Chalice Created by TG.`, iconURL: 'https://cdn.discordapp.com/attachments/1187246980993392731/1300293958924107776/GoldChaliceTransparent128.png?ex=6720509e&is=671eff1e&hm=532fa056863d1e290c7be291da53dcdad1e43548856a4fbf250dbc594f289e43&' });

  return { embed, imgu };
}

async function buildButtons(pl)
{
  directionArray = pl.map[pl.area][pl.location].directions;
  buttonArray = [];
  for (const d in directionArray)
  {
    const buttonx = new ButtonBuilder()
        .setLabel(`${directionArray[d]}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`${directionArray[d]}`);

    buttonArray.push(buttonx);
  };
  const row = new ActionRowBuilder();
  row.addComponents(buttonArray);
  return row;
}


function convertTimestamp (timestamp)
{
  const date = new Date(timestamp); // Convert seconds to milliseconds
  const formattedTime = `${date.toDateString()} - ${date.toTimeString()}`;
  return formattedTime;
}


// const myObject = { name: 'John', age: 30 };
// const serializedObject = JSON.stringify(myObject);

// db.run(`INSERT INTO objects (data) VALUES (?)`, [serializedObject], (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Object inserted successfully!');
//   }
// });

// Retrieving and deserializing objects
// To retrieve and deserialize the stored objects, you can use a similar approach:

// db.all(`SELECT * FROM objects`, (err, rows) => {
//   if (err) {
//     console.error(err);
//   } else {
//     rows.forEach((row) => {
//       const deserializedObject = JSON.parse(row.data);
//       console.log(deserializedObject); // { name: 'John', age: 30 }
//     });
//   }
// });


//function canPlay(userId, userName) {
//   return new Promise((resolve, reject) => {
//     db.get('SELECT lastPlayed FROM playerData WHERE userId = ?', [userId], (err, row) => {
//       if (err) {
//         reject(err);
//       } else if (row === undefined) {
//         // User not found in database, allow claim
//         console.log(`DB: ${userName} - ${userId} not found.`);
//         resolve(true);
//       } else {
//         // Check if 24 hours have passed since last claim
//         const lastClaimTime = row.lastPlayed;
//         const now = Date.now();
//         const cooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

//         // Calculate remaining time until next claim
//         console.log(`DB: ${userName} - ${userId} found - Too Early? ${now < lastClaimTime + cooldown}`);
//         console.log(`Time now: ${convertTimestamp(now)} - lastClaimTime: ${convertTimestamp(lastClaimTime)}`);
//         if (now < lastClaimTime + cooldown) {
//           const remainingTime = lastClaimTime + cooldown - now;
//           reject(new Error(`You can play again in ${(remainingTime / (1000 * 60 * 60)).toFixed(1)} hours.`));
//         } else {
//           console.log(`DB: ${userName} - ${userId} - User found - Resolved`)
//           resolve(true);
//         }
//       }
//     });
//   });
// }

// // Function to update user's last claim time
// function updateLastPlayTime(userId, userName) {
//   const now = Date.now();
//   db.run('INSERT OR REPLACE INTO playerData (userId, lastPlayed) VALUES (?, ?)', [userId, now], (err) => {
//     if (err) {
//       console.error('Error updating last play time:', err.message);
//     } else {
//       console.log(`Updated last play time for ${userName} - ${userId} - ${convertTimestamp(now)}.`);
//     }
//   });
// }
module.exports = { updateDBPlayer, retrieveAllDBPlayers, getThisPlayer, runGame };