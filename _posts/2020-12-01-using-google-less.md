---
title: Using Google less

draft: false

page : false

---
I've been a faithful user of Google services for a long time. Search, Gmail,
Calendar, Drive, Photos, Translation, Chrome, Maps – I've used a lot of
them. They provide a good user experience and are deeply integrated into one
another. Also, they are free or at least very cheap (I was paying 2€/month for
extra storage).

I've made Google *my personnal platform*. Growing up and learning how to use
Internet, I end up thinking that this was *the way* to use it. Does it sound
familiar?

But, years went by and I learnt more and more about fondamental issues with
Google (and others). You probably have heard of them too.

Platforms like Google have strong social and political impacts[^1] on
societies, not to mention what they do to privacy[^2]. There has also been
recent constroversy about the company acting against its own employees[^3].

At a more personal level, it simply doesn't feel right to give Google a
significant part of my life while they can abruptly shut down down my
account[^4].

How can one be alarmed about these issues and still use Google's services
personnaly? And still *pay* them?

Living with this paradox became harder and harder. It's no surprise that I woke
up one morning a few weeks ago and said to my self: "I should stop using
Google".

Now in the middle of my ["DeGoogle"](https://www.reddit.com/r/degoogle) process,
it's the right time to share my plan. I hope it can inspire you. It's also a way
to force myself to continue on this not-so-easy path. Now that you've read this,
it's harder for me to turn back.

Don't get me wrong. I do find Google products very powerfull. I will certainly
miss a lot of them.

But it's time to take control back.

<div class="guide-chapters" >
<ol>
<li>The plan</li>
<li markdown="1">
[Files]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %})
</li>
<li markdown="1">
[Mails]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %}) 
</li>
<li markdown="1">
[Calendar and contacts]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %}) 
</li>
<li class="tbd">Browser and search (TBD)</li>
<li class="tbd">Photos (TBD)</li>
</ol>
</div>

# The plan 

My plan starts with two important points.

**I have a computer-science background and want to leverage it.** This will be a
bit hacky. That's OK. This is not a mainstream tutorial. I want to learn a bit
of the fondamentals behind the everyday tools.

I will also use this opportunity to use more free and opensource software.
Probably not GUIs but CLIs and terminal stuff a lot. After all I'm a heavy
VIM user: if I can use VIM to write mail I will be a happy person.

This choice will maybe also help me switch from macOS to Linux more easily one
day.

**I have a simple setup: One computer. One smartphone.** Nothing more. I use the
same computer for both personnal activities and work. I also use an iPhone,
mainly to read messages, calendar, maps. Nothing more.

This will help me choose the alternatives that fit my needs.

Because it's a big project, it's better to cut it into smaller parts.

### Managing my [Files]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %})

Switching from Google Drive, Docs, Sheet, and Slides to S3 buckets, Git, 
Markdown, mainly.

### An alternative for my [Mails]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %})

Replacing Gmail with an IMAP mailbox behind my own domain. How to plan a
smooth transition between Gmail and the new mail? What mail client to use?

### A new [Calendar and Contacts]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %}) setup

Using CalDAV and CardDAV standards to replace Google Calendar and Contacts.

### New Browser and new Search engine (TBD)

Chrome and Google Search alternatives. Firefox? Safari? DuckDuckGo?

### How to backup and share my Photos (TBD)

Google Photos was fabulous with its free unlimited storage, but it will be
[discontinued in June,
2021](https://www.theverge.com/2020/11/11/21560810/google-photos-unlimited-cap-free-uploads-15gb-ending).
I need to find an alternative.

That's it! Of course I'm used to other Google services but I found them quite
easy to replace:

- I now use [DeepL](http://deepl.com) instead of Translate

- I've switched from Keep to [Trello](http://trello.com/) a long time ago and I
  now mainly use [Roam](https://roamresearch.com/) for everything related to
  note taking

- It's easy to replace Meet by another video-conferencing tool like
  [Jitsi](https://meet.jit.si/)

- Maps can be replaced by Apple Plans and
  [openstreetmap.org](https://www.openstreetmap.org/). I still need to confirm
  on the long term that nothing important is missing. Considering [OSM is seeing
  huge
  investments](https://joemorrison.medium.com/openstreetmap-is-having-a-moment-dcc7eef1bb01)
  from big companies, I'm quite confident the transition will go well.

# Ending thoughts

Waking up this special worning I decided to stop using Google, I certainly
hadn't in mind how much time consuming such a project can be.

I have to admit I've sometimes chosen the most nerdy and hard-to-setup
alternatives. I can only blame myself. I've tried to list some others –
hopefully more user-friendly ones – in each part of this post for those of you
that don't want to open a terminal to read their mails.

Is it worth it?, you will ask. Beside the obvious "don't let such a company own
your data" argument, I want to share with you the powerfull feeling of relief I
felt once having secured emails, calendar and contacts out of Google reach.

I think it's comparable to what people can feel when they harvest the first
vegetables they grew in their garden. There is a kind of pride in it. You
probably know this feeling too. 

It's also about having become a real actor of its digital life. Now that you own
your domain name, your mails, your calendars, contacts and backups, you have
good fondations to build things up on. You have *control*.

It's about refusing to fell in the passive position created for us. This should
not be the way to use Internet. We must refuse to let GAFAM and other shape what
we see and how we behave.

While such a project is huge, it can be done step by step. Calendar one month,
Files the other, Mails after that. 2021 just started and it's time for one or
two good resolutions. Why not try to "DeGoogle" yourself a bit?

---

[^1]: See on this subject the documentary
    [The Social Dilemma](https://en.wikipedia.org/wiki/The_Social_Dilemma) by
    Jeff Orlowski, ironically available on Netflix.

[^2]: There is a short TED Talk by Gleen Greenwald,
    [Why privacy matters](https://www.ted.com/talks/glenn_greenwald_why_privacy_matters)
    that explains the danger of thinking "I've nothing to hide, so I see no
    problem in using services that make me loose my privacy".

[^3]: Just a few days ago they fired [Timnit Gebru](https://www.theverge.com/2020/12/5/22155985/paper-timnit-gebru-fired-google-large-language-models-search-ai)
    from Google AI ethics team and have been accused again of [having spied on
    workers before firing them](https://www.theverge.com/2020/12/2/22047383/google-spied-workers-before-firing-labor-complaint).

[^4]: You don't have to be a "bad person" for Google to
    [shut down your account](https://www.reddit.com/r/google/comments/6sqgip/google_shuts_down_my_account_after_10_years_of).
    All you have to do after all is doing something that can be interpreted as
    against their terms of service.
