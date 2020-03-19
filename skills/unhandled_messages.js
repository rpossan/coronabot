var shell = require('shelljs');
var fs = require('fs');
var xlsx = require('node-xlsx');
var fulltextsearchlight = require('full-text-search-light');
var prepos = ["olá", "ola", "oi", "bom", "dia", "boa", "tarde", "noite", "a",
"o", "as", "os", "e", "ao", "aos", "à", "até", "não", "após", "ante", "com",
"conforme", "contra", "de", "da", "do", "desde", "durante", "em", "entre",
"mediante", "para", "perante", "por", "salvo", "sem", "sob", "sobre", "trás",
"antes", "depois"]


class CoronaQA {
  constructor(message) {
    this.message = message;
    this.success = false;
    this.answers = [];
    this.source = xlsx.parse('knowledge/corona_qa.xlsx');
    this.qas = this.getQAs();
  }

  // get an array with questions and answers
  getQAs(){
    var qas = [];
    this.source.forEach(function(sheet){
      sheet["data"].forEach(function(row){
        if(row[1] != undefined || row[2] != undefined){
          qas.push([row[1], row[2], row[3]]);
        }
      })
    });
    return qas;
  }

  processXL(){
    var search = new fulltextsearchlight( { ignore_case: true } );
    this.qas.forEach(function(qa){
      var line = { question: qa[0], answer: qa[1], midia: ''};
      if(qa[2]){ line['midia'] = qa[2] };
      search.add(line);
    })

    var found_answers = search.search(this.message);

    console.log("Pergunta: " + this.message);
    if (found_answers.length > 0){
      console.log(found_answers);
      this.answers = found_answers;
      this.success = true;
      console.log("Respostas: " + this.answers.length);
      return true;
    }else{
      console.log("!NOT FOUND!");
      this.success = false;
      return false;
    }

  }
}

module.exports = function(controller) {

  controller.on('message_received', function(bot, message) {
      bot.reply(message, {text: "Humn ... deixe me pensar ...", typing: true });
      questions_answers = new CoronaQA();
      var parsed_msg = message.text.replace('?','');
      questions_answers.message = parsed_msg;
      console.log(questions_answers.message);
      if(questions_answers.processXL()){
        var text = "";
        var replies = [{ title: 'Help', payload: 'human', }];
        if(questions_answers.answers.length > 1){
          text = "Humn ... não entendi direito a sua pergunta. Talvez esses assuntos façam sentido:"
          questions_answers.answers.forEach(function(a){
            replies.push({title: a['question'], payload: a['question']});
          })
        }else{
          replies.push({ title: 'Entendi', payload: 'finish'});
          replies.push({ title: 'Não me ajudou', payload: 'reset' });
          var found_answer = questions_answers.answers[0];
          text = found_answer.answer;
          if(found_answer.midia != ''){
            text = text + '<br /><center><iframe width="160" height="90"' +
            'src="' + found_answer.midia + '"></iframe></center>';
          }

        }

        bot.reply(message, {
          typing: true, text: text, quick_replies: replies
        });
      }else{
        bot.reply(message, {
          text: 'Não entendi a sua mensagem. [Talvez um humano pode te ajudar!](https://chatgem.herokuapp.com).',
            quick_replies: replies
        });
      }
  });

}
