/* This module kicks in if no Botkit Studio token has been provided */

module.exports = function(controller) {

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', conductOnboarding);

    function conductOnboarding(bot, message) {
      var greetings = 'Olá, sou o <b>Corona Bot</b> e estou aqui para te informar e te ajudar' +
      'a se prevenir do <b>Corona Virus</b> e juntos iremos combater esta epidemia.' +
      '<br />Você pode começar me perguntando algo, mas vou te deixar algumas sugestões abaixo.' +
      '<br /> Hey, mas não deixe de me compartilhar com seus amigos e favoritar meu projeto' +
      'nos links abaixos para apoiar o meu desenvolvimento.';
      bot.startConversation(message, function(err, convo) {
        convo.say({
          text: greetings,
          quick_replies: [
            { title: 'Help', payload: 'human', },
            { title: 'O que é o corona?', payload: 'corona', },
            { title: 'Como se previnir?', payload: 'como se previnir', },
            { title: 'Como lavar as mãos?', payload: 'Como lavar as mãos', },
          ]
        });
      });
    }

    controller.hears(['help','contact','documentation','docs','community'], 'message_received', function(bot, message) {

      bot.startConversation(message, function(err, convo) {

        // set up a menu thread which other threads can point at.
        convo.ask({
          text: 'I can point you to resources, and connect you with experts who can help.',
          quick_replies: [
            {
              title: 'Read the Docs',
              payload: 'documentation',
            },
            {
              title: 'Join the Community',
              payload: 'community',
            },
            {
              title: 'Expert Help',
              payload: 'contact us',
            },
          ]
        },[
          {
            pattern: 'human',
            callback: function (res, convo) {
              convo.gotoThread('human');
              convo.next();
            }
          },
          {
            pattern: 'documentation',
            callback: function(res, convo) {
              convo.gotoThread('docs');
              convo.next();
            }
          },
          {
            pattern: 'community',
            callback: function(res, convo) {
              convo.gotoThread('community');
              convo.next();
            }
          },
          {
            pattern: 'contact',
            callback: function(res, convo) {
              convo.gotoThread('contact');
              convo.next();
            }
          },
          {
            default: true,
            callback: function(res, convo) {
              convo.gotoThread('end');
            }
          }
        ]);

        // set up docs threads
        convo.addMessage({
          text: 'Eu não sei como te ajudar. Diga `help` caso precise de ajuda.'
        },'end');

        // set up docs threads
        convo.addMessage({
          text: 'Botkit is extensively documented! Here are some useful links:\n\n[Botkit Studio Help Desk](https://botkit.groovehq.com/help_center)\n\n[Botkit Anywhere README](https://github.com/howdyai/botkit-starter-web/blob/master/readme.md#botkit-anywhere)\n\n[Botkit Developer Guide](https://github.com/howdyai/botkit/blob/master/readme.md#build-your-bot)',
        },'docs');

        convo.addMessage({
          action: 'default'
        }, 'docs');


        // set up community thread
        convo.addMessage({
          text: 'Our developer community has thousands of members, and there are always friendly people available to answer questions about building bots!',
        },'community');

        convo.addMessage({
          text: '[Join our community Slack channel](https://community.botkit.ai) to chat live with the Botkit team, representatives from major messaging platforms, and other developers just like you!',
        },'community');

        convo.addMessage({
          text: '[Checkout the Github Issue Queue](https://github.com/howdyai/botkit/issues) to find frequently asked questions, bug reports and more.',
        },'community');

        convo.addMessage({
          action: 'default'
        }, 'community');



        // set up contact thread
        convo.addMessage({
          text: 'The team who built me can help you build the perfect robotic assistant! They can answer all of your questions, and work with you to develop custom applications and integrations.\n\n[Use this form to get in touch](https://botkit.ai/contact.html), or email us directly at [help@botkit.ai](mailto:help@botkit.ai), and a real human will get in touch!',
        },'contact');
        convo.addMessage({
          action: 'default'
        }, 'contact');


      });

    });


}
