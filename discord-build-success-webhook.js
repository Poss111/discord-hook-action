module.exports = {
  username: "Github Action Bot",
  avatar_url: "https://i.imgur.com/Hrbi1Ht.jpg",
  embeds: [
    {
      author: {
        name: "Discord Action Webhook",
        url: "https://github.com/Poss111/discord-hook-action",
        icon_url: "https://img.icons8.com/ios-filled/344/github-2.png"
      },
      title: "Clash Bot Deployment Notification",
      description: "Github build succeeded!",
      color: 65345,
      fields: [
        {
          name: "Build #",
          inline: true
        },
        {
          name: "Branch",
          inline: true
        },
        {
          name: "SHA",
          inline: false
        },
        {
          name: "Triggered By",
          inline: false
        }
      ]
    }
  ]
}
