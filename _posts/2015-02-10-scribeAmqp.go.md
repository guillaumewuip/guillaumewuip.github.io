---
title: AMQP + Scribe.js for a lightweight logs management

draft: false

page : true

---
*This post was [originally published on Medium](https://medium.com/@guillaumewuip/amqp-scribe-js-for-a-lightweight-logs-management-ed632f057a2a).*

As I was doing some tests to build a SOA (Service Oriented Architecture) app, I realized that I had to take some time to think about logs management.

In a SOA app, where logs go ?

As a contributor to the [Scribe.js](https://github.com/mathew-kurian/Scribe.js) NodeJS library, I decided to use it as a log collector that listen at an AMQP queue.

<figure>
  <img alt="A SOA app architecture" src="/assets/img/amqp-soap.png" />
  <figcaption>
    A SOAP architecture
  </figcaption>
</figure>

# SOA

First, let’s recap why I need a SOA app.

As for now, I was basically creating NodeJS+MongoDB web apps for my sides projects. Things get complicated when the app grows up.

There is more and more files and despite the use of NodeJS modules I spend more and more time understanding the code I’ve written 3 months ago and why it’s in this file.

Another drawback of the use of a huge single app is that you have to restart everything at every update. Let’s say I’ve coded a little fix for one module. I don’t want to restart all the app to update it. I just want to git push changes for the module and restart it.

I’m also tired of the NodeJS+MongoDB combo. I want to split my code into different languages for my sides projects in order to create opportunities to progress with other solutions (Go, Ruby, Couchbase, etc.).

I also stated to think about scaling (or at least how to scale if I need to). Having a huge app is [absolutely not the best answer](https://fr.slideshare.net/quentinadam/dotscale2013-how-to-scale).

<figure>
  <img alt="monolith model vs SOAP" src="/assets/img/amqp-models.png" />
  <figcaption>
    The huge app model vs the SOA model.
  </figcaption>
</figure>

So here’s the goal: split the app from the huge model to the SOA model in order to manage each part independently (update, scale, …).

Of course modules need to talk to each other. And I mainly use HTTP and AMQP (Advanced Message Queue Protocol) for that.

> Ok, but you tell me this post is about logs …

Oh yes, sorry… At least now you’ve probably understood my problem: where all logs were emitted from a single app in the huge model, there is now logs coming from everywhere.
A solution I’ve found is sending all logs over AMQP to an “aggregator” module that runs Scribe.js.

# Scribe.js

[Scribe.js](https://github.com/mathew-kurian/Scribe.js) is a lightweight NodeJS logging module. It basically consists in two ideas: extending the console object and serving a web app to manage logs.
The web app allows people to browse/filter/search their logs via an AngularJS app.


Here’s an example of NodeJS code:

```javascript
//create a default console, attach it to process, save logs on disk
var scribe = require('scribe-js')(); 

//do not use global.console but the new console instead
var console = process.console;

var app = require('express')();

console.tag('Test').time().file().log('Hello World');

//the WebPanel
app.use('/logs', scribe.webPanel());
app.listen(80);
//that's it, see you at http://localhost/logs for your logs !
```

![log output](/assets/img/amqp-output.png)

For more on Scribe.js, see the Github repo.


# AMQP

AMQP is a message broker protocol. I use RabbitMQ as the message broker. There are different patterns such as publish / subscribe, work queue, RPC.

> Applications connect to each other, as components of a larger application, or to user devices and data. Messaging is asynchronous, decoupling applications by separating, sending and receiving data. - [RabbitMQ doc](http://www.rabbitmq.com/features.html)

<figure markdown="1">
  ![architecture idea](/assets/img/amqp-idea.png)
  <figcaption>
    The idea.
  </figcaption>
</figure>

The idea is to have a NodeJS module running the Scribe.js web app, listening to an AMQP log queue, and saving all logs send by other modules.

Let’s say we have two types of logs (“normal” and “web”, for logging web requests) corresponding to two different Scribe.js consoles. Each console is implementing the basic loggers (log, info, error, warning, dir).

Let’s also say we’ve chosen the AMQP log messages format to be a stringified JSON object:

```javascript
var log = {
 type: 'warning', //logger name
 tags: [],
 location: {
   filename: 'index.js',
   line: 12
 },
 time: 0000000 //timestamp
 message: 'Hello world'
};
```

# Server

So the aggregator server will be a tiny NodeJS app. Here’s is the Scribe.js config:


```javascript
var scribe = require('scribe-js')({
  createDefaultConsole: false
}),
app = require('express')();

//Handle common logs
var logConsole = scribe.console({
  console: {
    logInConsole: false
  },
  createBasic: true
});

var normalLogger = function (msg) {
  var log = JSON.parse(msg.content.toString());
  //save log
  logConsole.tag.apply(logConsole, log.tags)
     .time(log.time)
     .file(log.location.filename, log.location.line)
     [log.type](log.message);
};

//Handle web logs

var webConsole = scribe.console({
  console: {
    logInConsole: false
  },
  logWriter: {
    rootPath: 'logWeb'
  },
  createBasic: true
});

var webLogger = function (msg) {
  var log = JSON.parse(msg.content.toString());
  //save log
  webConsole.tag.apply(webConsole, log.tags)
   .time(log.time)
   .file(log.location.filename, log.location.line)
   [log.type](log.message);
};

//The WebPanel
app.use('/logs', scribe.webPanel());
app.listen(8080);
```

And all we have to do now is to consume AMQP messages. You simply have to pass the normalLogger and `webLogger` to an amqp consume logic.

```javascript
var rabbit = require('amqplib').connect('amqp://localhost');

rabbit.then(function () {
   //...
   //build your exchange, bind your channel, etc.
   channel.consume(myQueue, normalLogger, { noAck: true });
   //...
});
```

# A module

For a module (NodeJS):

```javascript
var scribe = require('scribe-js')({
  createDefaultConsole: false
});

var console = scribe.console({
  logWriter: false,
  createBasic: true
});

console.on('new', function (log) {
   //send log in an amqp queue
});
```

You can see an example of server + client code [here](https://github.com/guillaumewuip/scribe.js-amqp-aggregator). I’ve split the amqp logic in two much more generic NodeJS modules ([scribe_amqp_server.js](https://github.com/guillaumewuip/scribe.js-amqp-aggregator/blob/master/scribe_amqp_server.js) and [scribe_amqp.js](https://github.com/guillaumewuip/scribe.js-amqp-aggregator/blob/master/scribe_amqp.js)) that you could use with configuration, multiples Scribe.js consoles and so on.


---


With some javascript code and the Scribe.js library you just built a lightweight logs collector. All your logs are now accessible via a web app.

There isn’t always a need for big systems and this solution could suit for sure tiny/medium SOA apps.

# Going further

Client for other languages: as for now, the client module code required just a few lines of config because of the use of Scribe.js. This won’t be the case when using another language. We will have to find a way to listen for logs and send them over AMQP for each of them. (Update: I’ve made a [client for Go](https://github.com/guillaumewuip/console_scribeAmqp.go))

Database for Scribe.js: Scribe.js stores logs in files. It is not the best solution when it comes to scaling. We could think about building a database storage for Scribe.js

---

The full code example : [github.com/guillaumewuip/scribe.js-amqp-aggregator](https://github.com/guillaumewuip/scribe.js-amqp-aggregator)

Scribe.js repo : [github.com/bluejamesbond/Scribe.js](https://github.com/bluejamesbond/Scribe.js)

Icons from [Arthur Shlain](http://thenounproject.com/ArtZ91/).
