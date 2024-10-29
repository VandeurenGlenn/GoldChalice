import {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType
} from 'discord.js'

let interval
let rndPos = 0
let nameArray = []
let winnerArray = []
let alreadyClic = []
let txSuccess = false
let intervalID
let amount = 0
let valueInUsd = 0
//let running = false;

// Trivia controls
const adminRoleName = 'Team'
const currency = 'Rhine'
let triviaPayoutPerQuestion = 5
let timerInterval = 2700000 // 45 mins is 2700000 (default)
const minimumTimetoAnswer = 16000 // 30s
const playersThatCanAnswer = 2

// Function to fetch RHINE price from CoinBrain API
async function fetchRhinePrice() {
  const response = await fetch('https://api.coinbrain.com/public/coin-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      '56': ['0x8d1437a21f055B88C29a80EE65C400de8959525b']
    })
  })
  const data = await response.json()
  const rhinePrice = data[0].priceUsd
  return rhinePrice
}

function clean(q) {
  q = q
    .replaceAll('&amp;', '&')
    .replaceAll('&ntilde;', 'ñ')
    .replaceAll('&#039;', "'")
    .replaceAll('&rsquo;', "'")
    .replaceAll('&ldquo;', '"')
    .replaceAll('&rdquo;', '"')
    .replaceAll('&quot;', '"')
    .replaceAll('&hellip;', '…')
    .replaceAll('&sup2;', '²')
    .replaceAll('&ecirc;', 'ê')
    .replaceAll('&aacute;', 'á')
    .replaceAll('&eacute;', 'é')
    .replaceAll('&uuml;', 'ü')
    .replaceAll('$Sigma;', 'Σ')
    .replaceAll('&Pi;', 'π')
    .replaceAll('&omicron;', 'ο')
    .replaceAll('&Omicron;', 'Ο')
    .replaceAll('$sigma;', 'σ')
    .replaceAll('$Nu;', 'Ν')

  return q
}

export const data = new SlashCommandBuilder()
  .setName('trivia')
  .setDescription('Select a timer interval.')
  .addIntegerOption((option) =>
    option.setName('interval').setDescription('Set timer interval').setMinValue(30000).setMaxValue(timerInterval)
  )

export const execute = async (interaction) => {
  interval = interaction.options.getInteger('interval')
  console.log(interval)
  //await interaction.deferReply({ ephemeral: true });
  //intervalID = setTimeout(async () => {
  //try {
  // Fetch a question and answers
  const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify()
  })
  // Get data from results
  const data = await response.json()
  const difficulty = data['results'][0]['difficulty']
  const category = clean(data['results'][0]['category'])
  const question = clean(data['results'][0]['question'])
  var wrongAnswers = data['results'][0]['incorrect_answers']
  const answer = clean(data['results'][0]['correct_answer'])
  console.log(wrongAnswers)
  //await interaction.reply({ content: 'hmm' });
  for (const index in wrongAnswers) {
    wrongAnswers[index] = clean(wrongAnswers[index])
  }
  // Insert answer at random position
  const wlen = wrongAnswers.length
  rndPos = Math.floor(Math.random() * wlen)
  wrongAnswers.splice(rndPos, 0, answer)

  // Builds Question embed
  const embed = new EmbedBuilder()
    .setTitle(`${category} Question!\nDifficulty: ${difficulty}`)
    .setDescription(`\n# ${question}\n`)
    .setColor(0xffff00)

  //Build button array
  buttonArray = []
  const row = new ActionRowBuilder()
  for (const answer in wrongAnswers) {
    const buttonx = new ButtonBuilder()
      .setLabel(`${wrongAnswers[answer]}`)
      .setStyle(ButtonStyle.Primary)
      .setCustomId(`${answer}`)

    buttonArray.push(buttonx)
  }

  // Add Array to row
  row.addComponents(buttonArray)

  // display embed with buttons in actionrow in row
  //const reply = await interaction.edit({ embeds: [embed], components: [row] });
  const reply = await interaction.reply({ embeds: [embed], components: [row] })
  //await interaction.reply({ content: 'hmm' });

  // filter users that have clicked correct button
  const filter = (i) => !winnerArray.includes(i.user.id)

  // Button Interaction Collector
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter,
    time: minimumTimetoAnswer,
    maxUsers: playersThatCanAnswer
  })

  // Button Interaction Event Listener
  collector.on('collect', (i) => {
    i.deferUpdate()
    //console.log(`${i.customId} == ${rndPos}? ${i.customId == rndPos}`);
    if (i.customId == rndPos && !alreadyClic.includes(i.user.id) && !winnerArray.includes(i.user.id)) {
      winnerArray.push(i.user.id)
      nameArray.push(i.user.globalName)
    } else if (!alreadyClic.includes(i.user.id)) {
      // catch users that clicked wrong button first
      alreadyClic.push(i.user.id)
    }
    //console.log(`User not in winnerArray? ${!winnerArray.includes(i.user.id)} | winnerArray: |${winnerArray}|\nUser not in alreadyClic? ${!alreadyClic.includes(i.user.id)} | alreadyClic: |${alreadyClic}|` );
  })

  collector.on('end', () => {
    // Adjust buttons for correct answer and disable them
    for (var button in buttonArray) {
      buttonArray[button].setDisabled(true)
      if (button == rndPos) {
        buttonArray[button].setStyle(ButtonStyle.Success)
      }
    }

    // Check for winners and pay
    if (winnerArray.length > 0) {
      amount = triviaPayoutPerQuestion / winnerArray.length
      //sendTX(amount, winnerArray, currency);
      if (txSuccess) {
        console.log(`${amount} ${currency} was sent to each of these recipients: ${winnerArray}`)
      } else {
        console.log(`TX Fail: ${winnerArray}`)
      }
    }
    //console.log(`Winners: NameArray: |${nameArray}| WinnerArray |${winnerArray}|`);
    //Each winner was paid ${amount} ${currency} (~$${valueInUsd})
    //Transaction was ${txSuccess ? 'Successful' : 'Unsuccessful'}`)

    // Rebuild the embed for payouts
    const embed2 = new EmbedBuilder()
      .setTitle(`${category} Question!\nDifficulty: ${difficulty}`)
      .setDescription(
        `${question}\n\nAnswer: ${answer}\n\nWinners: ${nameArray}\n\nEach winner was paid ludicrous amounts of kudos!`
      )
      .setColor(txSuccess ? 0x00ff00 : 0xff0000) // Green for success - Red for unsuccessful

    reply.edit({ embeds: [embed2], components: [row] })

    // Reset payment vars
    nameArray = []
    winnerArray = []
    alreadyClic = []
    txSuccess = false
  })

  // } catch (error) {
  //   console.error('Error from Trivia API: ', error.message);
  //   const embed = new EmbedBuilder()
  // 	.setTitle('Error')
  // 	.setDescription('Error from Trivia API: ' + error.message)
  // 	.setColor(0xFF0000); // Red color for error

  //   await interaction.reply({ embeds: [embed] });
  // }
  //}, Math.floor((Math.random() * interval) + minimumTimetoAnswer));
}

export default {
  data,
  execute
}
