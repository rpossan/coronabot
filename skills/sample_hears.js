module.exports = function(controller) {


  controller.hears('human', 'message_received', function (bot, message) {
    bot.reply(message, '[Vamos tentar falar com pessoas! (em desenvolvimento)](https://chatgem.herokuapp.com).');
  });

  controller.hears('test','message_received', function(bot, message) {

    bot.reply(message,'I heard a test');

  });

  controller.hears('portugues', 'message_received', function (bot, message) {
    bot.reply(message, 'Agora estamos falando em português!');
  });

  controller.hears('english', 'message_received', function (bot, message) {
    bot.reply(message, 'Now we are talking in english!');
  });

  controller.hears('typing','message_received', function(bot, message) {

    bot.reply(message,{
      text: 'This message used the automatic typing delay',
      typing: true,
    }, function() {

      bot.reply(message,{
        text: 'This message specified a 5000ms typing delay',
        typingDelay: 5000,
      });

    });

  });

}
