---
title: "Using Google less: managing Files"

draft: false

page : false

---

*This is part 2 of [Using Google less]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %}),
a series of posts where I share how and why I've replaced Google services in my
day to day life.*

Here we are! We've decided to stop using Google services and we will start by
moving our files out of Google Drive.

Google Drive is two products in one.

### File hosting

Like a distant hard drive, we can use it to store any file.

It comes with its desktop companion app that will keep a local directory
synced with our distant Drive.
 
### A web-based office suite 

The suite works on proprietary file formats (Docs, Sheet, Slides, etc.) and its
killer feature for me is its collaboration mode.

My last use of Google Doc have been writing article drafts in order to share
them with friends. We can then work on the same file at the same time and they
can comment and suggest changes.

I've also us Slides a lot in the past. I'm used to it and I reuse themes and
slides from one presentation into another.

We need to find alternatives for these two products.

# File hosting

Looking at the files I stored in Google Drive I realised they are very static.
There are administrative files, scan of my ID, payslips,
[Calibre](https://calibre-ebook.com/) library, things like that. There are also
data I've archived here from my student years.

No files I edit everyday and even less that I share with others. 

I only use one computer to access the files so the requirements for the
alternative are versy simple: 

- It should be easy to work with files locally and sync them (auto-sync would be
   great)
- No platform lock. I'm lot leaving Google Drive to be locked with another
    platform.
- No need for too much space. A few dozen Go will be OK.
- Encryption + EU based hosting would be a plus
- Very cheap. It's "just" a distant disk actually, I'm not willing to pay much
    for that.

The alternative I found is very simple: an encrypted S3 bucket synced with a
local directory.

I use [`rclone`](https://rclone.org/) too sync the local directory
with the encrypted bucket. It's works really great and can add an encryption
layer on top of one ressource. I've written a small [LaunchAgents
script](https://github.com/guillaumewuip/Home/blob/32b542be6c04e69b450141e4c4c027e4e5a9a14a/LaunchAgents/com.wuips.backup.sync.plist)
that update the bucket with local changes every hour.

<figure>
  <img alt="Rclone schema" src="/assets/img/google-less-files-rclone.png" />
  <figcaption>A very simple rclone setup</figcaption>
</figure>

**S3 bucket provider**: [Scaleway](scaleway.com) Cloud. 

**Cost**: $0 because Scaleway's buckets are free if under 75Go of storage and
75Go of traffic.

---


  - office suite alternative
    - Docs: https://etherpad.org/ and https://framapad.org/en/, Github +
        markdown
    - Slides: mardown slides
    -

# Backups

# Altervatives

- Classic file hosting services like Dropbox, Box. But closed-source and hosted
    in the US.
- NextCloud, open-source all-in-one solution that you can even host yourself
- your VPS + rsync

